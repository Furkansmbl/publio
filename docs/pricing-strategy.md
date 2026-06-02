# Publio — Fiyatlandırma & Gelir Modeli Stratejisi

> Belge sahibi: Verihane · Sürüm: 1.0 · Tarih: 2026-06
> Bu belge bir kâr-zarar simülasyonu ve fiyatlandırma çerçevesidir; nihai
> rakamlar hukuk + muhasebe ekibinin onayı, KDV (%20) ve Stripe / iyzico
> komisyonu (%2.5–3.4 + sabit) sonrası kesinleşir.

---

## 1. Stratejik özet

Publio iki tarafı olan bir SaaS'tır:

1. **Sosyal medya yönetim platformu** (planlama, takvim, ekip) — düşük
   marjinal maliyet, klasik per-seat fiyatlandırma uygundur.
2. **AI ajan / üretim katmanı** (HeyGen, ElevenLabs, Runway, OpenAI,
   Anthropic, Stability) — token / kredi başına gerçek bir bulut maliyeti
   vardır. Bu katmanı **mark-up + pre-paid kredi** modeliyle satarız.

Hedef brüt marj:

| Gelir kalemi              | Hedef brüt marj |
| ------------------------- | --------------- |
| Platform (per seat)       | %85–%90         |
| AI kredi tüketimi         | **%55–%65**     |
| Add-on'lar (storage, SLA) | %70             |

Genel hedef blended brüt marj: **%72+**.

---

## 2. Maliyet temeli (gerçek API fiyatları, Haziran 2026)

Aşağıdaki rakamlar ortalama listed pricing'tir; volume discount + Azure /
AWS Bedrock anlaşmaları ile %10–25 iyileşebilir.

### 2.1 LLM (metin / caption / scripting)

| Model                  | Input $/1M tok | Output $/1M tok | Tipik post (in 600 / out 400 tok) |
| ---------------------- | -------------: | --------------: | --------------------------------: |
| GPT-4o-mini            |          $0.15 |           $0.60 |                          ~$0.0003 |
| GPT-4o                 |          $2.50 |          $10.00 |                          ~$0.0055 |
| GPT-4.1                |          $2.00 |           $8.00 |                          ~$0.0044 |
| Claude 3.5 Sonnet      |          $3.00 |          $15.00 |                          ~$0.0078 |
| Claude 3.5 Haiku       |          $0.80 |           $4.00 |                          ~$0.0021 |
| Gemini 2.0 Flash       |          $0.10 |           $0.40 |                          ~$0.0002 |

> Tek bir AI caption ≈ **$0.0003–$0.008** doğrudan maliyet.

### 2.2 Görsel üretim

| Servis                       |     Birim |  Maliyet |
| ---------------------------- | --------: | -------: |
| OpenAI gpt-image-1 (1024²)   |  1 görsel |   $0.040 |
| Stability SD3 / FLUX (API)   |  1 görsel |   $0.030 |
| Ideogram v2                  |  1 görsel |   $0.080 |
| Midjourney (proxy)           |  1 görsel |   $0.100 |

### 2.3 Video & avatar

| Servis                              |          Birim | Maliyet |
| ----------------------------------- | -------------: | ------: |
| **HeyGen** API (avatar + voice)     | 1 dk video     |   $0.50 |
| HeyGen ek dakika (Creator/Bus tier) | 1 dk           | $0.30–0.40 |
| **Runway Gen-3 Alpha**              | 5 sn video     |   $0.50 |
| Pika 1.5                            | 5 sn video     |   $0.30 |
| Synthesia (enterprise quote)        | 1 dk           | $1.20–1.80 |

### 2.4 Ses

| Servis                        |       Birim | Maliyet |
| ----------------------------- | ----------: | ------: |
| ElevenLabs Pro tier (avg)     | 1.000 char  |  $0.090 |
| ElevenLabs Multilingual v2    | 1.000 char  |  $0.180 |
| OpenAI TTS HD                 | 1.000 char  |  $0.030 |
| Whisper-large-v3 (transcribe) |     1 dk    |  $0.006 |

### 2.5 Altyapı (kullanıcı başına aylık ortalama)

| Kalem                                  | Maliyet/ay/kullanıcı |
| -------------------------------------- | -------------------: |
| Postgres + Redis (managed)             |               $0.40 |
| Object storage (10 GB ortalama, R2/S3) |               $0.15 |
| Bandwidth / CDN                        |               $0.20 |
| Sentry, log, monitoring                |               $0.10 |
| Email (Resend, ~150 mail/ay)           |               $0.06 |
| Stripe sabit ücret (1 işlem/ay)        |               $0.30 |
| **Toplam non-AI COGS / kullanıcı**     |           **~$1.21** |

---

## 3. Token ekonomi modeli — "Publio Credits"

AI maliyetlerini doğrudan kullanıcıya yansıtmak için **soyut bir kredi
birimi** kullanırız. **1 Publio Credit = $0.0010 (1/10 cent) sağlayıcı maliyetine**
karşılık gelir; satış fiyatı **$0.0025 / kredi** (mark-up **2.5×** = brüt
marj **%60**).

### Kredi kataloğu (rounded, kullanıcıya gösterilen)

| Aksiyon                                   | Kredi |
| ----------------------------------------- | ----: |
| Caption / kısa metin (GPT-4o-mini)        |     1 |
| Caption / pro (GPT-4o, Sonnet)            |     8 |
| Marka tonuyla 5 caption varyantı          |    25 |
| Görsel (SDXL/FLUX, 1024²)                 |    35 |
| Görsel (gpt-image-1, 1024²)               |    50 |
| Görsel (Ideogram / MJ)                    |   100 |
| TTS — 60 sn ses                           |    60 |
| HeyGen avatar — 60 sn video               |   600 |
| HeyGen avatar — Pro stok                  |   450 |
| Runway / Pika — 5 sn video                |   500 |
| Tam blog → 5 kanal yayın paketi (LLM+IMG) |   180 |
| AI ajan saatlik aktif çalışma (workflow)  |   120 |

> Kredi tükenince platform **soft-stop** yapar: kullanıcıya "kredi
> tükendi" gösterir; otomatik şarj (auto-recharge) opsiyoneldir.

### Marj kontrolü

- Her sağlayıcı çağrısı `cost_in_usd` olarak loglanır (audit tablosu).
- Aylık batch job: `paid_credits * 0.001 - sum(cost_in_usd)` → marj raporu.
- Marj **%55'in altına** düşerse otomatik fiyatlama tetiklenir
  (kredi katsayısı +%10).
- LLM router: aynı kalitede ucuz model bulunduğunda otomatik downgrade
  (örn. Sonnet → Haiku reasoning kapalı taskler için).

---

## 4. Plan paketleri

### 4.1 Aylık fiyatlandırma (KDV hariç, USD)

| Plan          | Aylık | Yıllık (-%20) | Kanal | Koltuk | Aylık kredi | Storage | API çağrı |
| ------------- | ----: | ------------: | ----: | -----: | ----------: | ------: | --------: |
| **Starter**   |   $19 |          $182 |     3 |      1 |       1.000 |    5 GB |     1.000 |
| **Creator**   |   $39 |          $374 |     7 |      1 |       4.000 |   25 GB |    10.000 |
| **Pro**       |   $89 |          $854 |    15 |      3 |      12.000 |  100 GB |    50.000 |
| **Business**  |  $199 |        $1.910 |    35 |     10 |      35.000 |  500 GB |   200.000 |
| **Agency**    |  $499 |        $4.790 |    sınırsız | 25 |  100.000 |    2 TB |   sınırsız |
| **Enterprise**| Quote |          Quote | sınırsız | sınırsız | quote |   quote |    quote |

> Yerel pazar (TR): aynı paketler **iyzico** ile ₺ olarak satılır;
> aylık Pro paket için referans ≈ **₺2.990**.

### 4.2 Kredi katsayıları (plan başı maliyet → satış oranı)

| Plan       | Dahil kredi maliyeti | Satış payı (kredi) | Effektif AI marjı |
| ---------- | -------------------: | -----------------: | ----------------: |
| Starter    |                $1.00 |              $2.50 |              %60 |
| Creator    |                $4.00 |             $10.00 |              %60 |
| Pro        |               $12.00 |             $30.00 |              %60 |
| Business   |               $35.00 |             $87.50 |              %60 |
| Agency     |              $100.00 |            $250.00 |              %60 |

### 4.3 Ek kredi paketleri (top-up)

| Paket   | Kredi   |  Fiyat | $/1K kredi | İndirim |
| ------- | ------: | -----: | ---------: | ------: |
| Small   |   2.000 |   $9   |       4.50 |     —   |
| Medium  |  10.000 |  $39   |       3.90 |    %13  |
| Large   |  50.000 | $179   |       3.58 |    %20  |
| Mega    | 250.000 | $799   |       3.20 |    %29  |

> Top-up'lar **180 gün** geçerlidir; süresi dolan krediler otomatik
> sıfırlanır (aktif aboneye prorata aktarım var).

### 4.4 Add-on'lar

| Add-on                                   |        Fiyat |
| ---------------------------------------- | -----------: |
| Ek koltuk (Pro/Business)                 |  $9 / koltuk |
| Ek 100 GB storage                        |    $5 / ay   |
| White-label (kendi domain + logo)        |   $79 / ay   |
| Dedicated IP + SSO/SAML                  |  $149 / ay   |
| 99.9% SLA + 4 saat destek                |  $249 / ay   |
| HeyGen Pro avatar paketi (kişisel avatar)|   $199 / ay   |

---

## 5. Birim ekonomisi (örnek hesap — Pro plan)

Tipik bir Pro kullanıcısının aylık tüketimi:

| Kalem                       | Adet | Kredi/birim | Toplam kredi | Sağlayıcı maliyet |
| --------------------------- | ---: | ----------: | -----------: | ----------------: |
| Caption (mix model)         |  300 |          ~3 |          900 |             $0.90 |
| Görsel                      |   80 |          40 |        3.200 |             $3.20 |
| TTS (60 sn × 5)             |    5 |          60 |          300 |             $0.30 |
| HeyGen video (60 sn × 4)    |    4 |         600 |        2.400 |             $2.40 |
| Runway 5 sn (× 3)           |    3 |         500 |        1.500 |             $1.50 |
| Workflow / ajan saati       |   10 |         120 |        1.200 |             $1.20 |
| **Toplam tüketim**          |      |             |   **9.500**  |        **$9.50**  |

Pro plan dahil: 12.000 kredi → kullanıcı ekstra ödeme yapmaz.

| Kalem                                | USD     |
| ------------------------------------ | ------: |
| Aylık abonelik geliri                |  $89.00 |
| AI sağlayıcı maliyeti                |  −$9.50 |
| Non-AI altyapı / kullanıcı (3 koltuk)|  −$3.63 |
| Stripe (%2.9 + $0.30)                |  −$2.88 |
| Müşteri başı destek payı (avg)       |  −$1.20 |
| **Brüt kâr / kullanıcı / ay**        | **$71.79** |
| **Brüt marj**                        | **%80.7** |

> Kullanıcı dahil krediyi aşarsa top-up satışı +%60 marj ekler.

---

## 6. "Zarar etme" güvencesi — operasyonel kurallar

1. **Hard cap:** Her plan, dahil kredinin **+%50'sine** kadar burst
   kullanım izni verir; sonrasında soft-stop. Bu sayede tek bir kullanıcı
   marjı patlatamaz.
2. **Cost guardrail / model:** Çağrı başına **$0.50** üst sınır; aşan
   istek otomatik daha ucuz modele yönlendirilir veya reddedilir.
3. **Abuse detection:** Saatlik cost > $5 olan hesaba uyarı + manuel
   inceleme.
4. **Pre-paid only video:** HeyGen / Runway / Pika gibi **pahalı video
   sağlayıcıları** Starter / Creator paketlerinde **kapalı**, sadece top-up
   ile açılır.
5. **FX & sağlayıcı dalgalanması:** Sağlayıcı fiyatı %15+ artarsa kredi
   katsayısı 30 gün içinde otomatik güncellenir (TOS'ta yer alır).
6. **Refund politikası:** Tüketilmemiş krediler 14 gün içinde iade
   edilebilir; tüketilmiş krediler iade dışıdır.

---

## 7. Kullanım-bazlı (PAYG) alternatif

Büyük kurumsal müşteriler için **sabit ücret + tüketim** modeli:

- **Platform fee:** $499 / ay (Agency tabanı)
- **Kredi tüketimi:** **$3.20 / 1.000 kredi** (Mega top-up rate'iyle aynı)
- **AI provider passthrough:** Müşteri kendi anahtarını getirirse
  (BYOK), kredi yerine sadece **%15 platform fee** alınır.

> BYOK marjını korumak için her aktif BYOK hesap için minimum **$199/ay**
> teknoloji ücreti uygulanır.

---

## 8. Pazar segmenti haritası

| Segment                       | Hedef plan          | Birincil değer önerisi             |
| ----------------------------- | ------------------- | ---------------------------------- |
| Solo creator / freelancer     | Starter / Creator   | Tek panelden multi-kanal + ucuz AI |
| Küçük marka / KOBİ            | Pro                 | Ekip + analitik + AI ajan          |
| Ajans                         | Agency              | White-label, müşteri workspace'i   |
| Kurumsal pazarlama            | Enterprise          | SSO, SLA, audit log, BYOK          |
| Geliştirici / SaaS entegratör | API + BYOK PAYG     | SDK, webhook, sınırsız API         |

---

## 9. Yol haritası — fiyatlandırma takvimi

| Çeyrek    | Aksiyon                                                |
| --------- | ------------------------------------------------------ |
| 2026-Q3   | Lansman fiyatları (bu doküman) + early-bird %30 indirim |
| 2026-Q4   | İlk fiyat revizyonu, kredi tüketim raporu yayınlama    |
| 2027-Q1   | Enterprise SSO/SAML, SLA add-on aktivasyonu            |
| 2027-Q2   | Lifetime deal (AppSumo) ile büyüme; sınırlı 2.000 lisans |
| 2027-Q3   | Bölgesel fiyatlandırma (PPP) + iyzico TR planı         |

---

## 10. KPI'lar

- **Gross margin** (aylık) ≥ %72
- **AI margin** (kredi tüketimi) ≥ %55
- **CAC payback** ≤ 9 ay
- **NRR (net revenue retention)** ≥ %110
- **Kredi over-usage oranı** (top-up çevrimi) ≥ %18 ücretli kullanıcı
- **Churn** ≤ %4 / ay (Pro), ≤ %1.5 / ay (Business+)

---

## 11. Yasal / sözleşme notları

- Kullanıcı, AI üretimlerinin sorumluluğunu kabul eder (TOS §AI).
- Sağlayıcı modeli değiştiğinde 30 gün önceden e-posta ile bildirilir.
- Kullanılmayan kredi kapsamı **menkul kıymet sayılmaz**, "limited license
  to use the service" olarak tanımlanır.
- AB & TR KVKK uyumu için provider'a giden veri DPA kapsamında listelenir.
- Provider değişikliği fiyat artırımıyla sonuçlanırsa kullanıcı 30 gün
  içinde **prorata refund** talep edebilir.

---

> Soru / itiraz: <info@verihane.net>
