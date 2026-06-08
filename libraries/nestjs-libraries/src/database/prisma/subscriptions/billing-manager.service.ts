import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { Organization } from '@prisma/client';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { SubscriptionRepository } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { TopUpService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/top-up.service';
import { CreditCostService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-cost.service';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import {
  CREDIT_CATALOG,
  CREDIT_USD_PRICE,
  TRIAL_CREDIT_CAP,
  TRIAL_DAYS,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-catalog';
import {
  brandTierFor,
  burstCapFor,
  LegacyTier,
  MONTHLY_CREDITS,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/plan-features';
import {
  TOP_UP_PACKAGES,
  TopUpPackageId,
  getTopUpPackage,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/top-up-packages';

/**
 * Publio Billing Manager — gelir motorunun kullanıcıya bakan orkestrasyon katmanı.
 *
 * Controller >> Manager >> Service >> Repository zincirinde "Manager" rolünü üstlenir;
 * kredi bakiyesi, tüketim şeffaflığı, top-up satın alma ve BYOK (bring-your-own-key)
 * yönetimini tek noktadan toplar. Hiçbir AI tüketimi burada YAPILMAZ — yalnızca
 * okuma + faturalandırma yan etkileri (checkout / BYOK kaydı) yönetilir.
 */
@Injectable()
export class BillingManagerService {
  constructor(
    private readonly _subscriptionRepository: SubscriptionRepository,
    private readonly _stripeService: StripeService,
    private readonly _topUpService: TopUpService,
    private readonly _creditCostService: CreditCostService
  ) {}

  /**
   * Mevcut faturalandırma döngüsünün başlangıcını hesaplar.
   * Abonelik `createdAt`'ten itibaren aylık olarak ilerletilir; bu sayede her
   * kullanıcı kendi yenilenme gününe göre kredi sıfırlanması yaşar.
   */
  private cycleStart(createdAt: Date): dayjs.Dayjs {
    let date = dayjs(createdAt);
    while (date.isBefore(dayjs())) {
      date = date.add(1, 'month');
    }
    return date.subtract(1, 'month');
  }

  /**
   * Organizasyonun anlık kredi bakiyesini döner:
   *  - plan dahil aylık kredi (allowance)
   *  - bu döngüde tüketilen
   *  - plan dahil kalan
   *  - top-up'larda kalan
   *  - toplam kullanılabilir + burst tavanı
   */
  async getCreditBalance(org: Organization) {
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(
        org.id
      );

    const dbTier = (subscription?.subscriptionTier ?? 'FREE') as LegacyTier;
    const isEnterprise = !!(subscription as any)?.isEnterprise;
    const brandTier = brandTierFor(dbTier, isEnterprise);

    const monthlyAllowance =
      (subscription as any)?.monthlyCredits ??
      MONTHLY_CREDITS[brandTier] ??
      pricing[dbTier]?.monthly_credits ??
      0;

    const burstCap = burstCapFor(brandTier);

    // Dinamik ucretsiz-deneme durumu (7 gun) + deneme kredi tavani.
    const trialActive = !!org.isTrailing;
    const trialStart = dayjs(subscription?.createdAt ?? org.createdAt);
    const trialEndsAt = trialStart.add(TRIAL_DAYS, 'day');
    const trialDaysLeft = trialActive
      ? Math.max(0, trialEndsAt.diff(dayjs(), 'day'))
      : 0;
    const trial = {
      active: trialActive,
      endsAt: trialActive ? trialEndsAt.toDate() : null,
      daysLeft: trialDaysLeft,
      creditCap: TRIAL_CREDIT_CAP,
    };
    const effectiveAllowance = trialActive
      ? Math.min(monthlyAllowance, TRIAL_CREDIT_CAP)
      : monthlyAllowance;

    if (!subscription || dbTier === 'FREE') {
      const topUpRemaining = await this._subscriptionRepository.getTopUpRemaining(
        org.id
      );
      return {
        tier: dbTier,
        brandTier,
        monthlyAllowance: effectiveAllowance,
        consumed: 0,
        monthlyRemaining: 0,
        topUpRemaining,
        totalRemaining: topUpRemaining,
        burstCap,
        trial,
        byok: this._byokStatus(subscription),
      };
    }

    const from = this.cycleStart(subscription.createdAt);
    const consumed = await this._subscriptionRepository.getConsumedCreditsFrom(
      org.id,
      from
    );
    // Trial sirasinda top-up devreye girmez.
    const topUpRemaining = trialActive
      ? 0
      : await this._subscriptionRepository.getTopUpRemaining(org.id);

    const monthlyRemaining = Math.max(0, effectiveAllowance - consumed);

    return {
      tier: dbTier,
      brandTier,
      monthlyAllowance: effectiveAllowance,
      consumed,
      monthlyRemaining,
      topUpRemaining,
      totalRemaining: monthlyRemaining + topUpRemaining,
      burstCap,
      trial,
      byok: this._byokStatus(subscription),
    };
  }

  /** Sağlayıcı bazında tüketim/maliyet dökümü (şeffaflık paneli). */
  async getUsageBreakdown(org: Organization) {
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(
        org.id
      );

    const from = this.cycleStart(subscription?.createdAt ?? new Date());
    const breakdown = await this._subscriptionRepository.getUsageBreakdownFrom(
      org.id,
      from
    );

    return {
      cycleStart: from.toISOString(),
      breakdown,
      totalCredits: breakdown.reduce((s, b) => s + b.credits, 0),
      totalCostUsd: Number(
        breakdown.reduce((s, b) => s + b.costUsd, 0).toFixed(4)
      ),
    };
  }

  /**
   * Kredi kataloğunu (her AI aksiyonunun kredi maliyeti + kullanıcı fiyatı)
   * şeffaf biçimde döner. Pricing sayfası ve uygulama içi "kredi rehberi"
   * bu listeyi kullanır.
   */
  getCreditCatalog() {
    return Object.values(CREDIT_CATALOG).map((a) => ({
      id: a.id,
      label: a.label,
      category: a.category,
      credits: a.credits,
      priceUsd: Number((a.credits * CREDIT_USD_PRICE).toFixed(4)),
      provider: a.provider,
      minTier: a.minTier,
      topUpAllowed: a.topUpAllowed,
    }));
  }

  /** Top-up paket listesi (USD veya TRY). */
  listTopUpPackages(currency: 'USD' | 'TRY' = 'USD') {
    return this._topUpService.listPackages(currency);
  }

  /**
   * Top-up satın alma için Stripe Checkout oturumu açar.
   * Kullanıcı ödemeyi tamamladığında webhook `applyPurchaseFromStripe` çalışır.
   */
  async createTopUpCheckout(
    org: Organization,
    packageId: string,
    returnPath?: string
  ) {
    if (!(packageId in TOP_UP_PACKAGES)) {
      throw new BadRequestException(`Unknown top-up package: ${packageId}`);
    }

    // Paket geçerli mi (env price kontrolü createCheckout içinde yapılır).
    getTopUpPackage(packageId);

    const customer = await this._stripeService.getCustomerByOrganizationId(
      org.id
    );
    if (!customer) {
      throw new BadRequestException(
        'Önce bir abonelik/ödeme yöntemi tanımlamanız gerekiyor.'
      );
    }

    return this._topUpService.createCheckout(
      org.id,
      packageId as TopUpPackageId,
      customer,
      returnPath
    );
  }

  /**
   * BYOK (bring-your-own-key) anahtarını şifreleyip kaydeder.
   * Yalnızca planında `byok` feature'ı açık olan (ENTERPRISE / sözleşmeli)
   * organizasyonlar için izinlidir; aksi halde guardrail hatası döner.
   */
  async setByok(org: Organization, provider: string, apiKey: string) {
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(
        org.id
      );
    const dbTier = (subscription?.subscriptionTier ?? 'FREE') as LegacyTier;
    const isEnterprise = !!(subscription as any)?.isEnterprise;

    // Feature gate — izinli değilse PAYMENT_REQUIRED fırlatır.
    this._creditCostService.assertFeature(dbTier, 'byok', isEnterprise);

    if (!apiKey || apiKey.trim().length < 8) {
      throw new BadRequestException('Geçersiz API anahtarı.');
    }

    const enc = AuthService.fixedEncryption(apiKey.trim());
    await this._subscriptionRepository.setByok(org.id, provider, enc);

    return { ok: true, provider };
  }

  /** BYOK durumunu döner (anahtarı ASLA döndürmez, yalnızca maskeli bilgi). */
  async getByokStatus(org: Organization) {
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(
        org.id
      );
    return this._byokStatus(subscription);
  }

  /** BYOK anahtarını kaldırır → varsayılan resale (Publio Credits) moduna döner. */
  async clearByok(org: Organization) {
    await this._subscriptionRepository.clearByok(org.id);
    return { ok: true };
  }

  private _byokStatus(subscription: any) {
    return {
      enabled: !!subscription?.byokApiKeyEnc,
      provider: subscription?.byokProvider ?? null,
    };
  }
}
