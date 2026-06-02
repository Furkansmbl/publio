/**
 * Publio plan & feature mapping.
 *
 * Mevcut Prisma `SubscriptionTier` enum değerleri (FREE/STANDARD/TEAM/PRO/ULTIMATE)
 * korunur. Bu modül, eski enum değerlerini yeni Publio markası altındaki plan
 * adlarına eşler ve her plan için aylık kredi tavanı + feature-flag listesi
 * sağlar. Böylece DB migrasyonu olmadan, kullanıcıya gösterilen brand ile kod
 * tarafındaki tier ayrı evrim geçirebilir.
 *
 * Eşleme tablosu (legacy → Publio):
 *   FREE       → Free trial (kapsamsız)
 *   STANDARD   → Starter
 *   TEAM       → Creator
 *   PRO        → Pro          (en popüler)
 *   ULTIMATE   → Agency
 *   (yeni)     → Business     — gelecek migration'da BUSINESS enum'u eklenecek
 *   (yeni)     → Enterprise   — quote-based; özel bayrak
 */

import { PlanTier } from './credit-catalog';

export type LegacyTier = 'FREE' | 'STANDARD' | 'TEAM' | 'PRO' | 'ULTIMATE';

/** Legacy enum → Publio brand id eşlemesi (kullanıcıya gösterilen). */
export const LEGACY_TO_BRAND: Record<LegacyTier, PlanTier> = {
  FREE: 'FREE',
  STANDARD: 'STARTER',
  TEAM: 'CREATOR',
  PRO: 'PRO',
  ULTIMATE: 'AGENCY',
};

/** Brand id → legacy enum (DB'ye yazılırken). */
export const BRAND_TO_LEGACY: Record<PlanTier, LegacyTier> = {
  FREE: 'FREE',
  STARTER: 'STANDARD',
  CREATOR: 'TEAM',
  PRO: 'PRO',
  // BUSINESS henüz enum'da olmadığı için en yakın üst tier'a (ULTIMATE) çekiyoruz.
  BUSINESS: 'ULTIMATE',
  AGENCY: 'ULTIMATE',
  // ENTERPRISE de migration'a kadar ULTIMATE altında "isEnterprise" flag ile
  // ayırt edilmelidir.
  ENTERPRISE: 'ULTIMATE',
};

export type FeatureKey =
  | 'ai.basic'
  | 'ai.proModels'
  | 'image.advanced'         // Ideogram / Midjourney
  | 'video.heyGen'
  | 'video.runway'
  | 'video.pika'
  | 'video.synthesia'
  | 'workflow.agent'
  | 'team.approvals'
  | 'team.unlimitedSeats'
  | 'whitelabel'
  | 'api.public'
  | 'sso.saml'
  | 'audit.log'
  | 'sla.99_9'
  | 'byok'
  | 'support.priority'
  | 'support.dedicated';

/** Plan başına aylık kredi tavanı (pricing-strategy.md ile aynı). */
export const MONTHLY_CREDITS: Record<PlanTier, number> = {
  FREE: 0,
  STARTER: 1_000,
  CREATOR: 4_000,
  PRO: 12_000,
  BUSINESS: 35_000,
  AGENCY: 100_000,
  ENTERPRISE: 500_000, // varsayılan; sözleşmede üzerine yazılır
};

/**
 * Burst tavanı: kullanıcı, plan dahil kredisinin %150'sine kadar harcayabilir;
 * bu sınırı aşan istekler soft-stop ile engellenir.
 */
export const BURST_MULTIPLIER = 1.5;

export function burstCapFor(tier: PlanTier): number {
  return Math.floor(MONTHLY_CREDITS[tier] * BURST_MULTIPLIER);
}

/** Tier başına aktif feature'lar. */
export const TIER_FEATURES: Record<PlanTier, FeatureKey[]> = {
  FREE: [],
  STARTER: ['ai.basic', 'api.public'],
  CREATOR: [
    'ai.basic',
    'ai.proModels',
    'image.advanced',
    'api.public',
  ],
  PRO: [
    'ai.basic',
    'ai.proModels',
    'image.advanced',
    'video.heyGen',
    'video.runway',
    'video.pika',
    'workflow.agent',
    'team.approvals',
    'api.public',
    'support.priority',
  ],
  BUSINESS: [
    'ai.basic',
    'ai.proModels',
    'image.advanced',
    'video.heyGen',
    'video.runway',
    'video.pika',
    'workflow.agent',
    'team.approvals',
    'team.unlimitedSeats',
    'whitelabel',
    'audit.log',
    'api.public',
    'support.priority',
  ],
  AGENCY: [
    'ai.basic',
    'ai.proModels',
    'image.advanced',
    'video.heyGen',
    'video.runway',
    'video.pika',
    'video.synthesia',
    'workflow.agent',
    'team.approvals',
    'team.unlimitedSeats',
    'whitelabel',
    'audit.log',
    'api.public',
    'support.dedicated',
  ],
  ENTERPRISE: [
    'ai.basic',
    'ai.proModels',
    'image.advanced',
    'video.heyGen',
    'video.runway',
    'video.pika',
    'video.synthesia',
    'workflow.agent',
    'team.approvals',
    'team.unlimitedSeats',
    'whitelabel',
    'audit.log',
    'api.public',
    'sso.saml',
    'sla.99_9',
    'byok',
    'support.dedicated',
  ],
};

const TIER_ORDER: PlanTier[] = [
  'FREE',
  'STARTER',
  'CREATOR',
  'PRO',
  'BUSINESS',
  'AGENCY',
  'ENTERPRISE',
];

export function tierIndex(t: PlanTier): number {
  return TIER_ORDER.indexOf(t);
}

/** A, B'den eşit veya yüksek mi? */
export function isAtLeast(actual: PlanTier, required: PlanTier): boolean {
  return tierIndex(actual) >= tierIndex(required);
}

export function hasFeature(tier: PlanTier, feature: FeatureKey): boolean {
  return TIER_FEATURES[tier].includes(feature);
}

/** Legacy DB değerini güvenle Publio brand'a çevir. */
export function brandTierFor(
  dbTier: LegacyTier | PlanTier | null | undefined,
  isEnterprise = false
): PlanTier {
  if (!dbTier) return 'FREE';
  if (isEnterprise) return 'ENTERPRISE';
  if ((LEGACY_TO_BRAND as Record<string, PlanTier>)[dbTier]) {
    return (LEGACY_TO_BRAND as Record<string, PlanTier>)[dbTier];
  }
  return dbTier as PlanTier;
}
