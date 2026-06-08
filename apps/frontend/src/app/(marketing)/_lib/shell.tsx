import Link from 'next/link';

/** Açık kaynak (AGPL-3.0) — kaynak kod erişimi için resmi repo. */
export const GITHUB_REPO = 'https://github.com/Furkansmbl/publio';

export const channels = [
  'instagram', 'youtube', 'linkedin', 'tiktok', 'facebook', 'x', 'threads',
  'reddit', 'pinterest', 'discord', 'slack', 'telegram', 'mastodon', 'bluesky',
  'devto', 'medium', 'hashnode', 'wordpress', 'dribbble', 'lemmy', 'vk',
  'nostr', 'gmb', 'wrapcast',
];

export const HERO_VIDEO_PRIMARY =
  'https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_25fps.mp4';
export const HERO_VIDEO_FALLBACK =
  'https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_25fps.mp4';

export const IMG = {
  creator: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
  desk: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  phone: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=900&q=80',
  ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
  abstract: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80',
  portrait1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  portrait2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  portrait3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  portrait4: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  portrait5: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  portrait6: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
};

export function PubLogo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-[10px]">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={`lgrad-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f3df0" />
            <stop offset="50%" stopColor="#ff7448" />
            <stop offset="100%" stopColor="#0fbfa1" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#0e0d0b" />
        <g transform="rotate(-8 32 32)">
          <text
            x="33" y="48"
            fontFamily="Impact, 'Arial Black', sans-serif"
            fontSize="48" fontWeight={900} fontStyle="italic"
            textAnchor="middle"
            fill={`url(#lgrad-${size})`}
            stroke="#fff" strokeWidth={1.4} strokeLinejoin="round"
          >P</text>
        </g>
        <circle cx="50" cy="14" r="3" fill="#ff7448" />
        <circle cx="12" cy="50" r="2" fill="#0fbfa1" />
      </svg>
      <span className="text-[22px]" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: '-0.03em' }}>
        publio
      </span>
    </span>
  );
}

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Özellikler', href: '/welcome/features' },
  { label: 'Kanallar', href: '/welcome/channels' },
  { label: 'Entegrasyonlar', href: '/welcome/integrations' },
  { label: 'Hikayeler', href: '/welcome/stories' },
  { label: 'Fiyat', href: '/welcome/pricing' },
  { label: 'SSS', href: '/welcome/faq' },
];

export function PubNav({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(245,241,232,0.78)] border-b border-[var(--pub-line)]">
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/welcome"><PubLogo /></Link>
        <nav className="hidden md:flex items-center gap-9 text-[14px] text-[color:var(--pub-ink-dim)]">
          {NAV_ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={
                active === it.href
                  ? 'text-[color:var(--pub-ink)]'
                  : 'hover:text-[color:var(--pub-ink)] transition'
              }
              style={active === it.href ? { fontWeight: 600 } : undefined}
            >
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-[14px] text-[color:var(--pub-ink-dim)] hover:text-[color:var(--pub-ink)] px-3 hidden sm:inline">
            Giriş
          </Link>
          <Link href="/auth" className="pub-btn pub-btn-primary text-[14px] py-[10px] px-[18px]">
            Ücretsiz dene <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PubVisaLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      title="Visa"
      aria-label="Visa"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        minWidth: 50,
        padding: '0 10px',
        background: '#fff',
        border: '1px solid var(--pub-line)',
        borderRadius: 6,
      }}
    >
      <svg width="40" height="14" viewBox="0 0 48 16" aria-hidden>
        <text
          x="24"
          y="13"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="15"
          fontWeight={700}
          fontStyle="italic"
          letterSpacing="1"
          fill="#1a1f71"
        >
          VISA
        </text>
      </svg>
    </span>
  );
}

export function PubMastercardLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      title="Mastercard"
      aria-label="Mastercard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        minWidth: 50,
        padding: '0 10px',
        background: '#fff',
        border: '1px solid var(--pub-line)',
        borderRadius: 6,
      }}
    >
      <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden>
        <circle cx="13" cy="11" r="9" fill="#eb001b" />
        <circle cx="21" cy="11" r="9" fill="#f79e1b" />
        <path
          d="M17 4.2a9 9 0 0 0 0 13.6 9 9 0 0 0 0-13.6Z"
          fill="#ff5f00"
        />
      </svg>
    </span>
  );
}

export function PubIyzicoLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      title="iyzico ile öde"
      aria-label="iyzico ile öde"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 30,
        padding: '0 12px',
        background: '#fff',
        border: '1px solid var(--pub-line)',
        borderRadius: 6,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="6" fill="#1e64ff" />
        <path
          d="M7 8.5c.7 0 1.2-.5 1.2-1.2S7.7 6.1 7 6.1s-1.2.5-1.2 1.2S6.3 8.5 7 8.5Zm-1 1.2h2v8h-2v-8Zm4 0h1.9v1c.5-.8 1.3-1.2 2.3-1.2 1.9 0 3 1.2 3 3.3v4.9h-2v-4.5c0-1.1-.5-1.8-1.5-1.8s-1.7.7-1.7 1.9v4.4h-2v-8Z"
          fill="#fff"
        />
      </svg>
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: '#1e2a4a',
          letterSpacing: '-0.01em',
        }}
      >
        iyzico ile öde
      </span>
    </span>
  );
}

/**
 * Güvenli ödeme rozetleri — iyzico onayı için Visa / Mastercard / iyzico
 * logoları. Footer ve fiyatlandırma/ödeme sayfalarında kullanılır.
 */
export function PubPaymentBadges({
  className = '',
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {showLabel && (
        <span className="text-[12px] text-[color:var(--pub-ink-faint)]" style={{ fontWeight: 500 }}>
          Güvenli ödeme · 256-bit SSL
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <PubIyzicoLogo />
        <PubVisaLogo />
        <PubMastercardLogo />
      </div>
    </div>
  );
}

export function PubFooter() {
  return (
    <footer className="border-t border-[var(--pub-line)] pt-16 pb-10 mt-12">
      <div className="max-w-[1240px] mx-auto px-6 grid md:grid-cols-5 gap-10 mb-12">
        <div className="md:col-span-2">
          <PubLogo />
          <p className="text-[14px] text-[color:var(--pub-ink-dim)] mt-5 max-w-[280px] leading-[1.6]" style={{ fontWeight: 400 }}>
            AI destekli, çok kanallı sosyal medya orkestrasyon platformu.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-[color:var(--pub-ink-faint)]">
            <span className="w-2 h-2 rounded-full bg-[color:var(--pub-mint)]" />
            Tüm sistemler operasyonel
          </div>
        </div>
        {[
          { title: 'Ürün', links: [['Özellikler', '/welcome/features'], ['Kanallar', '/welcome/channels'], ['Entegrasyonlar', '/welcome/integrations'], ['Fiyat', '/welcome/pricing']] },
          { title: 'Kaynaklar', links: [['Hikayeler', '/welcome/stories'], ['SSS', '/welcome/faq'], ['Giriş', '/auth/login'], ['Kayıt', '/auth']] },
          { title: 'Şirket', links: [['Hakkımızda', '/welcome/about'], ['İletişim', '/welcome/contact'], ['Kullanım Şartları', '/welcome/terms'], ['Gizlilik', '/welcome/privacy'], ['KVKK', '/welcome/kvkk'], ['Çerezler', '/welcome/cookies'], ['Mesafeli Satış Sözleşmesi', '/welcome/mesafeli-satis'], ['Teslimat & İade', '/welcome/teslimat-iade'], ['İade & İptal', '/welcome/refund']] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-[13px] mb-4" style={{ fontWeight: 700, letterSpacing: '0.02em' }}>{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map(([l, h]) => (
                <li key={l}><Link href={h} className="text-[14px] text-[color:var(--pub-ink-dim)] hover:text-[color:var(--pub-ink)] transition" style={{ fontWeight: 400 }}>{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr className="pub-divider max-w-[1240px] mx-auto" />
      <div className="max-w-[1240px] mx-auto px-6 pt-6 flex flex-wrap items-center justify-between gap-4">
        <PubPaymentBadges showLabel={false} />
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[13px] text-[color:var(--pub-ink-dim)] hover:text-[color:var(--pub-ink)] transition"
          style={{ fontWeight: 500 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>
          </svg>
          Açık kaynak · GitHub
        </a>
      </div>
      <div className="max-w-[1240px] mx-auto px-6 pt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-[color:var(--pub-ink-faint)]" style={{ fontWeight: 400 }}>
        <span>© Publio, 2026. Tüm hakları saklıdır. · AGPL-3.0 lisansı ile açık kaynak.</span>
        <span className="pub-tag text-[14px]">made with ❤︎</span>
      </div>
    </footer>
  );
}

export function PubPageHero({
  eyebrow, title, subtitle,
}: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <section className="max-w-[1240px] mx-auto px-6 pt-24 pb-16">
      <div className="max-w-[820px]">
        <div className="pub-section-tag mb-5">{eyebrow}</div>
        <h1 className="pub-display text-[52px] md:text-[72px] mb-5">{title}</h1>
        {subtitle && (
          <p className="text-[18px] text-[color:var(--pub-ink-dim)] max-w-[640px] leading-[1.6]" style={{ fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function PubBottomCta() {
  return (
    <section className="max-w-[1240px] mx-auto px-6 pb-24">
      <div className="pub-card pub-card-ink p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute -top-20 -left-10 w-[320px] h-[320px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,116,72,0.5), transparent 65%)' }} />
        <div className="absolute -bottom-20 -right-10 w-[320px] h-[320px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(15,191,161,0.45), transparent 65%)' }} />
        <div className="relative">
          <h2 className="pub-display text-[40px] md:text-[60px] max-w-[760px] mx-auto mb-5" style={{ color: '#fff' }}>
            Bugün sosyalin ritmini kur.
          </h2>
          <p className="text-[16px] mb-9 max-w-[520px] mx-auto" style={{ color: 'rgba(245,241,232,0.7)', fontWeight: 400 }}>
            7 gün ücretsiz, kredi kartı yok. İlk yayını 60 saniyede gönder.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/auth" className="pub-btn pub-btn-accent">Hemen başla <span aria-hidden>→</span></Link>
            <Link href="/welcome/pricing" className="pub-btn pub-btn-ghost" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.18)' }}>
              Fiyatlandırma
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
