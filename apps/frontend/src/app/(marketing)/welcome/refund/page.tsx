import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'İade & İptal Politikası — Publio' };

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="İade"
      title={<>İade ve İptal Politikası</>}
      subtitle="Aboneliğinizi her an iptal edebilirsiniz. İade koşullarımız aşağıdadır."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          Publio aboneliklerinde tam şeffaflık esastır. 6502 sayılı Tüketicinin Korunması
          Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca aşağıdaki haklara
          sahipsiniz.
        </p>
      }
      sections={[
        {
          heading: 'Cayma Hakkı (Tüketiciler İçin)',
          body: (
            <p>
              Bireysel kullanıcı olarak ödeme tarihinden itibaren <strong>14 gün</strong> içinde
              cayma hakkınızı kullanabilirsiniz. Ancak ifa edilmiş dijital içerik (örn.
              tüketilmiş AI kredisi, oluşturulmuş video) için cayma hakkı 6502 m.15 uyarınca
              sınırlıdır.
            </p>
          ),
        },
        {
          heading: 'Aylık Aboneliklerde İade',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Aboneliğinizi iptal ettiğinizde ücret iadesi yapılmaz; mevcut dönem sonuna kadar hizmet devam eder.</li>
              <li>İlk 14 gün içinde, AI kredilerinizden hiçbiri kullanılmamışsa tam iade yapılır.</li>
              <li>Krediden tüketilmiş kısım için iade söz konusu değildir.</li>
            </ul>
          ),
        },
        {
          heading: 'Yıllık Aboneliklerde İade',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>İlk 14 gün içinde, AI kredisi tüketilmemişse tam iade.</li>
              <li>14 günden sonra prorata iade yapılmaz; iptal sadece yenilemeyi durdurur.</li>
              <li>Kullanılmamış aylar için talep halinde, kullanılmamış kredi miktarına göre kısmi iade değerlendirilebilir.</li>
            </ul>
          ),
        },
        {
          heading: 'Ek Kredi Paketleri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Hiç kullanılmamış kredi paketi için ödeme tarihinden itibaren 14 gün içinde tam iade.</li>
              <li>Kısmen kullanılmış paketlerde, tüketilmemiş kredi oranında iade yapılır.</li>
              <li>180 gün geçerlilik süresi dolan kredilerde iade yapılmaz.</li>
            </ul>
          ),
        },
        {
          heading: 'İade Süreci',
          body: (
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>{COMPANY.email} adresine fatura/abonelik bilgileriyle başvurun.</li>
              <li>İlk değerlendirme 2 iş günü içinde tarafınıza iletilir.</li>
              <li>Onaylanan iadeler, ödeme yöntemine 5–10 iş günü içinde yansır.</li>
              <li>Banka iade süreleri (özellikle uluslararası kart) farklılık gösterebilir.</li>
            </ol>
          ),
        },
        {
          heading: 'İade Yapılmayan Durumlar',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Sözleşme şartlarının ihlali nedeniyle hesap askıya alındıysa.</li>
              <li>AI kredisi sağlayıcı kaynaklı bir hata nedeniyle tüketildiyse (yeniden tahsis edilir).</li>
              <li>Promosyon / lifetime / AppSumo lisanslarında satıcı politikası geçerlidir.</li>
            </ul>
          ),
        },
        {
          heading: 'Tüketici Hakemliği',
          body: (
            <p>
              İade taleplerinizin sonucundan memnun değilseniz, tüketici hakem heyetlerine veya
              Tüketici Mahkemesi'ne başvurabilirsiniz. 2026 yılı için belirlenen parasal sınırlar
              dahilinde Çankaya Tüketici Hakem Heyeti yetkilidir.
            </p>
          ),
        },
      ]}
      contact={
        <p>
          İade talepleri için: <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <br />
          Telefon: {COMPANY.phone} ({COMPANY.hours})
        </p>
      }
    />
  );
}
