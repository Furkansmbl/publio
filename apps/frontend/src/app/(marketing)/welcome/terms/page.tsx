import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'Kullanım Şartları — Publio' };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Şartlar"
      title={<>Kullanım Şartları</>}
      subtitle="Publio hizmetini kullanmadan önce lütfen bu sözleşmeyi dikkatle okuyun."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          İşbu Kullanım Şartları (&quot;Sözleşme&quot;) <strong>{COMPANY.legalName}</strong>{' '}
          (&quot;Sağlayıcı&quot;) tarafından sunulan <strong>{COMPANY.brand}</strong> hizmetinin
          kullanım koşullarını düzenler. Hizmeti kullanarak bu şartları kabul ettiğinizi beyan
          edersiniz.
        </p>
      }
      sections={[
        {
          heading: 'Tanımlar',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li><strong>Hizmet:</strong> Publio web platformu, API'ları, SDK'ları ve eklentileri.</li>
              <li><strong>Kullanıcı:</strong> Hesap açan ve hizmeti kullanan gerçek/tüzel kişi.</li>
              <li><strong>İçerik:</strong> Kullanıcı tarafından yüklenen / üretilen tüm metin, görsel, ses ve video.</li>
              <li><strong>Kredi:</strong> AI tüketimi için kullanılan ön ödemeli sanal birim.</li>
            </ul>
          ),
        },
        {
          heading: 'Hesap ve Yetki',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>18 yaşını doldurmuş veya yasal temsilci onaylı olmalısınız.</li>
              <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz.</li>
              <li>Yetkisiz erişim tespit ederseniz derhal bize bildirmelisiniz.</li>
            </ul>
          ),
        },
        {
          heading: 'Kabul Edilebilir Kullanım',
          body: (
            <>
              <p>Aşağıdakiler kesinlikle yasaktır:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Spam, otomatik kitle hesap, takipçi/etkileşim botları.</li>
                <li>Telif, marka veya kişilik haklarını ihlal eden içerik.</li>
                <li>Yanıltıcı haber, derin sahte (deepfake) ile kişiyi taklit.</li>
                <li>Çocuk istismarı, terör propagandası, nefret söylemi.</li>
                <li>Kötü amaçlı yazılım dağıtımı, sızma ve DoS girişimi.</li>
                <li>Sosyal medya platformlarının kendi kurallarını ihlal eden kullanım.</li>
              </ul>
              <p>İhlal halinde hesap derhal askıya alınır; ödeme iadesi yapılmaz.</p>
            </>
          ),
        },
        {
          heading: 'Ücretler, Krediler ve Faturalama',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Aktif paketin aylık veya yıllık ücreti otomatik tahsil edilir.</li>
              <li>AI işlemleri kredi tüketir; kredi tükenmesi durumunda ilgili özellikler kısıtlanır.</li>
              <li>Ek kredi paketleri 180 gün içinde kullanılmazsa geçerliliğini kaybeder.</li>
              <li>Ödeme başarısız olursa 7 gün içinde yeniden denenir; ardından hesap pasifleştirilir.</li>
              <li>Tüm fiyatlar KDV hariçtir; geçerli yerel vergiler eklenir.</li>
            </ul>
          ),
        },
        {
          heading: 'İçerik Sahipliği & Lisans',
          body: (
            <p>
              Yüklediğiniz tüm içerik <strong>size aittir</strong>. Hizmeti sağlayabilmemiz için
              bize, içeriği depolamak, görüntülemek, formatını değiştirmek ve yetkilendirdiğiniz
              kanallarda yayınlamak için münhasır olmayan, dünya genelinde geçerli, ücretsiz bir
              lisans verirsiniz. Hesabınızı kapattığınızda bu lisans sona erer ve içeriğiniz silinir.
            </p>
          ),
        },
        {
          heading: 'AI Üretimi & Sorumluluk',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>AI çıktısının doğruluğu, telifsizliği ve uygunluğu kullanıcının sorumluluğundadır.</li>
              <li>AI sağlayıcılarının (OpenAI, HeyGen, Anthropic vb.) kendi şartları geçerlidir.</li>
              <li>Modelin halüsinasyon yapabileceğini kabul edersiniz; kritik kullanımlarda doğrulama yapın.</li>
              <li>Sağlayıcı modelinin değişmesi durumunda 30 gün önceden bildirim yaparız.</li>
            </ul>
          ),
        },
        {
          heading: 'Üçüncü Parti Servisler',
          body: (
            <p>
              Sosyal medya platformları, ödeme sağlayıcıları ve AI servisleri kendi kullanım
              şartlarına tâbidir. Publio bu servislerin kesintilerinden, içerik reddedilmesinden
              veya politika değişikliklerinden sorumlu tutulamaz.
            </p>
          ),
        },
        {
          heading: 'Hizmet Seviyesi (SLA)',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Standart paketlerde uptime hedefi <strong>%99.5</strong>.</li>
              <li>Business+ ve Enterprise için ayrı SLA add-on (hedef %99.9).</li>
              <li>Planlı bakım önceden duyurulur ve uptime hesabına dahil edilmez.</li>
            </ul>
          ),
        },
        {
          heading: 'Sorumluluğun Sınırlandırılması',
          body: (
            <p>
              Yürürlükteki hukuk izin verdiği ölçüde, Publio'nun toplam sorumluluğu, talebe konu
              olayın yaşandığı tarihten önceki <strong>12 ay</strong> içinde size yansıttığımız
              ücretlerle sınırlıdır. Dolaylı, arızi veya kâr kaybı niteliğindeki zararlardan
              sorumlu değiliz.
            </p>
          ),
        },
        {
          heading: 'Fesih',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Hesabınızı her zaman ayar panelinden kapatabilirsiniz.</li>
              <li>Sözleşmeyi ihlal etmeniz durumunda Sağlayıcı tek taraflı feshedebilir.</li>
              <li>Fesih sonrası 90 gün içinde verileriniz anonimleştirilir veya silinir.</li>
            </ul>
          ),
        },
        {
          heading: 'Uygulanacak Hukuk & Yetkili Mahkeme',
          body: (
            <p>
              İşbu Sözleşme, Türkiye Cumhuriyeti hukukuna tâbidir. Uyuşmazlıklarda Ankara
              Mahkemeleri ve İcra Daireleri yetkilidir; tüketici uyuşmazlıklarında 6502 sayılı
              kanun ve ilgili tüketici hakem heyetleri yetkilidir.
            </p>
          ),
        },
        {
          heading: 'Şartlardaki Değişiklikler',
          body: (
            <p>
              Bu Sözleşmeyi güncelleyebiliriz. Önemli değişiklikleri en az 30 gün önceden e-posta
              veya panel bildirimi ile duyururuz. Değişiklikten sonra hizmeti kullanmaya devam
              etmeniz, güncel sürümü kabul ettiğiniz anlamına gelir.
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
          E-posta: <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> · Telefon: {COMPANY.phone}
        </p>
      }
    />
  );
}
