/**
 * Publio Top-Up Service.
 *
 * Sorumlulukları:
 *  - Stripe / iyzico üzerinden top-up paketi satın alma checkout'u oluşturmak
 *  - Ödeme başarılı olduğunda (`checkout.session.completed`) `TopUpPackage`
 *    kaydı atmak ve `Credits` tablosuna negatif tüketim yerine pozitif kredi
 *    eklemek (sistem mevcut bakiyesi `monthlyCredits − sum(Credits.credits)`
 *    formülüyle hesaplandığı için top-up'ı `type='topup'` ile pozitif yerine
 *    negatif değerle yazıyoruz: bu sayede sum azalır → kalan kredi artar).
 *  - Süresi dolmuş top-up'ları temizlemek (`reconcileExpired`).
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import {
  getTopUpPackage,
  TOP_UP_PACKAGES,
  TOP_UP_PACKAGES_TRY,
  TopUpPackageId,
} from './top-up-packages';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_nothing');

@Injectable()
export class TopUpService {
  constructor(
    // Prisma repository helpers — schema migration sonrası "topUpPackage"
    // ve "credits" modelleri otomatik üretilir.
    private readonly _topUp: PrismaRepository<any>,
    private readonly _credits: PrismaRepository<'credits'>,
    private readonly _organization: PrismaRepository<'organization'>
  ) {}

  /**
   * Stripe Checkout (one-time payment) oturumu açar.
   * Webhook `checkout.session.completed` geldiğinde {@link applyPurchase}
   * çağrılır.
   */
  async createCheckout(
    organizationId: string,
    packageId: TopUpPackageId,
    customerId: string,
    returnPath = '/billing?topup=ok'
  ) {
    const pkg = getTopUpPackage(packageId);
    const priceId = process.env[pkg.stripePriceEnv];
    if (!priceId) {
      throw new Error(
        `Top-up price env variable missing: ${pkg.stripePriceEnv}`
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}${returnPath}&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?topup=cancel`,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        service: 'gitroom_topup',
        organizationId,
        packageId,
        credits: String(pkg.credits),
        validityDays: String(pkg.validityDays),
      },
    });

    return { url: session.url, sessionId: session.id };
  }

  /**
   * Stripe webhook handler. `checkout.session.completed` → top-up kaydı.
   */
  async applyPurchaseFromStripe(event: Stripe.CheckoutSessionCompletedEvent) {
    const meta = event.data.object.metadata as Record<string, string>;
    if (meta?.service !== 'gitroom_topup') {
      return { ok: true, skipped: true };
    }

    const { organizationId, packageId, credits, validityDays } = meta;
    const pricePaid = (event.data.object.amount_total ?? 0) / 100;
    const currency = (event.data.object.currency ?? 'usd').toUpperCase();

    return this.applyPurchase({
      organizationId,
      packageId: packageId as TopUpPackageId,
      credits: parseInt(credits, 10) || TOP_UP_PACKAGES.small.credits,
      pricePaid,
      currency,
      paymentRef: event.data.object.id,
      validityDays: parseInt(validityDays, 10) || 365,
    });
  }

  /**
   * iyzico webhook'undan veya manuel tetiklemeden çağrılır.
   * Aynı `paymentRef` ile yeniden çağrılırsa idempotent davranır.
   */
  async applyPurchase(input: {
    organizationId: string;
    packageId: TopUpPackageId | 'custom';
    credits: number;
    pricePaid: number;
    currency: string;
    paymentRef: string;
    validityDays?: number;
  }) {
    const org = await this._organization.model.organization.findUnique({
      where: { id: input.organizationId },
    });
    if (!org) {
      throw new NotFoundException(
        `Organization not found: ${input.organizationId}`
      );
    }

    // İdempotency — aynı paymentRef ile kayıt varsa atla.
    const existing = await this._topUp.model.topUpPackage.findFirst({
      where: { paymentRef: input.paymentRef },
    });
    if (existing) {
      return { ok: true, idempotent: true, id: existing.id };
    }

    const expiresAt = new Date(
      Date.now() + (input.validityDays ?? 365) * 24 * 60 * 60 * 1000
    );

    const created = await this._topUp.model.topUpPackage.create({
      data: {
        organizationId: input.organizationId,
        credits: input.credits,
        packageId: input.packageId,
        pricePaid: input.pricePaid,
        costCurrency: input.currency,
        remainingCredits: input.credits,
        expiresAt,
        paymentRef: input.paymentRef,
      },
    });

    /*
     * Credits tablosu, harcanan miktarı pozitif değerle yazar
     * (sum(credits) = consumed). Top-up için NEGATİF kredi yazıyoruz;
     * sum(credits) düştükçe `monthlyCredits − sum` formülü top-up'ı
     * kullanılabilir bakiye olarak yansıtır.
     */
    await this._credits.model.credits.create({
      data: {
        organizationId: input.organizationId,
        credits: -Math.abs(input.credits),
        type: 'topup',
        action: 'topup.purchase',
        provider: 'stripe',
        topUpId: created.id,
      },
    });

    return { ok: true, id: created.id };
  }

  /**
   * Marketing helper — TR ve USD fiyat listesini döner.
   * Frontend pricing sayfası bu metoda doğrudan erişebilir.
   */
  listPackages(currency: 'USD' | 'TRY' = 'USD') {
    return Object.values(TOP_UP_PACKAGES).map((p) => ({
      id: p.id,
      label: p.label,
      credits: p.credits,
      price:
        currency === 'TRY' ? TOP_UP_PACKAGES_TRY[p.id] : p.priceUsd,
      currency,
    }));
  }

  /** Süresi dolmuş paketleri pasifleştir (cron'dan çağrılır). */
  async reconcileExpired() {
    const now = new Date();
    const expired = await this._topUp.model.topUpPackage.findMany({
      where: {
        expiresAt: { lt: now },
        remainingCredits: { gt: 0 },
      },
      select: { id: true, organizationId: true, remainingCredits: true },
    });

    for (const e of expired) {
      // Kalan krediyi tüket olarak yaz (audit izlenebilir).
      await this._credits.model.credits.create({
        data: {
          organizationId: e.organizationId,
          credits: e.remainingCredits,
          type: 'topup_expired',
          action: 'topup.expire',
          provider: 'internal',
          topUpId: e.id,
        },
      });
      await this._topUp.model.topUpPackage.update({
        where: { id: e.id },
        data: { remainingCredits: 0 },
      });
    }

    return { expired: expired.length };
  }
}
