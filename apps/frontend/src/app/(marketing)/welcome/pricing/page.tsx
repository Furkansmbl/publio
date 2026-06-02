import Link from 'next/link';

const tiers = [
  {
    name: 'Starter',
    tagline: 'Tek başına başlayanlar',
    price: '₺0',
    period: '/ay',
    cta: 'Ücretsiz başla',
    features: ['2 sosyal kanal', 'Aylık 30 yayın', 'Temel takvim & analiz', 'Topluluk desteği'],
  },
  {
    name: 'Pro',
    tagline: 'Yaratıcılar ve küçük ekipler',
    price: '₺299',
    period: '/ay',
    cta: '7 gün ücretsiz dene',
    highlight: true,
    features: [
      '10 sosyal kanal',
      'Sınırsız yayın',
      'AI içerik & görsel ajanı',
      'Onay akışları (3 kullanıcı)',
      'Otomatik aksiyonlar',
      'Detaylı analiz raporları',
    ],
  },
  {
    name: 'Studio',
    tagline: 'Ajanslar ve markalar',
    price: '₺899',
    period: '/ay',
    cta: 'Studio\'ya geç',
    features: [
      'Sınırsız sosyal kanal',
      'Sınırsız çalışma alanı',
      'Sınırsız ekip üyesi',
      'Public API + MCP server',
      'Özel onboarding',
      'Öncelikli destek',
    ],
  },
];

const compare = [
  ['Sosyal kanal', '2', '10', 'Sınırsız'],
  ['Aylık yayın', '30', 'Sınırsız', 'Sınırsız'],
  ['AI içerik ajanı', '—', '✓', '✓'],
  ['AI görsel üretimi', '—', '✓', '✓'],
  ['Onay akışı', '—', '3 kullanıcı', 'Sınırsız'],
  ['Otomatik aksiyonlar', '—', '✓', '✓'],
  ['Public API & MCP', '—', '—', '✓'],
  ['Çalışma alanı', '1', '3', 'Sınırsız'],
  ['Destek', 'Topluluk', 'E-posta', 'Öncelikli'],
];

export default function PricingPage() {
  return (
    <>
      <section className="max-w-[1240px] mx-auto px-6 pt-20 pb-16 text-center">
        <span className="pub-pill mb-7 mx-auto">Şeffaf fiyatlandırma · İptal etmek serbest</span>
        <h1 className="pub-display text-[52px] md:text-[80px] max-w-[840px] mx-auto mb-6">
          Bütçeyle değil{' '}
          <span className="pub-serif">büyümeyle</span>{' '}
          ölçeklen.
        </h1>
        <p className="text-[18px] text-[color:var(--pub-ink-dim)] max-w-[560px] mx-auto" style={{ fontWeight: 400 }}>
          İhtiyacın kadar başla, büyüdükçe geçiş yap. Tüm planlar 7 gün ücretsiz.
        </p>
      </section>

      <section className="max-w-[1240px] mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`pub-card p-8 relative ${t.highlight ? 'pub-card-ink' : ''}`}
              style={t.highlight ? { boxShadow: '0 30px 80px -25px rgba(14,13,11,0.45)' } : undefined}
            >
              {t.highlight && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] tracking-[0.2em] uppercase"
                  style={{ background: '#ff7448', color: '#1c0d05', fontWeight: 700 }}
                >
                  En popüler
                </span>
              )}
              <h3 className="text-[26px] mb-1" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{t.name}</h3>
              <p className="text-[13px] mb-8" style={{ color: t.highlight ? 'rgba(245,241,232,0.55)' : 'var(--pub-ink-faint)', fontWeight: 400 }}>{t.tagline}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-[52px]" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>{t.price}</span>
                <span className="text-[14px]" style={{ color: t.highlight ? 'rgba(245,241,232,0.5)' : 'var(--pub-ink-faint)', fontWeight: 400 }}>{t.period}</span>
              </div>
              <Link
                href="/auth"
                className="pub-btn w-full justify-center mb-8"
                style={
                  t.highlight
                    ? { background: '#ff7448', color: '#1c0d05', boxShadow: '0 12px 30px -10px rgba(255,116,72,0.6)' }
                    : { background: 'var(--pub-bg)', color: 'var(--pub-ink)', border: '1px solid var(--pub-line-strong)' }
                }
              >
                {t.cta}
              </Link>
              <ul className="flex flex-col gap-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px]" style={{ color: t.highlight ? 'rgba(245,241,232,0.85)' : 'var(--pub-ink-dim)', fontWeight: 400 }}>
                    <span className="mt-[3px] inline-flex w-4 h-4 rounded-full flex-shrink-0 items-center justify-center text-[10px]" style={{ background: t.highlight ? '#ff7448' : 'var(--pub-ink)', color: t.highlight ? '#1c0d05' : 'var(--pub-bg)', fontWeight: 700 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 pb-28">
        <div className="text-center mb-12">
          <div className="pub-section-tag mb-5 mx-auto justify-center">Karşılaştır</div>
          <h2 className="pub-display text-[36px] md:text-[48px]">
            Her plan, <span className="pub-serif">net olarak.</span>
          </h2>
        </div>
        <div className="pub-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="px-6 py-5 text-[12px] uppercase tracking-[0.18em] text-[color:var(--pub-ink-faint)]" style={{ fontWeight: 500 }}>Özellik</th>
                {tiers.map((t) => (
                  <th key={t.name} className="px-6 py-5 text-[14px]" style={{ fontWeight: 700 }}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row[0]} className="border-t border-[var(--pub-line)]">
                  <td className="px-6 py-4 text-[14px] text-[color:var(--pub-ink-dim)]" style={{ fontWeight: 400 }}>{row[0]}</td>
                  <td className="px-6 py-4 text-[14px]" style={{ fontWeight: 500 }}>{row[1]}</td>
                  <td className="px-6 py-4 text-[14px]" style={{ fontWeight: 500 }}>{row[2]}</td>
                  <td className="px-6 py-4 text-[14px]" style={{ fontWeight: 500 }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-6 pb-32">
        <div className="pub-card pub-card-tinted p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative overflow-hidden">
          <div className="relative flex-1">
            <div className="pub-section-tag mb-3">Enterprise</div>
            <h2 className="pub-display text-[34px] md:text-[44px] mb-4">
              Daha büyük bir ekip mi?{' '}
              <span className="pub-serif">Konuşalım.</span>
            </h2>
            <p className="text-[15px] text-[color:var(--pub-ink-dim)] max-w-[520px] leading-[1.65]" style={{ fontWeight: 400 }}>
              Self-host kurulumu, SSO, özel SLA, kanal limitlerinin kaldırılması ve özel SDK desteği — Publio Enterprise tüm ihtiyaçlarınız için esnektir.
            </p>
          </div>
          <div className="relative flex flex-col gap-3">
            <Link href="/auth" className="pub-btn pub-btn-primary">İletişime geç →</Link>
            <Link href="/welcome" className="pub-btn pub-btn-ghost">Tüm özellikleri gör</Link>
          </div>
        </div>
      </section>

    </>
  );
}
