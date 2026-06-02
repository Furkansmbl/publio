import { COMPANY, LegalPage } from '../_legal/legal-shell';

export const metadata = { title: 'KVKK Aydınlatma Metni — Publio' };

export default function KvkkPage() {
  return (
    <LegalPage
      eyebrow="KVKK"
      title={<>KVKK Aydınlatma Metni</>}
      subtitle="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri işleme aydınlatma metnimiz."
      updatedAt="2 Haziran 2026"
      intro={
        <p>
          İşbu aydınlatma metni, <strong>{COMPANY.legalName}</strong> ("Şirket", "Veri Sorumlusu")
          tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVKK") 10. maddesi
          uyarınca, ilgili kişilerin aydınlatılması amacıyla hazırlanmıştır.
        </p>
      }
      sections={[
        {
          heading: 'Veri Sorumlusu',
          body: (
            <p>
              Veri sorumlusu sıfatıyla <strong>{COMPANY.legalName}</strong>; merkez adresi{' '}
              {COMPANY.address}, e-posta {COMPANY.privacyEmail}, telefon {COMPANY.phone}.
            </p>
          ),
        },
        {
          heading: 'İşlenen Kişisel Veri Kategorileri',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li><strong>Kimlik:</strong> ad, soyad.</li>
              <li><strong>İletişim:</strong> e-posta, telefon, adres.</li>
              <li><strong>Müşteri işlem:</strong> abonelik, fatura, ödeme bilgileri.</li>
              <li><strong>İşlem güvenliği:</strong> IP, log kaydı, çerez verileri.</li>
              <li><strong>Pazarlama:</strong> alışkanlık ve tercih bilgileri (rıza ile).</li>
              <li><strong>Görsel & işitsel kayıt:</strong> destek aramalarındaki kayıtlar.</li>
            </ul>
          ),
        },
        {
          heading: 'Kişisel Verilerin İşlenme Amaçları',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Sözleşmenin kurulması ve ifasıyla doğrudan doğruya ilgili olması.</li>
              <li>Hukuki yükümlülüklerin yerine getirilmesi (vergi, ticaret, KVKK).</li>
              <li>Müşteri memnuniyeti, talep ve şikâyet yönetimi.</li>
              <li>Faaliyetlerin mevzuata uygun yürütülmesi, denetim & risk yönetimi.</li>
              <li>Bilgi güvenliği süreçlerinin yürütülmesi.</li>
              <li>Açık rızanız ile pazarlama ve elektronik ileti gönderimi.</li>
            </ul>
          ),
        },
        {
          heading: 'Hukuki Sebepler',
          body: (
            <p>
              KVKK m.5/2 uyarınca: kanunlarda açıkça öngörülmesi, sözleşmenin ifası, hukuki
              yükümlülüğün yerine getirilmesi, hakkın tesisi, meşru menfaat ve gerekli hallerde
              KVKK m.5/1 uyarınca açık rıza.
            </p>
          ),
        },
        {
          heading: 'Aktarım — Yurt İçi & Yurt Dışı',
          body: (
            <>
              <p>
                Kişisel verileriniz; yetkili kamu kurum/kuruluşları, tedarikçiler, ödeme kuruluşları,
                bulut hizmet sağlayıcıları, AI servis sağlayıcıları ve hukuk müşavirlerimizle
                paylaşılabilir.
              </p>
              <p>
                Yurt dışına aktarım, KVKK m.9 ve Kurul kararları çerçevesinde, taahhütname ya da
                standart sözleşme maddeleri (SCC) imzalanmış güvenli sağlayıcılar üzerinden veya
                açık rızanıza dayalı olarak gerçekleştirilir.
              </p>
            </>
          ),
        },
        {
          heading: 'Toplama Yöntemi',
          body: (
            <p>
              Veriler; Publio web sitesi, mobil arayüz, e-posta yazışmaları, çerezler, müşteri
              destek kanalları ve entegrasyon yaptığınız üçüncü parti servislerden otomatik veya
              kısmen otomatik yollarla toplanır.
            </p>
          ),
        },
        {
          heading: 'KVKK m.11 Kapsamındaki Haklarınız',
          body: (
            <ul className="list-disc pl-6 flex flex-col gap-2">
              <li>Kişisel verinin işlenip işlenmediğini öğrenme.</li>
              <li>İşlenmişse bilgi talep etme ve amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
              <li>Yurt içi/dışında aktarıldığı üçüncü kişileri bilme.</li>
              <li>Eksik / yanlış verinin düzeltilmesini isteme.</li>
              <li>KVKK m.7 çerçevesinde silinmesini / yok edilmesini talep etme.</li>
              <li>Otomatik sistemlerle yapılan analize itiraz etme.</li>
              <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini isteme.</li>
            </ul>
          ),
        },
        {
          heading: 'Başvuru Yöntemi',
          body: (
            <>
              <p>
                Başvurularınızı, "Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ"
                kapsamında aşağıdaki yöntemlerle iletebilirsiniz:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Yazılı: {COMPANY.address} adresine ıslak imzalı dilekçe ile.</li>
                <li>KEP: kep adresimiz üzerinden (talep üzerine paylaşılır).</li>
                <li>E-posta: <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a></li>
              </ul>
              <p>Başvurularınızı en geç <strong>30 gün</strong> içinde sonuçlandırırız.</p>
            </>
          ),
        },
      ]}
      contact={
        <p>
          <strong>{COMPANY.legalName}</strong> — Veri Sorumlusu
          <br />
          {COMPANY.address}
          <br />
          KVKK iletişim: <a className="underline" href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>
          <br />
          Telefon: {COMPANY.phone}
        </p>
      }
    />
  );
}
