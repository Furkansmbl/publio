import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'Teslimat ve İade Şartları — Publio' };

export default function TeslimatIadePage() {
  return (
    <LegalPage
      eyebrow="Teslimat & İade"
      title={<>Teslimat ve İade Şartları</>}
      subtitle="Publio dijital bir hizmettir; teslimat elektronik ortamda anında gerçekleşir."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          {COMPANY.brand}, {COMPANY.legalName} tarafından sunulan, tamamen dijital bir
          sosyal medya planlama ve AI içerik üretim hizmetidir. Fiziksel ürün satışı ve
          kargo teslimatı bulunmamaktadır. Bu sayfa, hizmetin ifa (teslimat) ve iade
          koşullarını özetler.
        </p>
      }
      sections={[
        {
          heading: 'Teslimat Şekli ve Süresi',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>
                Hizmet, ödeme onayının ardından <strong>anında</strong> ve elektronik
                ortamda ifa edilir. Abonelik özellikleri ile AI kredileri hesabınıza
                otomatik olarak tanımlanır.
              </li>
              <li>
                Herhangi bir kargo, teslimat ücreti veya fiziksel gönderim söz konusu
                değildir.
              </li>
              <li>
                Ödeme kuruluşu kaynaklı doğrulama süreçleri nedeniyle nadiren oluşabilecek
                gecikmelerde, hesabınız doğrulama tamamlanır tamamlanmaz aktive edilir.
              </li>
              <li>
                Teslimatın gerçekleşmemesi (hesaba kredi/özellik tanımlanmaması) durumunda{' '}
                {COMPANY.email} adresine başvurmanız hâlinde sorun en geç 2 iş günü içinde
                giderilir veya ücret iadesi yapılır.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Hizmete Erişim',
          body: (
            <p>
              Satın aldığınız aboneliğe {COMPANY.website} adresinden üyelik hesabınızla
              giriş yaparak erişebilirsiniz. Hizmet 7/24 erişime açıktır; planlı bakım
              çalışmaları önceden duyurulur.
            </p>
          ),
        },
        {
          heading: 'Faturalandırma',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>
                Satın alımınıza ilişkin e-fatura/e-arşiv fatura, ödeme adımında beyan
                ettiğiniz bilgilere göre düzenlenir ve e-posta adresinize iletilir.
              </li>
              <li>
                Kurumsal fatura talepleriniz için vergi dairesi ve numara bilgilerini
                ödeme adımında veya {COMPANY.email} üzerinden iletebilirsiniz.
              </li>
            </ul>
          ),
        },
        {
          heading: 'Cayma Hakkı ve İade',
          body: (
            <>
              <p>
                Ödeme tarihinden itibaren <strong>14 gün</strong> içinde, hesabınıza
                tanımlanan AI kredilerinden hiçbiri kullanılmamışsa tam iade hakkınız
                vardır. Tüketilmiş krediler ve oluşturulmuş içerikler için, dijital
                hizmetlerde anında ifa nedeniyle (Mesafeli Sözleşmeler Yönetmeliği m.15)
                cayma hakkı sınırlanabilir.
              </p>
              <p>
                İade koşullarının tamamı için{' '}
                <a className="underline" href="/welcome/refund">
                  İade ve İptal Politikası
                </a>{' '}
                ve{' '}
                <a className="underline" href="/welcome/mesafeli-satis">
                  Mesafeli Satış Sözleşmesi
                </a>{' '}
                geçerlidir.
              </p>
            </>
          ),
        },
        {
          heading: 'İade Süreci',
          body: (
            <ol className="list-decimal pl-6 flex flex-col gap-2">
              <li>
                {COMPANY.email} adresine fatura/abonelik bilgilerinizle birlikte iade
                talebinizi iletin.
              </li>
              <li>Talebiniz 2 iş günü içinde değerlendirilir ve tarafınıza dönülür.</li>
              <li>
                Onaylanan iadeler, ödemenin yapıldığı karta/yönteme 5–10 iş günü içinde
                yapılır. Bankaya bağlı süreler değişebilir.
              </li>
            </ol>
          ),
        },
        {
          heading: 'İptal',
          body: (
            <p>
              Aboneliğinizi hesabınızdan dilediğiniz an iptal edebilirsiniz. İptal,
              yenilemeyi durdurur; mevcut dönem sonuna kadar hizmet kesintisiz devam eder.
              Dönem ortasındaki iptallerde, 14 günlük cayma süresi dışındaki kullanılmış
              dönemler için iade yapılmaz.
            </p>
          ),
        },
        {
          heading: 'Tüketici Hakları',
          body: (
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki haklarınızı
              kullanmak için Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri&apos;ne
              başvurabilirsiniz. Çankaya Tüketici Hakem Heyeti yetkilidir.
            </p>
          ),
        },
      ]}
      contact={
        <p>
          Teslimat ve iade ile ilgili sorularınız için:{' '}
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
