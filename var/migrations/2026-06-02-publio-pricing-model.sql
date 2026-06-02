-- ============================================================================
-- Publio · Pricing model migration (additive only)
-- ============================================================================
-- Versiyon : 2026-06-02 publio_pricing_model
-- Çalıştırma:
--    psql "$DATABASE_URL" -f var/migrations/2026-06-02-publio-pricing-model.sql
--
-- Bu dosyayı `prisma db push` çalıştırmadan önce uygularsanız, tüm sütun ve
-- enum değerleri prod-safe yöntemle eklenir; sonrasında `prisma generate`
-- yapmanız yeterlidir.
--
-- Tüm değişiklikler additive (NULLABLE veya DEFAULT'lu); mevcut kullanıcıların
-- aboneliği veya kredileri etkilenmez.
-- ============================================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Credits tablosu — yeni sütunlar (action, provider, costUsd, topUpId)
-- ------------------------------------------------------------
ALTER TABLE "Credits"
    ADD COLUMN IF NOT EXISTS "action"   TEXT,
    ADD COLUMN IF NOT EXISTS "provider" TEXT,
    ADD COLUMN IF NOT EXISTS "costUsd"  DECIMAL(10,6),
    ADD COLUMN IF NOT EXISTS "topUpId"  TEXT;

CREATE INDEX IF NOT EXISTS "Credits_action_idx"   ON "Credits"("action");
CREATE INDEX IF NOT EXISTS "Credits_topUpId_idx"  ON "Credits"("topUpId");

-- ------------------------------------------------------------
-- 2) Subscription tablosu — Publio meta alanları
-- ------------------------------------------------------------
ALTER TABLE "Subscription"
    ADD COLUMN IF NOT EXISTS "brandTier"      TEXT,
    ADD COLUMN IF NOT EXISTS "monthlyCredits" INTEGER,
    ADD COLUMN IF NOT EXISTS "burstCap"       INTEGER,
    ADD COLUMN IF NOT EXISTS "planFeatures"   TEXT,
    ADD COLUMN IF NOT EXISTS "isEnterprise"   BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "byokProvider"   TEXT,
    ADD COLUMN IF NOT EXISTS "byokApiKeyEnc"  TEXT,
    ADD COLUMN IF NOT EXISTS "billingCountry" TEXT,
    ADD COLUMN IF NOT EXISTS "costCurrency"   TEXT NOT NULL DEFAULT 'USD';

-- ------------------------------------------------------------
-- 3) AIUsageLog — sağlayıcı maliyeti / margin denetimi
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "AIUsageLog" (
    "id"             TEXT         PRIMARY KEY,
    "organizationId" TEXT         NOT NULL,
    "action"         TEXT         NOT NULL,
    "provider"       TEXT         NOT NULL,
    "credits"        INTEGER      NOT NULL,
    "costUsd"        DECIMAL(10,6) NOT NULL,
    "inputTokens"    INTEGER,
    "outputTokens"   INTEGER,
    "durationMs"     INTEGER,
    "resultUrl"      TEXT,
    "errorMessage"   TEXT,
    "status"         TEXT         NOT NULL DEFAULT 'ok',
    "byok"           BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIUsageLog_org_fkey"
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

CREATE INDEX IF NOT EXISTS "AIUsageLog_org_createdAt_idx"
    ON "AIUsageLog"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "AIUsageLog_action_idx"   ON "AIUsageLog"("action");
CREATE INDEX IF NOT EXISTS "AIUsageLog_provider_idx" ON "AIUsageLog"("provider");
CREATE INDEX IF NOT EXISTS "AIUsageLog_status_idx"   ON "AIUsageLog"("status");

-- ------------------------------------------------------------
-- 4) TopUpPackage — plan dışı kredi paketleri
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "TopUpPackage" (
    "id"               TEXT         PRIMARY KEY,
    "organizationId"   TEXT         NOT NULL,
    "credits"          INTEGER      NOT NULL,
    "packageId"        TEXT         NOT NULL DEFAULT 'custom',
    "pricePaid"        DECIMAL(10,2) NOT NULL,
    "costCurrency"     TEXT         NOT NULL DEFAULT 'USD',
    "consumedAt"       TIMESTAMP,
    "remainingCredits" INTEGER      NOT NULL,
    "expiresAt"        TIMESTAMP    NOT NULL,
    "paymentRef"       TEXT,
    "createdAt"        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TopUpPackage_org_fkey"
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

CREATE INDEX IF NOT EXISTS "TopUpPackage_org_idx"        ON "TopUpPackage"("organizationId");
CREATE INDEX IF NOT EXISTS "TopUpPackage_expiresAt_idx"  ON "TopUpPackage"("expiresAt");
CREATE INDEX IF NOT EXISTS "TopUpPackage_paymentRef_idx" ON "TopUpPackage"("paymentRef");

-- ------------------------------------------------------------
-- 5) SubscriptionTier enum genişletme
--   Mevcut: STANDARD | PRO | TEAM | ULTIMATE
--   Eklenen: STARTER | CREATOR | BUSINESS | AGENCY | ENTERPRISE
--
-- NOT: Postgres'te `ALTER TYPE ... ADD VALUE` transactional değildir; bu yüzden
-- aşağıdaki blok COMMIT'ten önce ayrı bir batch'te çalıştırılmalıdır.
-- Aynı blok tekrar çalıştırılırsa "already exists" hatasını atlamak için
-- DO/EXCEPTION kalıbı kullanıyoruz.
-- ------------------------------------------------------------
COMMIT;

DO $$
BEGIN
    BEGIN
        ALTER TYPE "SubscriptionTier" ADD VALUE 'STARTER';
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER TYPE "SubscriptionTier" ADD VALUE 'CREATOR';
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER TYPE "SubscriptionTier" ADD VALUE 'BUSINESS';
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER TYPE "SubscriptionTier" ADD VALUE 'AGENCY';
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER TYPE "SubscriptionTier" ADD VALUE 'ENTERPRISE';
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END$$;

-- ============================================================================
-- ROLLBACK (manuel — gerekirse):
--   ALTER TABLE "Credits"      DROP COLUMN "action", "provider", "costUsd", "topUpId";
--   ALTER TABLE "Subscription" DROP COLUMN "brandTier", "monthlyCredits", "burstCap",
--       "planFeatures", "isEnterprise", "byokProvider", "byokApiKeyEnc",
--       "billingCountry", "costCurrency";
--   DROP TABLE "AIUsageLog";
--   DROP TABLE "TopUpPackage";
-- (Enum değerleri Postgres'te DROP edilemez; yeni bir TYPE oluşturup tabloları
--  taşımak gerekir — dolayısıyla geri alma planı YOK varsayalım.)
-- ============================================================================
