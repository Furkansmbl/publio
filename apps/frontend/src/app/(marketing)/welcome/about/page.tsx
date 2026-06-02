import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'Hakkımızda — Publio' };

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="Hakkımızda"
      title={<>Markanın ardındaki ekip.</>}
      subtitle="Publio, içerik üreticilerinin ve markaların sosyal medyayı tek panelden yönetmesini hedefleyen, açık kaynaklı bir platformdur."
      intro={
        <p>
          <strong>{COMPANY.legalName}</strong>, Türkiye merkezli bir yazılım şirketidir. AGPL-3.0
          lisanslı <strong>{COMPANY.brand}</strong> platformunu hem bulutta hizmet olarak
          sunuyor hem de açık kaynak topluluğu için sürdürüyoruz.
        </p>
      }
      sections={[
        {
          heading: 'Misyonumuz',
          body: (
            <p>
              Çoklu sosyal medya yönetimi, AI üretimi ve ekip iş birliğini, küçük ekiplerin de
              ulaşabileceği bir kalite ve fiyatla, açık kaynak şeffaflığıyla sunmak.
            </p>
          ),
        },
        {
          heading: 'Açık kaynak duruşumuz',
          body: (
            <p>
              Publio, Postiz açık kaynak projesinin AGPL-3.0 lisanslı bir türevidir. Tüm
              değişikliklerimiz <a className="underline" href="https://github.com/Furkansmbl/publio">GitHub deposunda</a> herkese açıktır;
              topluluk katkılarına önem veriyoruz.
            </p>
          ),
        },
        {
          heading: 'Şirket bilgileri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li><strong>Ticari unvan:</strong> {COMPANY.legalName}</li>
              <li><strong>Merkez:</strong> {COMPANY.address}</li>
              <li><strong>E-posta:</strong> {COMPANY.email}</li>
              <li><strong>Telefon:</strong> {COMPANY.phone}</li>
              <li><strong>Web:</strong> {COMPANY.website}</li>
            </ul>
          ),
        },
        {
          heading: 'Ne için çalışıyoruz?',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Kurumsal seviyede güvenilir, küçük ekipler için erişilebilir bir araç.</li>
              <li>Yapay zeka maliyetlerinde şeffaflık (token-bazlı kredi modeli).</li>
              <li>Veri sahipliği — kullanıcının verisi her zaman kullanıcıya aittir.</li>
              <li>Topluluk odaklı geliştirme: özellik talepleri GitHub'da oylanır.</li>
            </ul>
          ),
        },
      ]}
      contact={
        <p>
          Bize katılmak veya iş birliği yapmak ister misiniz?{' '}
          <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> adresinden ulaşın.
        </p>
      }
    />
  );
}
