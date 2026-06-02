import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'İletişim — Publio' };

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="İletişim"
      title={<>Bize ulaşın</>}
      subtitle="Sorularınız, satış görüşmeleri ve destek talepleri için aşağıdaki kanallar üzerinden bize ulaşabilirsiniz."
      updatedAt="2 Haziran 2026"
      sections={[
        {
          heading: 'Genel İletişim',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li><strong>E-posta:</strong> <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li><strong>Telefon:</strong> {COMPANY.phone}</li>
              <li><strong>Adres:</strong> {COMPANY.address}</li>
              <li><strong>Çalışma saatleri:</strong> {COMPANY.hours}</li>
            </ul>
          ),
        },
        {
          heading: 'Departmanlara Özel Adresler',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li><strong>Satış & demo:</strong> <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li><strong>Teknik destek:</strong> <a className="underline" href="mailto:support@verihane.net">support@verihane.net</a></li>
              <li><strong>KVKK & gizlilik:</strong> <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a></li>
              <li><strong>Güvenlik açığı bildirimi:</strong> <a className="underline" href={`mailto:${COMPANY.securityEmail}`}>{COMPANY.securityEmail}</a></li>
              <li><strong>Basın & marka:</strong> <a className="underline" href="mailto:press@verihane.net">press@verihane.net</a></li>
            </ul>
          ),
        },
        {
          heading: 'Yanıt Süreleri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Genel sorular: 1 iş günü.</li>
              <li>Teknik destek: Pro paket ve üzeri için 4 saat (iş günleri).</li>
              <li>Güvenlik bildirimleri: 24 saat içinde geri dönüş.</li>
              <li>KVKK başvuruları: Yasal süre 30 gün, hedefimiz 7 gün.</li>
            </ul>
          ),
        },
        {
          heading: 'Posta ve Tebligat',
          body: (
            <p>
              Resmi tebligat ve yazışmalar için lütfen merkez ofis adresimizi kullanın:
              <br />
              <strong>{COMPANY.legalName}</strong> — {COMPANY.address}
            </p>
          ),
        },
      ]}
    />
  );
}
