import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'Çerez Politikası — Publio' };

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Çerezler"
      title={<>Çerez Politikası</>}
      subtitle="Web sitemizde kullandığımız çerezler, hangi amaçla işlendikleri ve nasıl yönetebileceğiniz."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          Publio, kullanıcı deneyimini iyileştirmek, oturum güvenliğini sağlamak ve ürün
          kullanımını anlamak için çerezler ve benzeri teknolojiler kullanır.
        </p>
      }
      sections={[
        {
          heading: 'Çerez Nedir?',
          body: (
            <p>
              Çerezler, web siteleri tarafından tarayıcınıza yerleştirilen küçük metin
              dosyalarıdır. Site tekrar ziyaret edildiğinde tanınmanızı ve tercihlerinizin
              hatırlanmasını sağlarlar.
            </p>
          ),
        },
        {
          heading: 'Kullandığımız Çerez Kategorileri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>
                <strong>Zorunlu çerezler:</strong> oturum açma, CSRF koruması, dil tercihi.
                Devre dışı bırakılamaz.
              </li>
              <li>
                <strong>Performans çerezleri:</strong> sayfa süreleri, hata oranları (Sentry,
                Vercel Analytics).
              </li>
              <li>
                <strong>İşlevsel çerezler:</strong> tema (koyu/açık), gösterge tablosu düzeni.
              </li>
              <li>
                <strong>Pazarlama çerezleri:</strong> reklam takibi, A/B test (yalnızca açık
                rıza ile etkinleştirilir).
              </li>
            </ul>
          ),
        },
        {
          heading: 'Üçüncü Parti Çerezler',
          body: (
            <p>
              Hizmetimizi sağlayan tedarikçilerimiz (Stripe ödeme akışı, Cloudflare, Sentry, GTM)
              kendi alanlarında çerez yerleştirebilir. Her tedarikçinin politikası kendisine
              aittir; tedarikçi değiştiğinde bu listeyi güncelleriz.
            </p>
          ),
        },
        {
          heading: 'Çerez Yönetimi',
          body: (
            <>
              <p>
                Tarayıcı ayarlarınızdan tüm çerezleri silebilir, yeni çerezleri engelleyebilir
                veya belirli sitelerin çerez koymasını sınırlayabilirsiniz.
              </p>
              <p>
                Pazarlama ve performans çerezlerini, sayfa açıldığında gösterilen "Çerez
                tercihleri" panelinden veya hesap ayarlarınızdan istediğiniz zaman kapatabilirsiniz.
              </p>
            </>
          ),
        },
        {
          heading: 'Politikadaki Değişiklikler',
          body: (
            <p>
              Çerez listemiz değiştiğinde bu sayfayı güncelleriz. Önemli değişikliklerde panel
              içi bildirim göstermeyi taahhüt ederiz.
            </p>
          ),
        },
      ]}
      contact={
        <p>
          Çerezlerle ilgili sorularınız için{' '}
          <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a> adresine yazabilirsiniz.
        </p>
      }
    />
  );
}
