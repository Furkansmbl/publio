import { IMG, PubPageHero, PubBottomCta } from '../../_lib/shell';

export const metadata = { title: 'Özellikler — Publio' };

export default function FeaturesPage() {
  return (
    <>
      <PubPageHero
        eyebrow="Özellikler"
        title={<>Sosyal büyüme için ihtiyacın olan her şey, tek bir yerde.</>}
        subtitle="Planlama, içerik üretimi, takım iş akışı, otomasyon ve analitik — hepsi tek bir orkestrasyon platformunda."
      />

      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 pub-card pub-card-tinted p-10">
            <div className="pub-section-tag mb-4" style={{ color: 'var(--pub-coral)' }}>Planlama</div>
            <h3 className="pub-display text-[34px] mb-4">Sürükle-bırak yayın takvimi</h3>
            <p className="text-[15px] text-[color:var(--pub-ink-dim)] max-w-[460px] mb-7" style={{ fontWeight: 400 }}>
              Tüm kanalların için tek görsel takvim. Sürükle, yeniden zamanla, takım onayına yolla.
              Cross-posting otomatik karakter ve format optimizasyonu yapar.
            </p>
            <img src={IMG.desk} alt="" className="w-full rounded-xl border border-[var(--pub-line)] aspect-[16/9] object-cover" />
          </div>

          <div className="lg:col-span-5 pub-card pub-card-ink p-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-[220px] h-[220px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,116,72,0.4), transparent 70%)' }} />
            <div className="pub-section-tag mb-4" style={{ color: '#ff9d72' }}>AI Asistan</div>
            <h3 className="pub-display text-[30px] mb-4" style={{ color: '#fff' }}>Markan gibi yazan, sen gibi düşünen ajan.</h3>
            <p className="text-[14px] mb-6 leading-[1.65]" style={{ color: 'rgba(245,241,232,0.7)', fontWeight: 400 }}>
              Geçmiş içeriklerinden tonunu öğrenir, başlık, caption, hashtag ve görsel önerisini saniyeler içinde üretir.
            </p>
            <div className="space-y-2 text-[13px]" style={{ color: 'rgba(245,241,232,0.85)' }}>
              {['Marka tonu öğrenme', 'Caption + hashtag üretimi', 'Görsel önerileri (DALL-E, Flux)', 'Çoklu dil desteği'].map((x) => (
                <div key={x} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]" style={{ background: '#ff7448', color: '#1c0d05', fontWeight: 700 }}>✓</span>
                  {x}
                </div>
              ))}
            </div>
          </div>

          {[
            { t: 'Görsel editör', d: 'Canva benzeri editör. AI ile görsel üret, marka kitin hep yanında.', img: IMG.abstract },
            { t: 'Takım iş akışı', d: 'Roller, onay zincirleri ve markalar arası geçiş.', img: IMG.team },
            { t: 'Otomatik aksiyonlar', d: 'Eşik bazlı otomatik beğeni, yorum, repost.', img: IMG.phone },
            { t: 'Analitik', d: 'Kanal bazlı erişim, etkileşim ve içerik tipi karşılaştırması.', img: IMG.ai },
            { t: 'Marka kütüphanesi', d: 'Logolar, paletler, fontlar ve şablonlar tek havuzda.', img: IMG.creator },
            { t: 'Onay zincirleri', d: 'Çok aşamalı onay akışları, role-based izinler.', img: IMG.team },
          ].map((f) => (
            <div key={f.t} className="lg:col-span-4 md:col-span-6 pub-card overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={f.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-7">
                <h4 className="text-[19px] mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{f.t}</h4>
                <p className="text-[14px] text-[color:var(--pub-ink-dim)] leading-[1.6]" style={{ fontWeight: 400 }}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PubBottomCta />
    </>
  );
}
