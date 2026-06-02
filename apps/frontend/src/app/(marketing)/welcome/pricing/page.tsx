'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PubBottomCta } from '../../_lib/shell';

type Tier = {
  name: string;
  tagline: string;
  monthly: number;     // USD
  yearlyMonthly: number; // USD effective monthly when paid yearly (-%20)
  trMonthly: number;   // ₺
  trYearlyMonthly: number;
  channels: string;
  seats: string;
  credits: string;
  storage: string;
  apiCalls: string;
  cta: string;
  highlight?: boolean;
  features: string[];
  videoCredits?: boolean; // HeyGen / Runway açık mı
};

const tiers: Tier[] = [
  {
    name: 'Starter',
    tagline: 'Solo creator için ilk adım',
    monthly: 19, yearlyMonthly: 15,
    trMonthly: 599, trYearlyMonthly: 479,
    channels: '3 kanal',
    seats: '1 kullanıcı',
    credits: '1.000 kredi/ay',
    storage: '5 GB',
    apiCalls: '1.000/ay',
    cta: '7 gün ücretsiz dene',
    features: [
      '3 sosyal medya kanalı',
      'Aylık 1.000 AI kredisi',
      'Caption ve görsel üretimi (temel modeller)',
      'Akıllı takvim & evergreen rotasyonu',
      'Temel analitik',
      'Topluluk desteği',
    ],
  },
  {
    name: 'Creator',
    tagline: 'İçerik üreticileri ve freelancer\'lar',
    monthly: 39, yearlyMonthly: 31,
    trMonthly: 1190, trYearlyMonthly: 949,
    channels: '7 kanal',
    seats: '1 kullanıcı',
    credits: '4.000 kredi/ay',
    storage: '25 GB',
    apiCalls: '10.000/ay',
    cta: '7 gün ücretsiz dene',
    features: [
      '7 sosyal medya kanalı',
      'Aylık 4.000 AI kredisi',
      'Pro LLM modelleri (GPT-4o, Sonnet)',
      'Görsel üretimi (SDXL, FLUX)',
      'TTS (60 sn × 5)',
      'Marka tonu öğrenme',
      'E-posta destek',
    ],
  },
  {
    name: 'Pro',
    tagline: 'Küçük ekipler ve büyüyen markalar',
    monthly: 89, yearlyMonthly: 71,
    trMonthly: 2690, trYearlyMonthly: 2149,
    channels: '15 kanal',
    seats: '3 kullanıcı',
    credits: '12.000 kredi/ay',
    storage: '100 GB',
    apiCalls: '50.000/ay',
    cta: '7 gün ücretsiz dene',
    highlight: true,
    videoCredits: true,
    features: [
      '15 sosyal medya kanalı',
      '3 kullanıcı koltuğu',
      'Aylık 12.000 AI kredisi',
      'HeyGen avatar video (4 dk)',
      'Runway / Pika kısa video',
      'AI ajan (otomasyon) saati: 10',
      'Onay akışları & yorumlar',
      'Detaylı analitik & rapor dışa aktarma',
      'Public API & webhook',
      'Öncelikli e-posta destek',
    ],
  },
  {
    name: 'Business',
    tagline: 'Pazarlama ekipleri ve büyük markalar',
    monthly: 199, yearlyMonthly: 159,
    trMonthly: 5990, trYearlyMonthly: 4790,
    channels: '35 kanal',
    seats: '10 kullanıcı',
    credits: '35.000 kredi/ay',
    storage: '500 GB',
    apiCalls: '200.000/ay',
    cta: 'Business\'a geç',
    videoCredits: true,
    features: [
      '35 sosyal medya kanalı',
      '10 kullanıcı + ek koltuk satın alma',
      'Aylık 35.000 AI kredisi',
      'HeyGen, Runway, Pika tam erişim',
      'AI ajan saati: 30',
      'Sınırsız çalışma alanı',
      'White-label markalama',
      'Audit log & rol bazlı izinler',
      'Slack / Teams destek kanalı',
      '99.5% uptime SLA',
    ],
  },
  {
    name: 'Agency',
    tagline: 'Ajanslar ve birden fazla müşteri',
    monthly: 499, yearlyMonthly: 399,
    trMonthly: 14990, trYearlyMonthly: 11990,
    channels: 'Sınırsız kanal',
    seats: '25 kullanıcı',
    credits: '100.000 kredi/ay',
    storage: '2 TB',
    apiCalls: 'Sınırsız',
    cta: 'Ajansım için seç',
    videoCredits: true,
    features: [
      'Sınırsız sosyal medya kanalı',
      '25 kullanıcı + sınırsız müşteri workspace\'i',
      'Aylık 100.000 AI kredisi',
      'Tüm AI sağlayıcıları (HeyGen, ElevenLabs, Runway)',
      'AI ajan saati: 100',
      'Custom domain + tam white-label',
      'Müşteri faturalama & resell',
      'Dedicated onboarding manager',
      'Müşteri başına ayrı analitik',
    ],
  },
];

const credits = [
  { name: 'Small', credits: '2.000', price: '$9', perK: '$4.50', save: null },
  { name: 'Medium', credits: '10.000', price: '$39', perK: '$3.90', save: '%13 indirim' },
  { name: 'Large', credits: '50.000', price: '$179', perK: '$3.58', save: '%20 indirim', highlight: true },
  { name: 'Mega', credits: '250.000', price: '$799', perK: '$3.20', save: '%29 indirim' },
];

const creditCatalog: [string, string][] = [
  ['Caption / kısa metin (GPT-4o-mini)', '1 kredi'],
  ['Caption / pro (GPT-4o, Claude Sonnet)', '8 kredi'],
  ['5 caption varyantı + marka tonu', '25 kredi'],
  ['Görsel — SDXL / FLUX (1024×1024)', '35 kredi'],
  ['Görsel — gpt-image-1 (1024×1024)', '50 kredi'],
  ['Görsel — Ideogram / Midjourney', '100 kredi'],
  ['TTS — 60 saniye seslendirme', '60 kredi'],
  ['HeyGen avatar — 60 sn video', '600 kredi'],
  ['Runway / Pika — 5 sn video', '500 kredi'],
  ['Tam blog → 5 kanal yayın paketi', '180 kredi'],
  ['AI ajan — 1 saat aktif çalışma', '120 kredi'],
];

const addons: [string, string][] = [
  ['Ek koltuk (Pro / Business)', '$9 / koltuk / ay'],
  ['Ek 100 GB storage', '$5 / ay'],
  ['White-label (kendi domain + logo)', '$79 / ay'],
  ['Dedicated IP + SSO/SAML', '$149 / ay'],
  ['99.9% SLA + 4 saat destek', '$249 / ay'],
  ['HeyGen Pro avatar paketi (kişisel avatar)', '$199 / ay'],
];

const compare = [
  ['Sosyal medya kanalı',          '3',  '7',  '15',     '35',           'Sınırsız'],
  ['Kullanıcı koltuğu',            '1',  '1',  '3',      '10',           '25'],
  ['Aylık AI kredisi',             '1.000', '4.000', '12.000', '35.000', '100.000'],
  ['Pro LLM (GPT-4o, Sonnet)',     '—',  '✓',  '✓',      '✓',           '✓'],
  ['HeyGen avatar video',          '—',  '—',  '✓',      '✓',           '✓'],
  ['Runway / Pika video',          '—',  '—',  '✓',      '✓',           '✓'],
  ['AI ajan (workflow) saati',     '—',  '—',  '10',     '30',          '100'],
  ['Public API & webhook',         '—',  '—',  '✓',      '✓',           '✓'],
  ['White-label',                  '—',  '—',  '—',      '✓',           '✓ (tam)'],
  ['Onay akışları',                '—',  '—',  '✓',      '✓',           '✓'],
  ['Müşteri workspace',            '1',  '1',  '3',      'Sınırsız',     'Sınırsız'],
  ['Storage',                      '5 GB','25 GB','100 GB','500 GB',     '2 TB'],
  ['SLA',                          '—',  '—',  '—',      '99.5%',        '99.5%'],
  ['Destek',                       'Topluluk','E-posta','Öncelikli','Slack/Teams','Dedicated manager'],
];

const faqs: [string, string][] = [
  ['Publio Credit nedir?', 'Publio Credit, AI işlemlerinde tüketilen sanal birimdir. 1 kredi yaklaşık $0.001 sağlayıcı maliyetine karşılık gelir; her plan belirli sayıda krediyle gelir, tükenirse top-up paketi alabilir veya bir sonraki ay yenilenmesini bekleyebilirsiniz.'],
  ['Krediler bir sonraki aya devreder mi?', 'Plan kapsamındaki krediler ay sonunda sıfırlanır. Top-up paketleriyle aldığınız krediler 180 gün geçerlidir; kullanılmayan kısım otomatik yenilemeyle tamamlanır.'],
  ['HeyGen ve Runway gibi pahalı sağlayıcılar her plana dahil mi?', 'Hayır. HeyGen avatar ve Runway / Pika video üretimi yalnızca Pro plan ve üzerinde aktiftir. Starter ve Creator paketlerinde top-up satın alarak erişebilirsiniz.'],
  ['Yıllık ödemede ne kadar tasarruf ediyorum?', 'Yıllık ödemede tüm planlarda %20 indirim uygulanır; effektif aylık ücretiniz görünen üst rakamın yerine indirimli rakam olur.'],
  ['Kendi API anahtarımı (BYOK) kullanabilir miyim?', 'Evet. Enterprise PAYG modelinde kendi OpenAI / Anthropic / HeyGen anahtarınızı bağlayabilirsiniz; bu durumda kredi yerine yalnızca platform ücreti ödersiniz.'],
  ['İptal etmek kolay mı?', 'Tek tıkla iptal — hesap ayarlarınızdan. İptal ettiğinizde mevcut dönem sonuna kadar hizmet devam eder; tüketilmemiş krediler için 14 gün içinde iade talep edebilirsiniz.'],
  ['Fiyatlar TRY olarak gösterilebilir mi?', 'Evet — Türkiye\'den ödeme yapan kullanıcılar için iyzico üzerinden TRY tahsilat aktiftir; fatura KDV dahil kesilir.'],
  ['Self-host edersem fiyat ne olur?', 'Self-host AGPL-3.0 lisansıyla ücretsizdir. AI sağlayıcı maliyetlerini doğrudan siz ödersiniz. Kurumsal destek ve garanti ister misiniz? info@verihane.net'],
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [tr, setTr] = useState(false);

  const fmt = (t: Tier) => {
    if (tr) {
      const value = yearly ? t.trYearlyMonthly : t.trMonthly;
      return { price: `₺${value.toLocaleString('tr-TR')}`, period: '/ay', sub: yearly ? 'yıllık ödemede' : null };
    }
    const value = yearly ? t.yearlyMonthly : t.monthly;
    return { price: `$${value}`, period: '/ay', sub: yearly ? 'yıllık ödemede' : null };
  };

  return (
    <>
      <section className="max-w-[1240px] mx-auto px-6 pt-20 pb-12 text-center">
        <span className="pub-pill mb-7 mx-auto">Şeffaf fiyatlandırma · İptal etmek serbest · 7 gün ücretsiz</span>
        <h1 className="pub-display text-[52px] md:text-[80px] max-w-[900px] mx-auto mb-6">
          Bütçeyle değil{' '}
          <span className="pub-serif">büyümeyle</span>{' '}
          ölçeklen.
        </h1>
        <p className="text-[18px] text-[color:var(--pub-ink-dim)] max-w-[640px] mx-auto" style={{ fontWeight: 400 }}>
          AI tüketimi şeffaf. Her plana aylık <strong>Publio Credit</strong> dahil; pahalı modeller için sadece kullandığın kadar öde.
        </p>

        <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
          <div className="pub-card inline-flex items-center p-1">
            <button
              onClick={() => setYearly(false)}
              className="px-5 py-2 rounded-full text-[13px] transition"
              style={{
                background: !yearly ? 'var(--pub-ink)' : 'transparent',
                color: !yearly ? 'var(--pub-bg)' : 'var(--pub-ink-dim)',
                fontWeight: 600,
              }}
            >
              Aylık
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-5 py-2 rounded-full text-[13px] transition flex items-center gap-2"
              style={{
                background: yearly ? 'var(--pub-ink)' : 'transparent',
                color: yearly ? 'var(--pub-bg)' : 'var(--pub-ink-dim)',
                fontWeight: 600,
              }}
            >
              Yıllık
              <span
                className="text-[10px] px-2 py-[2px] rounded-full"
                style={{ background: '#ff7448', color: '#1c0d05', fontWeight: 700 }}
              >
                %20 indirim
              </span>
            </button>
          </div>

          <div className="pub-card inline-flex items-center p-1">
            <button
              onClick={() => setTr(false)}
              className="px-4 py-2 rounded-full text-[13px]"
              style={{
                background: !tr ? 'var(--pub-ink)' : 'transparent',
                color: !tr ? 'var(--pub-bg)' : 'var(--pub-ink-dim)',
                fontWeight: 600,
              }}
            >
              USD
            </button>
            <button
              onClick={() => setTr(true)}
              className="px-4 py-2 rounded-full text-[13px]"
              style={{
                background: tr ? 'var(--pub-ink)' : 'transparent',
                color: tr ? 'var(--pub-bg)' : 'var(--pub-ink-dim)',
                fontWeight: 600,
              }}
            >
              TRY (₺)
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-5">
          {tiers.map((t) => {
            const p = fmt(t);
            return (
              <div
                key={t.name}
                className={`pub-card p-7 relative flex flex-col ${t.highlight ? 'pub-card-ink' : ''}`}
                style={t.highlight ? { boxShadow: '0 30px 80px -25px rgba(14,13,11,0.45)' } : undefined}
              >
                {t.highlight && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] tracking-[0.2em] uppercase whitespace-nowrap"
                    style={{ background: '#ff7448', color: '#1c0d05', fontWeight: 700 }}
                  >
                    En popüler
                  </span>
                )}
                <h3 className="text-[22px] mb-1" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {t.name}
                </h3>
                <p
                  className="text-[12px] mb-6 min-h-[32px]"
                  style={{ color: t.highlight ? 'rgba(245,241,232,0.55)' : 'var(--pub-ink-faint)', fontWeight: 400 }}
                >
                  {t.tagline}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px]" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
                    {p.price}
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: t.highlight ? 'rgba(245,241,232,0.5)' : 'var(--pub-ink-faint)', fontWeight: 400 }}
                  >
                    {p.period}
                  </span>
                </div>
                {p.sub && (
                  <span
                    className="text-[11px] mb-5 mt-1 inline-block"
                    style={{ color: t.highlight ? 'rgba(245,241,232,0.55)' : 'var(--pub-ink-faint)' }}
                  >
                    {p.sub}
                  </span>
                )}
                {!p.sub && <div className="mb-5" />}
                <Link
                  href="/auth"
                  className="pub-btn w-full justify-center mb-6"
                  style={
                    t.highlight
                      ? { background: '#ff7448', color: '#1c0d05', boxShadow: '0 12px 30px -10px rgba(255,116,72,0.6)' }
                      : { background: 'var(--pub-bg)', color: 'var(--pub-ink)', border: '1px solid var(--pub-line-strong)' }
                  }
                >
                  {t.cta}
                </Link>
                <div
                  className="text-[11px] uppercase tracking-[0.16em] mb-3"
                  style={{ color: t.highlight ? 'rgba(245,241,232,0.55)' : 'var(--pub-ink-faint)', fontWeight: 600 }}
                >
                  Kapsam
                </div>
                <ul className="flex flex-col gap-[10px] mb-5">
                  {[
                    ['Kanal', t.channels],
                    ['Koltuk', t.seats],
                    ['AI kredi', t.credits],
                    ['Storage', t.storage],
                    ['API çağrı', t.apiCalls],
                  ].map(([k, v]) => (
                    <li
                      key={k}
                      className="flex justify-between gap-3 text-[12px]"
                      style={{ color: t.highlight ? 'rgba(245,241,232,0.85)' : 'var(--pub-ink-dim)' }}
                    >
                      <span style={{ color: t.highlight ? 'rgba(245,241,232,0.55)' : 'var(--pub-ink-faint)' }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </li>
                  ))}
                </ul>

                <hr
                  className="border-0 h-px mb-5"
                  style={{ background: t.highlight ? 'rgba(245,241,232,0.12)' : 'var(--pub-line)' }}
                />
                <ul className="flex flex-col gap-[10px] flex-1">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-[13px]"
                      style={{ color: t.highlight ? 'rgba(245,241,232,0.85)' : 'var(--pub-ink-dim)', fontWeight: 400 }}
                    >
                      <span
                        className="mt-[3px] inline-flex w-[14px] h-[14px] rounded-full flex-shrink-0 items-center justify-center text-[9px]"
                        style={{
                          background: t.highlight ? '#ff7448' : 'var(--pub-ink)',
                          color: t.highlight ? '#1c0d05' : 'var(--pub-bg)',
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p
          className="text-center text-[13px] mt-8 text-[color:var(--pub-ink-faint)]"
          style={{ fontWeight: 400 }}
        >
          Tüm fiyatlar KDV hariçtir. Ödeme: Stripe (USD) veya iyzico (TRY). 14 gün içinde tüketilmemiş krediler için tam iade.
        </p>
      </section>

      {/* Credit top-up section */}
      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="pub-section-tag mb-5 mx-auto justify-center">Top-up kredi paketleri</div>
          <h2 className="pub-display text-[36px] md:text-[48px] mb-4">
            Krediler tükendiğinde{' '}
            <span className="pub-serif">durmazsın.</span>
          </h2>
          <p className="text-[15px] text-[color:var(--pub-ink-dim)] max-w-[560px] mx-auto" style={{ fontWeight: 400 }}>
            Aylık paketinin üstüne istediğin zaman ek kredi ekleyebilirsin. Büyük paket = daha düşük birim fiyat.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {credits.map((c) => (
            <div
              key={c.name}
              className={`pub-card p-6 ${c.highlight ? 'pub-card-tinted' : ''}`}
              style={c.highlight ? { borderColor: 'var(--pub-accent, #ff7448)' } : undefined}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[18px]" style={{ fontWeight: 700 }}>{c.name}</h4>
                {c.save && (
                  <span
                    className="text-[10px] px-2 py-[2px] rounded-full"
                    style={{ background: '#ff7448', color: '#1c0d05', fontWeight: 700 }}
                  >
                    {c.save}
                  </span>
                )}
              </div>
              <div className="text-[34px] mb-1" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
                {c.credits}
              </div>
              <div className="text-[12px] text-[color:var(--pub-ink-faint)] mb-5">kredi</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[24px]" style={{ fontWeight: 700 }}>{c.price}</span>
                <span className="text-[12px] text-[color:var(--pub-ink-faint)]">tek seferlik</span>
              </div>
              <div className="text-[11px] text-[color:var(--pub-ink-faint)]">{c.perK} / 1.000 kredi</div>
            </div>
          ))}
        </div>
      </section>

      {/* Credit catalog */}
      <section className="max-w-[1100px] mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="pub-card p-8">
            <div className="pub-section-tag mb-4">Kredi tüketim rehberi</div>
            <h3 className="pub-display text-[28px] mb-5">
              Hangi aksiyon{' '}
              <span className="pub-serif">kaç kredi?</span>
            </h3>
            <ul className="flex flex-col">
              {creditCatalog.map(([action, cost], i) => (
                <li
                  key={action}
                  className={`flex justify-between gap-4 py-[10px] text-[13px] ${i !== creditCatalog.length - 1 ? 'border-b border-[var(--pub-line)]' : ''}`}
                >
                  <span className="text-[color:var(--pub-ink-dim)]" style={{ fontWeight: 400 }}>{action}</span>
                  <span style={{ fontWeight: 600 }}>{cost}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[color:var(--pub-ink-faint)] mt-5" style={{ fontWeight: 400 }}>
              Sağlayıcı (OpenAI, HeyGen, Runway) liste fiyatları değişirse kredi katsayısı 30 gün önceden duyurulur.
            </p>
          </div>

          <div className="pub-card p-8">
            <div className="pub-section-tag mb-4">Add-on'lar</div>
            <h3 className="pub-display text-[28px] mb-5">
              İhtiyaca göre{' '}
              <span className="pub-serif">genişlet.</span>
            </h3>
            <ul className="flex flex-col">
              {addons.map(([k, v], i) => (
                <li
                  key={k}
                  className={`flex justify-between gap-4 py-[10px] text-[13px] ${i !== addons.length - 1 ? 'border-b border-[var(--pub-line)]' : ''}`}
                >
                  <span className="text-[color:var(--pub-ink-dim)]" style={{ fontWeight: 400 }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[color:var(--pub-ink-faint)] mt-5" style={{ fontWeight: 400 }}>
              Add-on'lar Pro ve üzeri planlara eklenebilir; istediğin zaman kaldırabilirsin.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="pub-section-tag mb-5 mx-auto justify-center">Karşılaştır</div>
          <h2 className="pub-display text-[36px] md:text-[48px]">
            Her plan, <span className="pub-serif">net olarak.</span>
          </h2>
        </div>
        <div className="pub-card overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="text-left">
                <th
                  className="px-5 py-5 text-[12px] uppercase tracking-[0.18em] text-[color:var(--pub-ink-faint)]"
                  style={{ fontWeight: 500 }}
                >
                  Özellik
                </th>
                {tiers.map((t) => (
                  <th
                    key={t.name}
                    className="px-5 py-5 text-[13px]"
                    style={{ fontWeight: 700 }}
                  >
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row[0]} className="border-t border-[var(--pub-line)]">
                  <td
                    className="px-5 py-3 text-[13px] text-[color:var(--pub-ink-dim)]"
                    style={{ fontWeight: 400 }}
                  >
                    {row[0]}
                  </td>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className="px-5 py-3 text-[13px]" style={{ fontWeight: 500 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Self-host & Enterprise */}
      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="pub-card pub-card-tinted p-10">
            <div className="pub-section-tag mb-3">Self-host</div>
            <h3 className="pub-display text-[28px] mb-3">
              Açık kaynak.{' '}
              <span className="pub-serif">Tamamen ücretsiz.</span>
            </h3>
            <p
              className="text-[14px] text-[color:var(--pub-ink-dim)] mb-6 leading-[1.65]"
              style={{ fontWeight: 400 }}
            >
              Publio AGPL-3.0 ile lisanslıdır. Kendi sunucuna kur, AI sağlayıcı maliyetlerini doğrudan öde, hiçbir abonelik ücreti ödemeden kullan.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://github.com/Furkansmbl/publio"
                target="_blank"
                rel="noreferrer"
                className="pub-btn pub-btn-ghost"
              >
                GitHub'da gör →
              </a>
              <Link href="/welcome/about" className="pub-btn pub-btn-ghost">
                Hakkımızda
              </Link>
            </div>
          </div>

          <div className="pub-card pub-card-ink p-10">
            <div
              className="pub-section-tag mb-3"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(245,241,232,0.85)' }}
            >
              Enterprise
            </div>
            <h3 className="pub-display text-[28px] mb-3" style={{ color: '#fff' }}>
              Daha büyük bir ekip mi?{' '}
              <span className="pub-serif">Konuşalım.</span>
            </h3>
            <p
              className="text-[14px] mb-6 leading-[1.65]"
              style={{ color: 'rgba(245,241,232,0.7)', fontWeight: 400 }}
            >
              SSO/SAML, dedicated IP, %99.9 SLA, BYOK (kendi API anahtarın), audit log, ISO 27001 destekli yapı, özel onboarding.
            </p>
            <ul
              className="flex flex-col gap-2 mb-6 text-[13px]"
              style={{ color: 'rgba(245,241,232,0.85)', fontWeight: 400 }}
            >
              <li>· Özel hacim indirimleri ve sözleşme</li>
              <li>· BYOK (kendi OpenAI/HeyGen/Anthropic anahtarın)</li>
              <li>· Dedicated infrastructure veya on-premise</li>
              <li>· Adli denetim & uyum raporları</li>
            </ul>
            <Link
              href="/welcome/contact"
              className="pub-btn"
              style={{ background: '#ff7448', color: '#1c0d05' }}
            >
              Satışla görüş →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[920px] mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <div className="pub-section-tag mb-5 mx-auto justify-center">Fiyatlandırma SSS</div>
          <h2 className="pub-display text-[34px] md:text-[44px]">
            Sıkça sorulan{' '}
            <span className="pub-serif">sorular.</span>
          </h2>
        </div>
        <div className="pub-card overflow-hidden">
          {faqs.map(([q, a]) => (
            <details key={q} className="pub-faq border-b border-[var(--pub-line)] last:border-b-0">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <PubBottomCta />
    </>
  );
}
