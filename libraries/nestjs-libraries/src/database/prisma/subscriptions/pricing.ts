export interface PricingInnerInterface {
  current: string;
  month_price: number;
  year_price: number;
  channel?: number;
  posts_per_month: number;
  team_members: boolean;
  community_features: boolean;
  featured_by_gitroom: boolean;
  ai: boolean;
  import_from_channels: boolean;
  image_generator?: boolean;
  image_generation_count: number;
  generate_videos: number;
  public_api: boolean;
  webhooks: number;
  autoPost: boolean;

  /* ──────────────── Publio credit-pricing additions ──────────────── */
  /** Pazarlamada gösterilen plan ismi (DB enum ile aynı olmak zorunda değil). */
  brand_name?: string;
  /** Aylık dahil Publio Credit miktarı (pricing-strategy.md). */
  monthly_credits?: number;
  /** Burst tavanı (varsayılan plan'ın %150'si). */
  credit_burst_cap?: number;
  /** Bu plana özel açık olan feature anahtarları (plan-features.ts). */
  features?: string[];
  /** TR (iyzico) için ₺ aylık fiyat — yıllık plan = month × 12 × 0.8. */
  tr_month_price?: number;
  /** USD ödenirken yıllık aboneliğin etkin aylık fiyatı (-%20). */
  yearly_effective_month_price?: number;
}
export interface PricingInterface {
  [key: string]: PricingInnerInterface;
}
export const pricing: PricingInterface = {
  FREE: {
    current: 'FREE',
    brand_name: 'Free trial',
    month_price: 0,
    year_price: 0,
    channel: 0,
    image_generation_count: 0,
    posts_per_month: 0,
    team_members: false,
    community_features: false,
    featured_by_gitroom: false,
    ai: false,
    import_from_channels: false,
    image_generator: false,
    public_api: false,
    webhooks: 0,
    autoPost: false,
    generate_videos: 0,
    monthly_credits: 0,
    credit_burst_cap: 0,
    features: [],
    tr_month_price: 0,
    yearly_effective_month_price: 0,
  },
  STANDARD: {
    current: 'STANDARD',
    brand_name: 'Starter',
    month_price: 19,
    year_price: 182,
    channel: 3,
    posts_per_month: 400,
    image_generation_count: 20,
    team_members: false,
    ai: true,
    community_features: false,
    featured_by_gitroom: false,
    import_from_channels: true,
    image_generator: false,
    public_api: true,
    webhooks: 2,
    autoPost: false,
    generate_videos: 3,
    monthly_credits: 1000,
    credit_burst_cap: 1500,
    features: ['ai.basic', 'api.public'],
    tr_month_price: 599,
    yearly_effective_month_price: 15,
  },
  TEAM: {
    current: 'TEAM',
    brand_name: 'Creator',
    month_price: 39,
    year_price: 374,
    channel: 8,
    posts_per_month: 1000000,
    image_generation_count: 100,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10,
    autoPost: true,
    generate_videos: 10,
    monthly_credits: 4000,
    credit_burst_cap: 6000,
    features: ['ai.basic', 'ai.proModels', 'image.advanced', 'api.public'],
    tr_month_price: 1299,
    yearly_effective_month_price: 31,
  },
  PRO: {
    current: 'PRO',
    brand_name: 'Pro',
    month_price: 89,
    year_price: 854,
    channel: 20,
    posts_per_month: 1000000,
    image_generation_count: 300,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 30,
    autoPost: true,
    generate_videos: 30,
    monthly_credits: 12000,
    credit_burst_cap: 18000,
    features: [
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
    tr_month_price: 2899,
    yearly_effective_month_price: 71,
  },
  ULTIMATE: {
    current: 'ULTIMATE',
    brand_name: 'Agency',
    month_price: 499,
    year_price: 4790,
    channel: 100,
    posts_per_month: 1000000,
    image_generation_count: 500,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10000,
    autoPost: true,
    generate_videos: 60,
    monthly_credits: 100000,
    credit_burst_cap: 150000,
    features: [
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
    tr_month_price: 16499,
    yearly_effective_month_price: 399,
  },
};

/**
 * Publio brand tiers — yeni satış kataloğu.
 * BUSINESS ve ENTERPRISE henüz Prisma `SubscriptionTier` enum'unda olmadığı
 * için DB'ye yazılırken {@link BRAND_TO_LEGACY} ile en yakın eski tier'a
 * (ULTIMATE) çevrilir; UI ve faturalandırma ise bu objedeki değerleri kullanır.
 * Migration tamamlandığında pricing.ts ve plan-features.ts birleştirilebilir.
 */
export const BUSINESS_PRICING: PricingInnerInterface = {
  current: 'BUSINESS',
  brand_name: 'Business',
  month_price: 199,
  year_price: 1910,
  channel: 50,
  posts_per_month: 1000000,
  image_generation_count: 500,
  community_features: true,
  team_members: true,
  featured_by_gitroom: true,
  ai: true,
  import_from_channels: true,
  image_generator: true,
  public_api: true,
  webhooks: 100,
  autoPost: true,
  generate_videos: 60,
  monthly_credits: 35000,
  credit_burst_cap: 52500,
  features: [
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
  tr_month_price: 6499,
  yearly_effective_month_price: 159,
};

