import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'Mesafeli Satış Sözleşmesi — Publio' };

export default function MesafeliSatisPage() {
  return (
    <LegalPage
      eyebrow="Sözleşme"
      title={<>Mesafeli Satış Sözleşmesi</>}
      subtitle="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), {COMPANY.brand} platformu
          üzerinden elektronik ortamda kurulan abonelik ve dijital hizmet satışlarına
          uygulanır. ALICI, {COMPANY.brand} üzerinden ödeme adımını onayladığında işbu
          Sözleşme&apos;nin tüm hükümlerini okuyup kabul ettiğini beyan eder.
        </p>
      }
      sections={[
        {
          heading: 'Taraflar',
          body: (
            <>
              <p>
                <strong>SATICI</strong>
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-1">
                <li>Unvan: {COMPANY.legalName}</li>
                <li>Adres: {COMPANY.address}</li>
                <li>
                  E-posta:{' '}
                  <a className="underline" href={`mailto:${COMPANY.email}`}>
                    {COMPANY.email}
                  </a>
                </li>
                <li>Telefon: {COMPANY.phone}</li>
              </ul>
              <p className="mt-3">
                <strong>ALICI</strong>
              </p>
              <p>
                Hizmeti satın alan, üyelik/ödeme formunda kimlik ve iletişim bilgilerini
                beyan eden gerçek veya tüzel kişi. ALICI&apos;nın beyan ettiği bilgiler
                işbu Sözleşme&apos;nin ekidir ve fatura bu bilgilere göre düzenlenir.
              </p>
            </>
          ),
        },
        {
          heading: 'Sözleşmenin Konusu',
          body: (
            <p>
              İşbu Sözleşme&apos;nin konusu, ALICI&apos;nın SATICI&apos;ya ait{' '}
              {COMPANY.website} internet sitesi/uygulaması üzerinden elektronik ortamda
              siparişini verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen dijital
              hizmetin (sosyal medya planlama aboneliği, AI kredi paketleri ve ilgili
              hizmetler) satışı ve ifası ile ilgili olarak tarafların hak ve
              yükümlülüklerinin belirlenmesidir.
            </p>
          ),
        },
        {
          heading: 'Hizmetin Nitelikleri ve Fiyatı',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>
                Hizmetin türü, kapsamı, abonelik süresi (aylık/yıllık) ve dahil olan AI
                kredi miktarı, ödeme adımında ALICI&apos;ya açıkça gösterilir.
              </li>
              <li>
                Tüm fiyatlar, vergiler dahil Türk Lirası (₺) veya ABD Doları ($) cinsinden
                gösterilir; geçerli olan tutar ödeme ekranında belirtilen tutardır.
              </li>
              <li>
                Ek kredi paketleri tek seferlik satın alımlardır ve satın alındığı anda
                ALICI hesabına tanımlanır.
              </li>
              <li>
                Listelenen fiyatlar güncelleme tarihine kadar geçerlidir; SATICI ileriye
                dönük fiyat değişikliği yapma hakkını saklı tutar. Devam eden abonelik
                döneminin fiyatı değişmez.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Ödeme Şekli',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>
                Ödemeler, anlaşmalı ödeme kuruluşları (iyzico ve/veya Stripe) altyapısı
                üzerinden Visa / Mastercard kredi-banka kartı ile güvenli şekilde
                tahsil edilir.
              </li>
              <li>
                Kart bilgileri SATICI tarafından saklanmaz; tüm ödeme verisi PCI-DSS
                uyumlu ödeme kuruluşları tarafından işlenir.
              </li>
              <li>
                Abonelikler, ALICI iptal etmediği sürece dönem sonunda otomatik olarak
                yenilenir ve kayıtlı ödeme yöntemine yansıtılır.
              </li>
            </ul>
          ),
        },
        {
          heading: 'İfa / Teslimat',
          body: (
            <p>
              Satın alınan hizmet dijital niteliktedir. Ödemenin onaylanmasının hemen
              ardından, ALICI&apos;nın hesabına ilgili abonelik özellikleri ve AI
              kredileri tanımlanarak hizmet <strong>anında</strong> elektronik ortamda
              ifa edilir. Fiziksel teslimat söz konusu değildir. İfaya ilişkin
              ayrıntılar için <a className="underline" href="/welcome/teslimat-iade">Teslimat ve İade Şartları</a>{' '}
              sayfasına bakınız.
            </p>
          ),
        },
        {
          heading: 'Cayma Hakkı',
          body: (
            <>
              <p>
                ALICI, sözleşmenin kurulduğu tarihten itibaren <strong>14 (on dört) gün</strong>{' '}
                içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma
                hakkına sahiptir. Cayma bildirimi {COMPANY.email} adresine yazılı olarak
                yapılabilir.
              </p>
              <p>
                <strong>Cayma hakkının istisnası:</strong> Mesafeli Sözleşmeler Yönetmeliği
                m.15/1-(ğ) uyarınca, elektronik ortamda anında ifa edilen ve tüketiciye
                anında teslim edilen gayrimaddi mallarda (AI kredisi tüketimi, oluşturulan
                içerikler gibi) ALICI ifaya onay verdiyse ve hizmet kullanılmaya
                başlandıysa cayma hakkı sona erer. Kullanılmamış krediler ve hizmetler için
                cayma hakkı geçerlidir.
              </p>
            </>
          ),
        },
        {
          heading: 'İade ve İptal',
          body: (
            <p>
              İade, iptal ve cayma süreçlerinin detayları için{' '}
              <a className="underline" href="/welcome/refund">İade ve İptal Politikası</a> ve{' '}
              <a className="underline" href="/welcome/teslimat-iade">Teslimat ve İade Şartları</a>{' '}
              sayfaları işbu Sözleşme&apos;nin ayrılmaz parçasıdır. Onaylanan iadeler,
              ödemenin yapıldığı yönteme 5–10 iş günü içinde yapılır.
            </p>
          ),
        },
        {
          heading: 'Tarafların Yükümlülükleri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>
                SATICI, hizmeti Sözleşme&apos;ye uygun, eksiksiz ve ayıpsız olarak ifa
                etmeyi taahhüt eder.
              </li>
              <li>
                ALICI, beyan ettiği bilgilerin doğruluğundan ve hesap güvenliğinden
                sorumludur; hizmeti hukuka ve platform kullanım şartlarına uygun kullanır.
              </li>
              <li>
                ALICI&apos;nın yanlış/eksik bilgi vermesi nedeniyle doğacak zararlardan
                SATICI sorumlu tutulamaz.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Mücbir Sebep',
          body: (
            <p>
              Doğal afet, savaş, grev, altyapı/iletişim kesintileri, kamu otoritesi
              kararları ve üçüncü taraf hizmet sağlayıcı (AI sağlayıcıları, ödeme
              kuruluşları vb.) kaynaklı kesintiler gibi mücbir sebep hâllerinde taraflar
              edimlerini ifa edemediğinden sorumlu tutulamaz.
            </p>
          ),
        },
        {
          heading: 'Uyuşmazlıkların Çözümü',
          body: (
            <p>
              İşbu Sözleşme&apos;den doğabilecek uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca
              ilan edilen parasal sınırlar dâhilinde ALICI&apos;nın yerleşim yerindeki
              veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetleri ile Tüketici
              Mahkemeleri yetkilidir.
            </p>
          ),
        },
        {
          heading: 'Yürürlük',
          body: (
            <p>
              ALICI, işbu Sözleşme&apos;nin tüm koşullarını ödeme adımında elektronik
              ortamda onayladığında, Sözleşme taraflar arasında süresiz olarak yürürlüğe
              girer. Sözleşme&apos;nin bir nüshası ALICI&apos;nın e-posta adresine
              gönderilir ve hesabı üzerinden erişilebilir.
            </p>
          ),
        },
      ]}
      contact={
        <p>
          Sözleşme ve sipariş ile ilgili sorularınız için:{' '}
          <a className="underline" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          <br />
          {COMPANY.legalName} · {COMPANY.address}
          <br />
          Telefon: {COMPANY.phone} ({COMPANY.hours})
        </p>
      }
    />
  );
}
