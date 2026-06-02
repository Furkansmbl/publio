'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PubLogo } from './shell';

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Özellikler', href: '/welcome/features' },
  { label: 'Kanallar', href: '/welcome/channels' },
  { label: 'Entegrasyonlar', href: '/welcome/integrations' },
  { label: 'Hikayeler', href: '/welcome/stories' },
  { label: 'Fiyat', href: '/welcome/pricing' },
  { label: 'SSS', href: '/welcome/faq' },
];

export default function PubNavClient() {
  const pathname = usePathname() || '';
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(245,241,232,0.78)] border-b border-[var(--pub-line)]">
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/welcome" aria-label="Publio ana sayfa"><PubLogo /></Link>
        <nav className="hidden md:flex items-center gap-9 text-[14px] text-[color:var(--pub-ink-dim)]">
          {NAV_ITEMS.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + '/');
            return (
              <Link
                key={it.href}
                href={it.href}
                className={
                  active
                    ? 'text-[color:var(--pub-ink)]'
                    : 'hover:text-[color:var(--pub-ink)] transition'
                }
                style={active ? { fontWeight: 600 } : undefined}
              >
                {it.label}
              </Link>
            );
          })}
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
