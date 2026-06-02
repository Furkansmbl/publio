import { IMG, PubPageHero, PubBottomCta } from '../../_lib/shell';

export const metadata = { title: 'Hikayeler — Publio' };

const stories = [
  { q: 'Publio\'yu n8n\'e bağladım — günlük yayın akışım otomatik. Bir gün bile post atmayı kaçırmıyorum.', a: 'Bartolomeo K.', role: 'İçerik Üreticisi', img: IMG.portrait1 },
  { q: 'Self-host edebildiğim, AI destekli, tek panelde 20+ kanala yayın yapan başka bir araç bulamadım.', a: 'Michael H.', role: 'DevRel', img: IMG.portrait2 },
  { q: '14 markanın sosyal medyasını Publio\'da çeviriyoruz. Onay akışları işimizi 4 katına çıkardı.', a: 'Maria C.', role: 'Ajans Sahibi', img: IMG.portrait3 },
  { q: 'AI içerik + görsel tasarım aynı yerde. 3 araç kullanıyorduk, hepsini Publio\'ya taşıdık.', a: 'Jacob S.', role: 'Pazarlama Lideri', img: IMG.portrait4 },
  { q: 'Privacy-first bir şirket olarak self-host imkanı kritik. Esnek yapısı oyun değiştirici.', a: 'Johannes D.', role: 'CTO', img: IMG.portrait5 },
  { q: 'MCP\'den Claude\'a "şunu paylaş" diyorum, Publio yayınlıyor. Geleceği yaşıyorum.', a: 'Vince C.', role: 'Geliştirici', img: IMG.portrait6 },
];

export default function StoriesPage() {
  return (
    <>
      <PubPageHero
        eyebrow="Hikayeler"
        title={<>Yaratıcılar, ajanslar ve geliştiriciler ne diyor?</>}
        subtitle="Tek başına çalışan içerik üreticisinden 30 markalı ajanslara kadar — Publio'yu nasıl kullandıklarını anlatıyorlar."
      />
      <section className="max-w-[1240px] mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((t, i) => (
            <figure key={t.a} className={`pub-card p-7 ${i === 1 ? 'pub-card-tinted' : ''}`}>
              <div className="text-[color:var(--pub-coral)] mb-3 text-[28px] leading-none">"</div>
              <blockquote className="text-[15px] leading-[1.65] text-[color:var(--pub-ink)]" style={{ fontWeight: 500 }}>{t.q}</blockquote>
              <figcaption className="mt-5 pt-5 border-t border-[var(--pub-line)] flex items-center gap-3">
                <img src={t.img} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-[14px]" style={{ fontWeight: 600 }}>{t.a}</div>
                  <div className="text-[12px] text-[color:var(--pub-ink-faint)]" style={{ fontWeight: 400 }}>{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <PubBottomCta />
    </>
  );
}
