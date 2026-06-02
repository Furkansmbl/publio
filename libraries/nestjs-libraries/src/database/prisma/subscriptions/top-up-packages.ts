/**
 * Publio Top-Up Packages
 * ----------------------
 * Plan dahil aylık kredi tükendiğinde, kullanıcılar bu paketlerden satın alarak
 * burst kapasitesini doldurabilir. Fiyatlar `docs/pricing-strategy.md` ile
 * birebir uyumlu ve `1 kredi ≈ $0.0025` baz fiyatına %~10–28 indirim verir
 * (toplu alım iskontosu).
 */

export type TopUpPackageId = 'small' | 'medium' | 'large' | 'mega';

export interface TopUpPackageDef {
  id: TopUpPackageId;
  label: string;
  credits: number;
  /** USD list price. iyzico için TR fiyat ayrı haritada tutulur. */
  priceUsd: number;
  /** Geçerlilik süresi (gün). Default 365. */
  validityDays: number;
  /** Stripe price ID (env'den override edilebilir). */
  stripePriceEnv: string;
}

export const TOP_UP_PACKAGES: Record<TopUpPackageId, TopUpPackageDef> = {
  small: {
    id: 'small',
    label: 'Booster',
    credits: 2_000,
    priceUsd: 9,
    validityDays: 365,
    stripePriceEnv: 'STRIPE_PRICE_TOPUP_SMALL',
  },
  medium: {
    id: 'medium',
    label: 'Pro Boost',
    credits: 10_000,
    priceUsd: 39,
    validityDays: 365,
    stripePriceEnv: 'STRIPE_PRICE_TOPUP_MEDIUM',
  },
  large: {
    id: 'large',
    label: 'Studio Pack',
    credits: 50_000,
    priceUsd: 149,
    validityDays: 365,
    stripePriceEnv: 'STRIPE_PRICE_TOPUP_LARGE',
  },
  mega: {
    id: 'mega',
    label: 'Agency Mega',
    credits: 250_000,
    priceUsd: 599,
    validityDays: 365,
    stripePriceEnv: 'STRIPE_PRICE_TOPUP_MEGA',
  },
};

/** TR (iyzico) fiyatları — pricing sayfasında ₺ olarak listelenir. */
export const TOP_UP_PACKAGES_TRY: Record<TopUpPackageId, number> = {
  small: 299,
  medium: 1299,
  large: 4999,
  mega: 19999,
};

export function getTopUpPackage(id: string): TopUpPackageDef {
  const pkg = (TOP_UP_PACKAGES as Record<string, TopUpPackageDef>)[id];
  if (!pkg) {
    throw new Error(`Unknown top-up package: ${id}`);
  }
  return pkg;
}
