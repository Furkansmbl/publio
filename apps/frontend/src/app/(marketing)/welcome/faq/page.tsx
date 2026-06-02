import { PubPageHero, PubBottomCta } from '../../_lib/shell';

export const metadata = { title: 'SSS — Publio' };

const faqs: [string, string][] = [
  ['Publio postları otomatik tekrarlayabilir mi?', 'Evet. Evergreen içeriklerini etiketleyip belirlediğin frekansta otomatik olarak yeniden yayına alabilir; AI ile her seferinde yeniden yazdırabilirsin.'],
  ['Public API ve webhook var mı?', 'Evet. REST tabanlı tam dokümante edilmiş bir API ve yayın olaylarını dinlemek için webhook desteği sunuyoruz. SDK\'larımız da hazır.'],
  ['Hangi analizleri sunuyor?', 'Kanal bazlı erişim, etkileşim, yeni takipçi, en iyi içerik saatleri ve içerik tipi performans karşılaştırması — tek dashboard\'da.'],
  ['Aynı içeriği farklı kanallara aynı anda gönderebilir miyim?', 'Tabii. Cross-posting modunda her kanal için karakter limiti, hashtag ve format farkını AI otomatik uyarlıyor.'],
  ['Hangi AI özellikleri var?', 'Caption üretimi, başlık önerisi, görsel oluşturma, marka tonu öğrenme, MCP ajanları ve içerik plan otomasyonu.'],
  ['Tek hesapla birden çok marka yönetebilir miyim?', 'Evet. Sınırsız çalışma alanı oluşturup ekibini her marka için ayrı rollerle davet edebilirsin.'],
  ['İptal etmek kolay mı?', 'Tek tıkla iptal. Hiçbir sorgu yok, faturalandırma anında durur.'],
  ['Verilerim güvende mi?', 'Tüm veriler şifreli olarak saklanır, OAuth2 ile yetkilendirme yapılır, rol bazlı erişim ile takım kontrolü sağlanır.'],
];

export default function FaqPage() {
  return (
    <>
      <PubPageHero
        eyebrow="SSS"
        title={<>Aklındaki her şey.</>}
        subtitle="Bulamadığını bize sor — en geç bir iş günü içinde dönüyoruz."
      />
      <section className="max-w-[920px] mx-auto px-6 pb-24">
        <div className="pub-card overflow-hidden">
          {faqs.map(([q, a]) => (
            <details key={q} className="pub-faq border-b border-[var(--pub-line)] last:border-b-0">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className="text-center mt-10 text-[14px] text-[color:var(--pub-ink-dim)]">
          Hâlâ cevabını bulamadın mı? <a className="underline" href="mailto:hi@publio.app">hi@publio.app</a>
        </p>
      </section>
      <PubBottomCta />
    </>
  );
}
