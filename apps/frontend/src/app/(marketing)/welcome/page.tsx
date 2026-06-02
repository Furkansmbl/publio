import Link from 'next/link';
import { channels, HERO_VIDEO_PRIMARY, HERO_VIDEO_FALLBACK, IMG, PubBottomCta } from '../_lib/shell';

export const metadata = {
  title: 'Publio — Sosyal medyanı tek yerden yönet',
};

export default function WelcomeHome() {
  return (
    <>
      {/* HERO */}
      <section className="max-w-[1240px] mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 pub-fade-up">
            <span className="pub-pill mb-7">Publio v1 yayında</span>
            <h1 className="pub-display text-[52px] md:text-[72px] lg:text-[80px] mb-7">
              Sosyal medyanı tek yerden, sıfır gürültüyle yönet.
            </h1>
            <p className="text-[18px] text-[color:var(--pub-ink-dim)] max-w-[520px] leading-[1.6] mb-9" style={{ fontWeight: 400 }}>
              28+ kanala içerik üretip planla. AI ajanların yazısını yazsın,
              tasarımını çizsin, sen sadece yayınla butonuna bas.
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-10">
              <Link href="/auth" className="pub-btn pub-btn-primary">7 gün ücretsiz başla <span aria-hidden>→</span></Link>
              <Link href="/welcome/features" className="pub-btn pub-btn-ghost">Özellikleri keşfet</Link>
            </div>
            <div className="flex items-center gap-5 text-[13px] text-[color:var(--pub-ink-faint)]">
              <div className="flex -space-x-2">
                {[IMG.portrait1, IMG.portrait2, IMG.portrait3, IMG.portrait4, IMG.portrait5].map((p) => (
                  <img key={p} src={p} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[var(--pub-bg)]" />
                ))}
              </div>
              <span>20.000+ yaratıcı, ajans ve takım Publio kullanıyor</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="pub-hero-video-wrap">
              <div className="pub-fallback" aria-hidden />
              <video autoPlay loop muted playsInline preload="metadata" style={{ filter: 'saturate(1.05) contrast(1.02)' }}>
                <source src={HERO_VIDEO_PRIMARY} type="video/mp4" />
                <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-8 -left-6 pub-mock w-[280px] hidden md:block pub-float">
              <div className="pub-mock-bar">
                <span className="pub-mock-dot" style={{ background: '#ff7448' }} />
                <span className="pub-mock-dot" style={{ background: '#fbc740' }} />
                <span className="pub-mock-dot" style={{ background: '#0fbfa1' }} />
                <span className="ml-3 text-[11px] text-[color:var(--pub-ink-faint)]">publio · ajan</span>
              </div>
              <div className="p-4 text-[13px] leading-[1.55]">
                <div className="text-[color:var(--pub-ink-faint)] mb-1">Ajan</div>
                <div>Cuma için 5 IG post + 3 X thread + 2 LinkedIn yazısı hazırla.</div>
                <div className="mt-3 text-[color:var(--pub-mint)] text-[12px]">✓ 10 içerik üretildi · 14:32</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-2 pub-postit w-[180px] hidden md:block" style={{ animationDelay: '1s' }}>
              <div className="text-[12px] text-[color:#5a4a00]">İlk 7 gün hediye</div>
              <div className="font-bold text-[16px] mt-1" style={{ color: '#3a2a00' }}>Kredi kartı yok ✦</div>
            </div>
          </div>
        </div>

        {/* logo strip */}
        <div className="mt-24 pt-10 border-t border-[var(--pub-line)] overflow-hidden">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--pub-ink-faint)] text-center mb-7">
            Bağlandığın kanallar
          </div>
          <div className="pub-marquee opacity-80">
            {[...channels, ...channels].map((ch, i) => (
              <div key={i} className="flex items-center gap-3 text-[color:var(--pub-ink-dim)]">
                <img src={`/icons/platforms/${ch}.png`} alt="" className="w-6 h-6 object-contain grayscale opacity-70" />
                <span className="text-[14px] capitalize" style={{ fontWeight: 500 }}>{ch}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK PILLARS — link out to dedicated pages */}
      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'Özellikler', d: 'Planlama, AI asistan, görsel editör ve takım iş akışı.', href: '/welcome/features', img: IMG.desk },
            { t: 'Kanallar', d: '28+ trend sosyal kanal, hepsi tek panelden.', href: '/welcome/channels', img: IMG.phone },
            { t: 'Entegrasyonlar', d: 'Claude, ChatGPT, n8n, Make.com, Public API ve MCP.', href: '/welcome/integrations', img: IMG.ai },
          ].map((c) => (
            <Link key={c.t} href={c.href} className="pub-card overflow-hidden block group">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="p-7">
                <h3 className="text-[22px] mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{c.t}</h3>
                <p className="text-[14px] text-[color:var(--pub-ink-dim)] leading-[1.6]" style={{ fontWeight: 400 }}>{c.d}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-[13px] text-[color:var(--pub-coral)]" style={{ fontWeight: 600 }}>
                  Detay <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PubBottomCta />
    </>
  );
}
