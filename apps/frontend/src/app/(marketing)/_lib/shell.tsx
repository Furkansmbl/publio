import Link from 'next/link';

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
          { title: 'Şirket', links: [['Hakkımızda', '/welcome/about'], ['İletişim', '/welcome/contact'], ['Kullanım Şartları', '/welcome/terms'], ['Gizlilik', '/welcome/privacy'], ['KVKK', '/welcome/kvkk'], ['Çerezler', '/welcome/cookies'], ['İade & İptal', '/welcome/refund']] },
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
      <div className="max-w-[1240px] mx-auto px-6 pt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-[color:var(--pub-ink-faint)]" style={{ fontWeight: 400 }}>
        <span>© Publio, 2026. Tüm hakları saklıdır.</span>
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
