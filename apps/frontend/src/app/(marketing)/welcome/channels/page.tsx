import { channels, PubPageHero, PubBottomCta } from '../../_lib/shell';

export const metadata = { title: 'Kanallar — Publio' };

export default function ChannelsPage() {
  return (
    <>
      <PubPageHero
        eyebrow="Kanallar"
        title={<>28+ trend sosyal kanal, tek panelden.</>}
        subtitle="Tek bir içeriği aynı anda her kanala özelleştirilmiş şekilde yayınla. Karakter limitini, hashtag yapısını ve görsel formatını AI otomatik uyarlasın."
      />
      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="flex flex-wrap justify-center gap-4 max-w-[920px] mx-auto">
          {channels.map((ch) => (
            <div key={ch} className="pub-channel-tile" title={ch}>
              <img src={`/icons/platforms/${ch}.png`} alt={ch} />
            </div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            { t: 'Cross-posting', d: 'Bir içerik, her kanal. Format ve uzunluk otomatik uyarlanır.' },
            { t: 'Önizleme', d: 'Yayından önce her kanalın gerçek görünümünü gör.' },
            { t: 'Programlama', d: 'Belirli saatler, tekrarlar, evergreen rotation.' },
          ].map((c) => (
            <div key={c.t} className="pub-card p-7">
              <h4 className="text-[18px] mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{c.t}</h4>
              <p className="text-[14px] text-[color:var(--pub-ink-dim)] leading-[1.6]" style={{ fontWeight: 400 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>
      <PubBottomCta />
    </>
  );
}
