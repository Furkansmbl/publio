import Link from 'next/link';
import { PubPageHero, PubBottomCta } from '../../_lib/shell';

export type LegalSection = {
  heading: string;
  body: React.ReactNode;
};

/**
 * Common legal page shell — keeps typography consistent across:
 * Privacy, KVKK, Terms, Cookies, Refund, Contact, About.
 */
export function LegalPage({
  eyebrow,
  title,
  subtitle,
  updatedAt,
  intro,
  sections,
  contact,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  updatedAt?: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
  contact?: React.ReactNode;
}) {
  return (
    <>
      <PubPageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <section className="max-w-[860px] mx-auto px-6 pb-16">
        {updatedAt && (
          <p className="text-[13px] text-[color:var(--pub-ink-faint)] mb-8">
            Son güncelleme: {updatedAt}
          </p>
        )}
        {intro && (
          <div className="pub-card p-8 md:p-10 mb-10 text-[15px] leading-[1.75] text-[color:var(--pub-ink-dim)]">
            {intro}
          </div>
        )}
        <div className="flex flex-col gap-10">
          {sections.map((s, idx) => (
            <article key={idx}>
              <h2
                className="text-[22px] md:text-[26px] mb-4"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                {idx + 1}. {s.heading}
              </h2>
              <div className="text-[15px] leading-[1.75] text-[color:var(--pub-ink-dim)] flex flex-col gap-3">
                {s.body}
              </div>
            </article>
          ))}
        </div>

        {contact && (
          <div className="pub-card p-8 md:p-10 mt-12">
            <h3 className="text-[18px] mb-3" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
              İletişim
            </h3>
            <div className="text-[15px] leading-[1.75] text-[color:var(--pub-ink-dim)]">
              {contact}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4 text-[13px] text-[color:var(--pub-ink-faint)]">
          <Link href="/welcome/privacy" className="hover:text-[color:var(--pub-ink)]">Gizlilik Politikası</Link>
          <Link href="/welcome/kvkk" className="hover:text-[color:var(--pub-ink)]">KVKK Aydınlatma</Link>
          <Link href="/welcome/terms" className="hover:text-[color:var(--pub-ink)]">Kullanım Şartları</Link>
          <Link href="/welcome/cookies" className="hover:text-[color:var(--pub-ink)]">Çerez Politikası</Link>
          <Link href="/welcome/refund" className="hover:text-[color:var(--pub-ink)]">İade & İptal</Link>
          <Link href="/welcome/contact" className="hover:text-[color:var(--pub-ink)]">İletişim</Link>
          <Link href="/welcome/about" className="hover:text-[color:var(--pub-ink)]">Hakkımızda</Link>
        </div>
      </section>
      <PubBottomCta />
    </>
  );
}

export const COMPANY = {
  legalName: 'Verihane',
  brand: 'Publio',
  email: 'info@verihane.net',
  privacyEmail: 'kvkk@verihane.net',
  securityEmail: 'security@verihane.net',
  phone: '0312 286 33 22',
  address:
    'Kızılırmak Mah. Muhsin Yazıcıoğlu Cad. No: 39 - A / 135, Çankaya / Ankara',
  hours: 'Pazartesi – Cuma · 09:00 – 18:00',
  website: 'https://publio.app',
};
