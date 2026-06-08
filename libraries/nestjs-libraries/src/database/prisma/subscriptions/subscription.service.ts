import { Injectable } from '@nestjs/common';
import { pricing } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing';
import { SubscriptionRepository } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { CreditCostService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-cost.service';
import { CreditActionId } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-catalog';
import {
  TRIAL_CREDIT_CAP,
  TRIAL_DAYS,
} from '@gitroom/nestjs-libraries/database/prisma/subscriptions/credit-catalog';
import { LegacyTier } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/plan-features';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { Organization } from '@prisma/client';
import dayjs from 'dayjs';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly _subscriptionRepository: SubscriptionRepository,
    private readonly _integrationService: IntegrationService,
    private readonly _organizationService: OrganizationService,
    private readonly _creditCostService: CreditCostService
  ) {}

  getSubscriptionByOrganizationId(organizationId: string) {
    return this._subscriptionRepository.getSubscriptionByOrganizationId(
      organizationId
    );
  }

  useCredit<T>(
    organization: Organization,
    type = 'ai_images',
    func: () => Promise<T>
  ): Promise<T> {
    return this._subscriptionRepository.useCredit(organization, type, func);
  }

  /**
   * Yeni model: aksiyon ba\u015f\u0131 de\u011fi\u015fken kredi + sa\u011flay\u0131c\u0131 maliyeti ile d\u00fc\u015f\u00fcm.
   * Mevcut k\u00fct\u00fcphane k\u00f6\u015felerinden \u00e7a\u011fr\u0131lacak yeni AI ak\u0131\u015flar\u0131
   * (HeyGen, Runway, Pika, agent-hour\u2026) bu metodu kullanmal\u0131d\u0131r.
   */
  useCreditWithCost<T>(
    organization: Organization,
    opts: {
      type?: string;
      credits: number;
      costUsd?: number;
      provider?: string;
      action?: string;
      byok?: boolean;
      topUpId?: string;
    },
    func: () => Promise<T>
  ): Promise<T> {
    return this._subscriptionRepository.useCreditWithCost(
      organization,
      opts,
      func
    );
  }

  /**
   * Faturalandırma döngüsünün başlangıcını hesaplar (abonelik createdAt'ten
   * itibaren aylık ilerletilir).
   */
  private cycleStart(createdAt?: Date | null): dayjs.Dayjs {
    let date = dayjs(createdAt ?? new Date());
    while (date.isBefore(dayjs())) {
      date = date.add(1, 'month');
    }
    return date.subtract(1, 'month');
  }

  /**
   * Dinamik ucretsiz-deneme durumu. Trial, Stripe `isTrailing` bayragi ile
   * aktiftir ve abonelik baslangicindan itibaren 7 gun (TRIAL_DAYS) dinamik
   * olarak hesaplanir. Trial suresince AI kredi tuketimi TRIAL_CREDIT_CAP ile
   * sinirlidir (zarar korumasi).
   */
  getTrialStatus(
    organization: Organization,
    subscription?: { createdAt?: Date | null } | null
  ): {
    active: boolean;
    endsAt: Date | null;
    daysLeft: number;
    creditCap: number;
  } {
    const active = !!organization?.isTrailing;
    const start = dayjs(subscription?.createdAt ?? organization?.createdAt);
    const end = start.add(TRIAL_DAYS, 'day');
    const daysLeft = active ? Math.max(0, end.diff(dayjs(), 'day')) : 0;
    return {
      active,
      endsAt: active ? end.toDate() : null,
      daysLeft,
      creditCap: TRIAL_CREDIT_CAP,
    };
  }

  /**
   * Birleşik kredi tüketimi (Publio credit-pricing).
   *
   * Tek bir AI aksiyonu (catalog id) için:
   *   1) Tier + feature gating (skipTierFeature ile atlanabilir),
   *   2) Plan dahil aylık + top-up bakiyesi yeterlilik kontrolü,
   *   3) Aylık → top-up sırasıyla düşüm,
   *   4) BYOK ise düşüm yok (yalnızca audit log),
   *   5) Hata olursa tam refund.
   *
   * AI üretim akışları (görsel/video/agent) bu metodu kullanmalıdır.
   */
  async chargeCredit<T>(
    organization: Organization,
    actionId: CreditActionId,
    func: () => Promise<T>,
    options?: {
      costUsdOverride?: number;
      skipTierFeature?: boolean;
      skipCostCap?: boolean;
      type?: string;
    }
  ): Promise<T> {
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(
        organization.id
      );
    const dbTier = (subscription?.subscriptionTier ?? 'FREE') as LegacyTier;
    const isEnterprise = !!(subscription as any)?.isEnterprise;
    const byok = !!(subscription as any)?.byokApiKeyEnc;

    const from = this.cycleStart(subscription?.createdAt);
    const consumedThisCycle =
      await this._subscriptionRepository.getConsumedCreditsFrom(
        organization.id,
        from
      );
    const topUpRemaining = byok
      ? 0
      : await this._subscriptionRepository.getTopUpRemaining(organization.id);

    const trial = this.getTrialStatus(organization, subscription);

    const check = this._creditCostService.precheck({
      organizationId: organization.id,
      consumedThisCycle,
      topUpRemaining,
      dbTier,
      isEnterprise,
      actionId,
      costUsdOverride: options?.costUsdOverride,
      byok,
      skipTierFeature: options?.skipTierFeature,
      skipCostCap: options?.skipCostCap,
      trialActive: trial.active,
      trialCreditCap: trial.creditCap,
    });

    return this._subscriptionRepository.applyCreditCharge(
      organization,
      {
        action: check.action.id,
        provider: check.action.provider,
        costUsd: check.costUsd,
        fromMonthly: check.fromMonthly,
        fromTopUp: check.fromTopUp,
        byok,
        type: options?.type ?? 'ai_credits',
      },
      func
    );
  }

  /**
   * Organizasyonun toplam kullanılabilir kredisi (plan dahil kalan + top-up).
   * Hızlı ön-kontroller için kullanılır (örn. controller seviyesinde block).
   */
  async getRemainingCredits(organization: Organization): Promise<number> {
    const subscription =
      await this._subscriptionRepository.getSubscriptionByOrganizationId(
        organization.id
      );
    const dbTier = (subscription?.subscriptionTier ?? 'FREE') as LegacyTier;
    if (dbTier === 'FREE' || !subscription) {
      return this._subscriptionRepository.getTopUpRemaining(organization.id);
    }

    const monthlyAllowance =
      (subscription as any)?.monthlyCredits ??
      pricing[dbTier]?.monthly_credits ??
      0;
    // Trial sirasinda efektif tavan TRIAL_CREDIT_CAP ile sinirlidir.
    const trial = this.getTrialStatus(organization, subscription);
    const effectiveAllowance = trial.active
      ? Math.min(monthlyAllowance, trial.creditCap)
      : monthlyAllowance;
    const from = this.cycleStart(subscription.createdAt);
    const consumed =
      await this._subscriptionRepository.getConsumedCreditsFrom(
        organization.id,
        from
      );
    // Trial sirasinda top-up bakiyesi devreye girmez.
    const topUp = trial.active
      ? 0
      : await this._subscriptionRepository.getTopUpRemaining(organization.id);
    return Math.max(0, effectiveAllowance - consumed) + topUp;
  }

  getCode(code: string) {
    return this._subscriptionRepository.getCode(code);
  }

  async deleteSubscription(customerId: string) {
    await this.modifySubscription(
      customerId,
      pricing.FREE.channel || 0,
      'FREE'
    );
    return this._subscriptionRepository.deleteSubscriptionByCustomerId(
      customerId
    );
  }

  updateCustomerId(organizationId: string, customerId: string) {
    return this._subscriptionRepository.updateCustomerId(
      organizationId,
      customerId
    );
  }

  async checkSubscription(organizationId: string, subscriptionId: string) {
    return await this._subscriptionRepository.checkSubscription(
      organizationId,
      subscriptionId
    );
  }

  async modifySubscriptionByOrg(
    organizationId: string,
    totalChannels: number,
    billing: 'FREE' | 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE'
  ) {
    if (!organizationId) {
      return false;
    }

    const getCurrentSubscription =
      (await this._subscriptionRepository.getSubscriptionByOrgId(
        organizationId
      ))!;

    const from = pricing[getCurrentSubscription?.subscriptionTier || 'FREE'];
    const to = pricing[billing];

    const currentTotalChannels = (
      await this._integrationService.getIntegrationsList(organizationId)
    ).filter((f) => !f.disabled);

    if (currentTotalChannels.length > totalChannels) {
      await this._integrationService.disableIntegrations(
        organizationId,
        currentTotalChannels.length - totalChannels
      );
    }

    if (from.team_members && !to.team_members) {
      await this._organizationService.disableOrEnableNonSuperAdminUsers(
        organizationId,
        true
      );
    }

    if (!from.team_members && to.team_members) {
      await this._organizationService.disableOrEnableNonSuperAdminUsers(
        organizationId,
        false
      );
    }

    if (billing === 'FREE') {
      await this._integrationService.changeActiveCron(organizationId);
    }

    return true;
  }

  async modifySubscription(
    customerId: string,
    totalChannels: number,
    billing: 'FREE' | 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE'
  ) {
    if (!customerId) {
      return false;
    }

    const getOrgByCustomerId =
      await this._subscriptionRepository.getOrganizationByCustomerId(
        customerId
      );

    const getCurrentSubscription =
      (await this._subscriptionRepository.getSubscriptionByCustomerId(
        customerId
      ))!;

    if (
      !getOrgByCustomerId ||
      (getCurrentSubscription && getCurrentSubscription?.isLifetime)
    ) {
      return false;
    }

    const from = pricing[getCurrentSubscription?.subscriptionTier || 'FREE'];
    const to = pricing[billing];

    const currentTotalChannels = (
      await this._integrationService.getIntegrationsList(
        getOrgByCustomerId?.id!
      )
    ).filter((f) => !f.disabled);

    if (currentTotalChannels.length > totalChannels) {
      await this._integrationService.disableIntegrations(
        getOrgByCustomerId?.id!,
        currentTotalChannels.length - totalChannels
      );
    }

    if (from.team_members && !to.team_members) {
      await this._organizationService.disableOrEnableNonSuperAdminUsers(
        getOrgByCustomerId?.id!,
        true
      );
    }

    if (!from.team_members && to.team_members) {
      await this._organizationService.disableOrEnableNonSuperAdminUsers(
        getOrgByCustomerId?.id!,
        false
      );
    }

    if (billing === 'FREE') {
      await this._integrationService.changeActiveCron(getOrgByCustomerId?.id!);
    }

    return true;
  }

  async createOrUpdateSubscription(
    isTrailing: boolean,
    identifier: string,
    customerId: string,
    totalChannels: number,
    billing: 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE',
    period: 'MONTHLY' | 'YEARLY',
    cancelAt: number | null,
    code?: string,
    org?: string
  ) {
    if (!code) {
      try {
        const load = await this.modifySubscription(
          customerId,
          totalChannels,
          billing
        );
        if (!load) {
          return {};
        }
      } catch (e) {
        return {};
      }
    }
    return this._subscriptionRepository.createOrUpdateSubscription(
      isTrailing,
      identifier,
      customerId,
      totalChannels,
      billing,
      period,
      cancelAt,
      code,
      org ? { id: org } : undefined
    );
  }

  getSubscriptionByIdentifier(identifier: string) {
    return this._subscriptionRepository.getSubscriptionByIdentifier(identifier);
  }

  async getSubscription(organizationId: string) {
    return this._subscriptionRepository.getSubscription(organizationId);
  }

  async checkCredits(organization: Organization, checkType = 'ai_images') {
    // @ts-ignore
    const type = organization?.subscription?.subscriptionTier || 'FREE';

    if (type === 'FREE') {
      return { credits: 0 };
    }

    // @ts-ignore
    let date = dayjs(organization.subscription.createdAt);
    while (date.isBefore(dayjs())) {
      date = date.add(1, 'month');
    }

    const checkFromMonth = date.subtract(1, 'month');

    /*
     * Publio credit-pricing model:
     *   - `ai_credits` checkType bekleniyorsa plan dahil ayl\u0131k Publio Credit
     *     (`monthly_credits`) baz\u0131nda kalan tutar\u0131 d\u00f6nd\u00fcr\u00fcr.
     *   - `ai_images` / `ai_videos` eski sayma\u00e7lar\u0131 \u2014 geriye d\u00f6n\u00fck uyumluluk
     *     i\u00e7in mevcut alanlar\u0131 kullanmaya devam eder.
     */
    let allowance: number;
    if (checkType === 'ai_credits') {
      allowance = pricing[type].monthly_credits ?? 0;
    } else if (checkType === 'ai_images') {
      allowance = pricing[type].image_generation_count;
    } else {
      allowance = pricing[type].generate_videos;
    }

    const totalUse = await this._subscriptionRepository.getCreditsFrom(
      organization.id,
      checkFromMonth,
      checkType
    );

    return {
      credits: allowance - totalUse,
    };
  }

  async addSubscription(orgId: string, userId: string, subscription: any) {
    await this._subscriptionRepository.setCustomerId(orgId, userId);
    return this.createOrUpdateSubscription(
      false,
      makeId(5),
      userId,
      pricing[subscription].channel!,
      subscription,
      'MONTHLY',
      null,
      undefined,
      orgId
    );
  }
}
