/**
 * Publio Credit Catalog
 * ----------------------
 * Maps every billable AI action to:
 *   - `credits`      : kullanıcıdan düşülen kredi miktarı
 *   - `costUsd`      : sağlayıcıya ödediğimiz tahmini USD maliyet (margin için)
 *   - `provider`     : sağlayıcı kimliği (audit + BYOK için)
 *   - `tier`         : minimum gerektirilen plan tier'ı (gating)
 *   - `category`     : ana kategori (analytics + UI grouping)
 *
 * 1 Publio Credit = $0.001 sağlayıcı maliyetine, $0.0025 satış fiyatına
 * (mark-up 2.5×, hedef AI brüt marjı %60). Bkz: docs/pricing-strategy.md
 *
 * Sağlayıcı liste fiyatları değişirse buradaki `costUsd` ve `credits`
 * değerleri 30 gün önceden duyurularak güncellenir.
 */

export const CREDIT_USD_COST = 0.001;        // her kredi sağlayıcıya $0.001 mâliyet
export const CREDIT_USD_PRICE = 0.0025;      // satış: $0.0025 / kredi
export const CREDIT_PER_CALL_HARD_CAP_USD = 0.5; // tek çağrı $0.50'yi aşarsa reddet

/**
 * Ücretsiz deneme (trial) koruması.
 * --------------------------------
 * Trial 7 gün sürer (Stripe `trial_period_days: 7` ile uyumlu) ve dinamik
 * olarak abonelik başlangıcından itibaren hesaplanır.
 *
 * Trial süresince AI kredi tüketimi `TRIAL_CREDIT_CAP` ile sınırlandırılır;
 * böylece deneme kullanıcıları ürünü test edebilir ama sağlayıcı maliyeti
 * kontrol altında kalır (zarar koruması).
 *
 * Maliyet analizi: 300 kredi worst-case `image.gptImage` (50 kr / $0.04) ile
 * 6 görsel ≈ $0.24 sağlayıcı maliyeti — tek çağrı hard-cap'ın ($0.50) altında,
 * trial başına toplam maliyet < $0.30. Pahalı video sağlayıcıları trial'da zaten
 * tamamen bloklanır (media.service `!video.trial && isTrailing`).
 */
export const TRIAL_DAYS = 7;
export const TRIAL_CREDIT_CAP = 300;

export type PlanTier =
  | 'FREE'
  | 'STARTER'
  | 'CREATOR'
  | 'PRO'
  | 'BUSINESS'
  | 'AGENCY'
  | 'ENTERPRISE';

export type CreditCategory =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'workflow';

export type CreditActionId =
  | 'caption.basic'
  | 'caption.pro'
  | 'caption.brandTone'
  | 'image.sdxl'
  | 'image.flux'
  | 'image.gptImage'
  | 'image.ideogram'
  | 'image.midjourney'
  | 'audio.tts.basic'
  | 'audio.tts.multilingual'
  | 'audio.transcribe'
  | 'video.heyGen.60s'
  | 'video.heyGen.proAvatar'
  | 'video.runway.5s'
  | 'video.pika.5s'
  | 'video.synthesia.60s'
  | 'workflow.fullPostBundle'
  | 'workflow.agentHour';

export interface CreditAction {
  id: CreditActionId;
  label: string;
  category: CreditCategory;
  /** Kullanıcıdan düşülen kredi (1 kredi ≈ $0.001 mâliyet baz) */
  credits: number;
  /** Sağlayıcıya tahmini USD maliyet (margin hesabı için) */
  costUsd: number;
  /** Sağlayıcı id (audit + BYOK için) */
  provider:
    | 'openai'
    | 'anthropic'
    | 'google'
    | 'stability'
    | 'ideogram'
    | 'midjourney'
    | 'elevenlabs'
    | 'heygen'
    | 'runway'
    | 'pika'
    | 'synthesia'
    | 'internal';
  /** Bu aksiyona erişim için gereken minimum plan */
  minTier: PlanTier;
  /**
   * `true` ise plan dahil kredisi yetmese de top-up ile çağrılabilir;
   * `false` ise plan dahil kredisi olmadan reddedilir (örn. Starter'da HeyGen).
   */
  topUpAllowed: boolean;
}

/**
 * Master credit catalog — Haziran 2026 sağlayıcı liste fiyatlarına göre.
 * Pricing sayfasındaki "Kredi tüketim rehberi" ile birebir uyumludur.
 */
export const CREDIT_CATALOG: Record<CreditActionId, CreditAction> = {
  // ---- Text / Caption ----
  'caption.basic': {
    id: 'caption.basic',
    label: 'Caption — kısa metin (GPT-4o-mini / Gemini Flash)',
    category: 'text',
    credits: 1,
    costUsd: 0.0003,
    provider: 'openai',
    minTier: 'STARTER',
    topUpAllowed: true,
  },
  'caption.pro': {
    id: 'caption.pro',
    label: 'Caption — pro (GPT-4o, Claude 3.5 Sonnet)',
    category: 'text',
    credits: 8,
    costUsd: 0.008,
    provider: 'anthropic',
    minTier: 'CREATOR',
    topUpAllowed: true,
  },
  'caption.brandTone': {
    id: 'caption.brandTone',
    label: '5 caption varyantı + marka tonu',
    category: 'text',
    credits: 25,
    costUsd: 0.025,
    provider: 'openai',
    minTier: 'CREATOR',
    topUpAllowed: true,
  },

  // ---- Image ----
  'image.sdxl': {
    id: 'image.sdxl',
    label: 'Görsel — SDXL / FLUX (1024²)',
    category: 'image',
    credits: 35,
    costUsd: 0.03,
    provider: 'stability',
    minTier: 'STARTER',
    topUpAllowed: true,
  },
  'image.flux': {
    id: 'image.flux',
    label: 'Görsel — FLUX (1024²)',
    category: 'image',
    credits: 35,
    costUsd: 0.03,
    provider: 'stability',
    minTier: 'STARTER',
    topUpAllowed: true,
  },
  'image.gptImage': {
    id: 'image.gptImage',
    label: 'Görsel — gpt-image-1 (1024²)',
    category: 'image',
    credits: 50,
    costUsd: 0.04,
    provider: 'openai',
    minTier: 'STARTER',
    topUpAllowed: true,
  },
  'image.ideogram': {
    id: 'image.ideogram',
    label: 'Görsel — Ideogram',
    category: 'image',
    credits: 100,
    costUsd: 0.08,
    provider: 'ideogram',
    minTier: 'CREATOR',
    topUpAllowed: true,
  },
  'image.midjourney': {
    id: 'image.midjourney',
    label: 'Görsel — Midjourney (proxy)',
    category: 'image',
    credits: 100,
    costUsd: 0.1,
    provider: 'midjourney',
    minTier: 'CREATOR',
    topUpAllowed: true,
  },

  // ---- Audio ----
  'audio.tts.basic': {
    id: 'audio.tts.basic',
    label: 'TTS — 60 saniye (OpenAI TTS HD)',
    category: 'audio',
    credits: 60,
    costUsd: 0.03,
    provider: 'openai',
    minTier: 'CREATOR',
    topUpAllowed: true,
  },
  'audio.tts.multilingual': {
    id: 'audio.tts.multilingual',
    label: 'TTS — multilingual (ElevenLabs v2)',
    category: 'audio',
    credits: 120,
    costUsd: 0.18,
    provider: 'elevenlabs',
    minTier: 'PRO',
    topUpAllowed: true,
  },
  'audio.transcribe': {
    id: 'audio.transcribe',
    label: 'Transkripsiyon — Whisper-large-v3 (1 dk)',
    category: 'audio',
    credits: 8,
    costUsd: 0.006,
    provider: 'openai',
    minTier: 'STARTER',
    topUpAllowed: true,
  },

  // ---- Video ----
  'video.heyGen.60s': {
    id: 'video.heyGen.60s',
    label: 'HeyGen avatar — 60 sn video',
    category: 'video',
    credits: 600,
    costUsd: 0.5,
    provider: 'heygen',
    minTier: 'PRO',          // ← Pro+ guard
    topUpAllowed: true,
  },
  'video.heyGen.proAvatar': {
    id: 'video.heyGen.proAvatar',
    label: 'HeyGen Pro avatar — 60 sn',
    category: 'video',
    credits: 450,
    costUsd: 0.4,
    provider: 'heygen',
    minTier: 'BUSINESS',     // ← Business+
    topUpAllowed: false,
  },
  'video.runway.5s': {
    id: 'video.runway.5s',
    label: 'Runway Gen-3 — 5 sn video',
    category: 'video',
    credits: 500,
    costUsd: 0.5,
    provider: 'runway',
    minTier: 'PRO',
    topUpAllowed: true,
  },
  'video.pika.5s': {
    id: 'video.pika.5s',
    label: 'Pika 1.5 — 5 sn video',
    category: 'video',
    credits: 300,
    costUsd: 0.3,
    provider: 'pika',
    minTier: 'PRO',
    topUpAllowed: true,
  },
  'video.synthesia.60s': {
    id: 'video.synthesia.60s',
    label: 'Synthesia — 60 sn enterprise video',
    category: 'video',
    credits: 1500,
    costUsd: 1.5,
    provider: 'synthesia',
    minTier: 'AGENCY',
    topUpAllowed: false,
  },

  // ---- Workflow / Agent ----
  'workflow.fullPostBundle': {
    id: 'workflow.fullPostBundle',
    label: 'Tam blog → 5 kanal yayın paketi',
    category: 'workflow',
    credits: 180,
    costUsd: 0.18,
    provider: 'internal',
    minTier: 'CREATOR',
    topUpAllowed: true,
  },
  'workflow.agentHour': {
    id: 'workflow.agentHour',
    label: 'AI ajan — 1 saat aktif çalışma',
    category: 'workflow',
    credits: 120,
    costUsd: 0.12,
    provider: 'internal',
    minTier: 'PRO',
    topUpAllowed: true,
  },
};

/** Action sabitlerini tek noktadan çağırmak için kısa-ad alias'ı. */
export function getCreditAction(id: CreditActionId): CreditAction {
  const a = CREDIT_CATALOG[id];
  if (!a) {
    throw new Error(`Unknown credit action: ${id}`);
  }
  return a;
}

/**
 * Sağlayıcı çağrısı dönüşünde gerçek maliyetle düzeltme yapmak için
 * (örn. OpenAI usage objesinden hesaplanan token maliyeti).
 * Margin raporu bu değeri kullanır.
 */
export function calcCreditsFromCostUsd(actualCostUsd: number): number {
  if (actualCostUsd <= 0) return 0;
  return Math.ceil(actualCostUsd / CREDIT_USD_COST);
}
