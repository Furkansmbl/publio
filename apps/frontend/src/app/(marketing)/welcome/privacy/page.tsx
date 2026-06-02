import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'Gizlilik Politikası — Publio' };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Gizlilik"
      title={<>Gizlilik Politikası</>}
      subtitle="Kişisel verilerinizi nasıl topladığımızı, işlediğimizi ve koruduğumuzu adım adım açıklıyoruz."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          Bu Gizlilik Politikası, <strong>{COMPANY.legalName}</strong> tarafından işletilen{' '}
          <strong>{COMPANY.brand}</strong> hizmeti kapsamında kullanıcıların kişisel verilerinin
          işlenmesine ilişkin uygulamalarımızı tanımlar. Hizmeti kullanarak bu politikayı kabul
          etmiş sayılırsınız.
        </p>
      }
      sections={[
        {
          heading: 'Topladığımız veriler',
          body: (
            <>
              <p>Aşağıdaki kategorilerde veri işleyebiliriz:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li><strong>Hesap verileri:</strong> ad, soyad, e-posta, şifre özeti, organizasyon adı.</li>
                <li><strong>İçerik verileri:</strong> oluşturduğunuz post, taslak, medya, takvim verileri.</li>
                <li><strong>Bağlı sosyal medya hesabı verileri:</strong> OAuth token'ları, profil tanımlayıcısı, izinli scope'lar.</li>
                <li><strong>Kullanım verileri:</strong> oturum süresi, tıklama, IP adresi, tarayıcı bilgisi, cihaz türü.</li>
                <li><strong>Faturalama verileri:</strong> Stripe / iyzico üzerinden işlenen fatura bilgisi (kart numarası bizde tutulmaz).</li>
                <li><strong>AI üretim verileri:</strong> AI sağlayıcılarına gönderilen istem (prompt) ve dönen çıktıların metadatası.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Verileri işleme amaçlarımız',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Hizmeti sağlamak, hesabınızı yönetmek ve teknik destek sunmak.</li>
              <li>Sosyal medya yayınlarını yetkilendirdiğiniz kanallara iletmek.</li>
              <li>Faturalama, abonelik yönetimi ve yasal yükümlülüklerin yerine getirilmesi.</li>
              <li>Servis kalitesini ölçmek, performans ve güvenlik anomalilerini tespit etmek.</li>
              <li>İzin verdiğiniz takdirde ürün güncellemeleri ve pazarlama iletişimi göndermek.</li>
            </ul>
          ),
        },
        {
          heading: 'Hukuki dayanaklar',
          body: (
            <p>
              KVKK m.5 ve GDPR Art. 6 uyarınca; sözleşmenin ifası, açık rıza, meşru menfaat,
              hukuki yükümlülük ve hakkın tesisi gerekçeleriyle veri işleriz.
            </p>
          ),
        },
        {
          heading: 'Verilerinizi paylaştığımız üçüncü taraflar',
          body: (
            <>
              <p>
                Hizmeti sunabilmek için aşağıdaki kategorilerdeki tedarikçilerle, yalnızca gerekli
                veriyle sınırlı olarak paylaşım yapabiliriz:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Bulut altyapısı: AWS / Hetzner / Cloudflare R2.</li>
                <li>Ödeme: Stripe, iyzico.</li>
                <li>E-posta: Resend.</li>
                <li>Hata izleme: Sentry.</li>
                <li>AI sağlayıcıları: OpenAI, Anthropic, Google, ElevenLabs, HeyGen, Runway, Stability.</li>
                <li>Sosyal platform API'ları: yetkilendirdiğiniz hesaplar.</li>
              </ul>
              <p>Tüm tedarikçilerle veri işleme sözleşmesi (DPA) imzalanmıştır.</p>
            </>
          ),
        },
        {
          heading: 'Yurt dışına aktarım',
          body: (
            <p>
              Bazı sağlayıcılarımız (ör. OpenAI, AWS) yurt dışında bulunduğundan, KVKK m.9 ve
              GDPR Art. 46 kapsamında standart sözleşme maddeleri (SCC) uygulanmaktadır. Açık
              rızanız haricinde Türkiye dışına aktarım yalnızca güvenli ülkelere veya SCC'li
              tedarikçilere yapılır.
            </p>
          ),
        },
        {
          heading: 'Saklama süreleri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Hesap verileri: hesap aktifken + iptal sonrası 90 gün, sonra anonimleştirilir.</li>
              <li>Faturalama verileri: VUK uyarınca 10 yıl saklanır.</li>
              <li>Log / güvenlik kayıtları: 1 yıl.</li>
              <li>AI prompt / çıktı: 30 gün, sonra silinir (Enterprise tier'da 0 retention seçeneği).</li>
            </ul>
          ),
        },
        {
          heading: 'Haklarınız',
          body: (
            <>
              <p>KVKK m.11 ve GDPR Art. 15–22 uyarınca:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Verilerinize erişim, düzeltme ve silme talep edebilirsiniz.</li>
                <li>İşlemenin sınırlandırılmasını ve veri taşınabilirliği isteyebilirsiniz.</li>
                <li>Açık rızanızı her zaman geri çekebilirsiniz.</li>
                <li>Veri Sorumluları Sicil Bilgi Sistemi'ne (VERBİS) kayıtlıyız.</li>
              </ul>
              <p>
                Talepleriniz için <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a> adresine
                başvurabilirsiniz. Başvurularınızı en geç 30 gün içinde yanıtlarız.
              </p>
            </>
          ),
        },
        {
          heading: 'Güvenlik tedbirleri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>TLS 1.2+ ile uçtan uca şifrelenmiş iletişim.</li>
              <li>OAuth token'ları AES-256 ile şifrelenmiş halde saklanır.</li>
              <li>Rol bazlı erişim kontrolü, çok faktörlü kimlik doğrulama.</li>
              <li>Düzenli sızma testi ve bağımlılık taraması.</li>
              <li>Yedekleme ve felaket kurtarma planı.</li>
            </ul>
          ),
        },
        {
          heading: 'Çocuklar',
          body: (
            <p>
              Hizmet 16 yaşın altındaki çocuklara yönelik değildir; bu yaşın altındaki bir
              çocuğa ait veri tespit edersek hesabı kapatır ve veriyi sileriz.
            </p>
          ),
        },
        {
          heading: 'Politikadaki değişiklikler',
          body: (
            <p>
              Bu politika güncellendiğinde tarihi değiştirir; önemli değişikliklerde size
              e-posta ile bildirim göndeririz.
            </p>
          ),
        },
      ]}
      contact={
        <p>
          <strong>{COMPANY.legalName}</strong>
          <br />
          {COMPANY.address}
          <br />
          E-posta: <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>
          <br />
          Telefon: {COMPANY.phone}
          <br />
          Çalışma saatleri: {COMPANY.hours}
        </p>
      }
    />
  );
}
