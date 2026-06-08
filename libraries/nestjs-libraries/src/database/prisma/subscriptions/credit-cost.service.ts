/**
 * Publio credit-cost guardrail & feature-gate helpers.
 *
 * Bu yard\u0131mc\u0131 servis tek bir AI \u00e7a\u011fr\u0131s\u0131 yap\u0131lmadan \u00f6nce \u00e7al\u0131\u015f\u0131r ve:
 *   1) Aksiyonu kataloglan\u0131p kataloglanmad\u0131\u011f\u0131n\u0131,
 *   2) Mevcut tier'\u0131n bu aksiyona izin verip vermedi\u011fini,
 *   3) Plan dahil kredinin yeterli olup olmad\u0131\u011f\u0131n\u0131,
 *   4) Tek \u00e7a\u011fr\u0131 hard-cap'\u0131n\u0131 ($0.50) a\u015f\u0131p a\u015fmad\u0131\u011f\u0131n\u0131
 * tek noktadan kontrol eder. Hata durumunda RFC-7807 tarz\u0131 anlaml\u0131 hatalar
 * f\u0131rlat\u0131r.
 */

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CREDIT_CATALOG,
  CREDIT_PER_CALL_HARD_CAP_USD,
  CreditAction,
  CreditActionId,
} from './credit-catalog';
import {
  brandTierFor,
  hasFeature,
  FeatureKey,
  isAtLeast,
  LegacyTier,
  MONTHLY_CREDITS,
  PlanTier,
} from './plan-features';
import { pricing } from './pricing';

export class CreditGuardrailException extends HttpException {
  constructor(
    public readonly code:
      | 'unknown_action'
      | 'tier_too_low'
      | 'feature_disabled'
      | 'cost_cap_exceeded'
      | 'insufficient_credits'
      | 'burst_cap_exceeded',
    message: string,
    extra: Record<string, unknown> = {}
  ) {
    super(
      {
        code,
        message,
        ...extra,
      },
      HttpStatus.PAYMENT_REQUIRED
    );
  }
}

export interface CreditCheckInput {
  organizationId: string;
  /** Credits modelinden ay ba\u015f\u0131ndan beri t\u00fcketilen toplam (sums type='credit'). */
  consumedThisCycle: number;
  /** Aktif top-up paketlerinde kalan kredi (plan dahil t\u00fckenince kullan\u0131l\u0131r). */
  topUpRemaining?: number;
  /** DB'de y\u00fckl\u00fc legacy tier (FREE/STANDARD/...). */
  dbTier: LegacyTier | null;
  /** isEnterprise ise plan limitleri override edilir. */
  isEnterprise?: boolean;
  /** \u00c7a\u011fr\u0131lacak aksiyon id'si. */
  actionId: CreditActionId;
  /** Override edilmi\u015f maliyet (sa\u011flay\u0131c\u0131 ger\u00e7ek faturas\u0131 d\u00f6nd\u00fcyse). */
  costUsdOverride?: number;
  /** M\u00fc\u015fteri kendi anahtar\u0131yla \u00e7a\u011f\u0131rd\u0131ysa (BYOK) kredi d\u00fc\u015f\u00fcm\u00fc yap\u0131lmaz. */
  byok?: boolean;
  /** Tier + feature gating'i atla (\u00f6r. video ak\u0131\u015f\u0131 gating'i ayr\u0131ca yap\u0131yorsa). */
  skipTierFeature?: boolean;
  /** Tek-\u00e7a\u011fr\u0131 USD hard-cap'\u0131n\u0131 atla (\u00f6r. pahal\u0131 video sa\u011flay\u0131c\u0131lar\u0131). */
  skipCostCap?: boolean;
  /** Aktif ucretsiz deneme (trial) - kredi tavani dusurulur. */
  trialActive?: boolean;
  /** Trial suresince izin verilen toplam kredi tavani. */
  trialCreditCap?: number;
}

export interface CreditCheckResult {
  action: CreditAction;
  brandTier: PlanTier;
  creditsToCharge: number;
  costUsd: number;
  burstUsed: boolean;
  monthlyAllowance: number;
  remainingAfter: number;
  /** Plan dahil ayl\u0131k krediden d\u00fc\u015fecek tutar. */
  fromMonthly: number;
  /** Top-up bakiyesinden d\u00fc\u015fecek tutar. */
  fromTopUp: number;
}

@Injectable()
export class CreditCostService {
  /**
   * \u00c7a\u011fr\u0131 \u00f6ncesi pre-check. AT\u0130C: bu metod mutasyon yapmaz \u2014 sadece
   * f\u0131rlat\u0131r veya plan/aksiyon \u00f6zelliklerini d\u00f6ner. Ger\u00e7ek d\u00fc\u015f\u00fc\u015f\u00fc
   * SubscriptionRepository.useCredit yapar.
   */
  precheck(input: CreditCheckInput): CreditCheckResult {
    const action = CREDIT_CATALOG[input.actionId];
    if (!action) {
      throw new CreditGuardrailException(
        'unknown_action',
        `Bilinmeyen aksiyon: ${input.actionId}`
      );
    }

    const brand = brandTierFor(input.dbTier, !!input.isEnterprise);

    if (!input.skipTierFeature) {
      // 1) Tier kontrol\u00fc
      if (!isAtLeast(brand, action.minTier)) {
        throw new CreditGuardrailException(
          'tier_too_low',
          `${action.label} en az ${action.minTier} plan\u0131 gerektirir.`,
          { required: action.minTier, current: brand }
        );
      }

      // 2) Feature flag (HeyGen/Runway/Pika \u2026)
      const featureKey = featureKeyForProvider(action.provider);
      if (featureKey && !hasFeature(brand, featureKey)) {
        throw new CreditGuardrailException(
          'feature_disabled',
          `Plan\u0131n\u0131z bu \u00f6zelli\u011fi i\u00e7ermiyor (${featureKey}).`,
          { feature: featureKey, current: brand }
        );
      }
    }

    const costUsd = input.costUsdOverride ?? action.costUsd;

    // 3) Hard cost cap (video kategorisi ve a\u00e7\u0131k skip d\u0131\u015f\u0131nda)
    if (
      !input.skipCostCap &&
      action.category !== 'video' &&
      costUsd > CREDIT_PER_CALL_HARD_CAP_USD
    ) {
      throw new CreditGuardrailException(
        'cost_cap_exceeded',
        `Tek \u00e7a\u011fr\u0131 maliyeti $${costUsd.toFixed(3)} \u2014 limit $${CREDIT_PER_CALL_HARD_CAP_USD}.`,
        { costUsd, cap: CREDIT_PER_CALL_HARD_CAP_USD }
      );
    }

    const monthlyAllowance =
      MONTHLY_CREDITS[brand] ??
      pricing[input.dbTier ?? 'FREE']?.monthly_credits ??
      0;

    // BYOK: m\u00fc\u015fteri kendi anahtar\u0131n\u0131 kulland\u0131\u011f\u0131 i\u00e7in kredi d\u00fc\u015f\u00fclmez.
    const effectiveAllowance =
      input.trialActive && typeof input.trialCreditCap === 'number'
        ? Math.min(monthlyAllowance, input.trialCreditCap)
        : monthlyAllowance;

    if (input.byok) {
      return {
        action,
        brandTier: brand,
        creditsToCharge: action.credits,
        costUsd,
        burstUsed: false,
        monthlyAllowance: effectiveAllowance,
        remainingAfter: effectiveAllowance,
        fromMonthly: 0,
        fromTopUp: 0,
      };
    }

    // 4) Plan dahil + top-up bakiyesi yeter mi?
    const monthlyRemaining = Math.max(
      0,
      effectiveAllowance - input.consumedThisCycle
    );
    // Trial sirasinda top-up devreye girmez (deneme = saf plan tavani).
    const topUpRemaining = input.trialActive ? 0 : input.topUpRemaining ?? 0;
    const available = monthlyRemaining + topUpRemaining;

    if (action.credits > available) {
      throw new CreditGuardrailException(
        'insufficient_credits',
        `Yetersiz kredi. Gereken ${action.credits}, kalan ${available}. ` +
          `L\u00fctfen plan y\u00fckseltin veya top-up al\u0131n.`,
        {
          required: action.credits,
          monthlyRemaining,
          topUpRemaining,
          available,
        }
      );
    }

    const fromMonthly = Math.min(action.credits, monthlyRemaining);
    const fromTopUp = action.credits - fromMonthly;

    return {
      action,
      brandTier: brand,
      creditsToCharge: action.credits,
      costUsd,
      burstUsed: fromTopUp > 0,
      monthlyAllowance: effectiveAllowance,
      remainingAfter: available - action.credits,
      fromMonthly,
      fromTopUp,
    };
  }

  /** Feature anahtar\u0131 olmadan da \u00e7a\u011fr\u0131labilen sadece-tier asserter. */
  assertFeature(
    dbTier: LegacyTier | null,
    feature: FeatureKey,
    isEnterprise = false
  ): void {
    const brand = brandTierFor(dbTier, isEnterprise);
    if (!hasFeature(brand, feature)) {
      throw new CreditGuardrailException(
        'feature_disabled',
        `Bu \u00f6zellik (${feature}) ${brand} plan\u0131nda yok.`,
        { feature, current: brand }
      );
    }
  }
}

function featureKeyForProvider(
  p: CreditAction['provider']
): FeatureKey | null {
  switch (p) {
    case 'heygen':
      return 'video.heyGen';
    case 'runway':
      return 'video.runway';
    case 'pika':
      return 'video.pika';
    case 'synthesia':
      return 'video.synthesia';
    case 'midjourney':
    case 'ideogram':
      return 'image.advanced';
    case 'anthropic':
      return 'ai.proModels';
    case 'elevenlabs':
      return 'ai.proModels';
    default:
      return null;
  }
}
