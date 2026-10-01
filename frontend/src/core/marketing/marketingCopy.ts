/**
 * Tanıtım sitesinin metinleri. Telefon ve masaüstü aynı içeriği kendi bileşenleriyle çizer; metin tek yerde durur.
 * icon: shared/atoms/MarketingIcon'daki adlardan biri.
 */
export const PRODUCT_POINTS = [
  {
    icon: 'camera',
    title: 'Sahanın günlüğü elinizde',
    text: 'Fotoğraf, video ve sesli notlar ilgili şantiyede birikir. Yapılan işi ve sahadaki sorunları aynı akışta takip edin.',
  },
  {
    icon: 'clipboard',
    title: 'Yoklama ve puantaj',
    text: 'Şef günlük yoklamayı kaydeder, ofis aylık puantajı görür. Excel dökümünü aynı kayıtlardan hazırlayın.',
  },
  {
    icon: 'truck',
    title: 'Her malzemenin hareketi kayıtlı',
    text: 'Depoya girişleri, şantiyeye sevkiyatları ve iadeleri izleyin. Belgeler ve geri beklenen malzemeler hareketin yanında dursun.',
  },
  {
    icon: 'chart',
    title: 'İlerleme takibi',
    text: 'İş kalemlerini ve günlük imalatı kaydedin. Taşeronların ilerlemesini yapılan iş üzerinden değerlendirin.',
  },
  {
    icon: 'tasks',
    title: 'Görevler',
    text: 'Yapılacak işi, sorumlusunu ve teslim tarihini belirleyin. Şantiyedeki görevlerin durumunu tek listeden izleyin.',
  },
  {
    icon: 'shield',
    title: 'Firmanıza özel alan',
    text: 'Şantiyeleriniz ve kayıtlarınız firmanıza ait çalışma alanında kalır. Her ekip üyesi rolünün izin verdiği bilgilere erişir.',
  },
] as const

export const START_STEPS = [
  { title: 'İhtiyacınızı konuşalım', text: 'Şantiyelerinizi ve ekibinizin çalışma şeklini anlatın. Ürünü birlikte değerlendirelim.' },
  { title: 'Paketinizi belirleyelim', text: 'Ekip büyüklüğünüz ve kullanacağınız modüller için uygun paketi seçelim.' },
  { title: 'Çalışma alanınız açılsın', text: 'Size özel kurulum bağlantısıyla firma bilgilerinizi ve ilk şantiyenizi oluşturun.' },
  { title: 'Ekibiniz işe başlasın', text: 'Katılım bağlantısını ekibinizle paylaşın. Saha telefondan, ofis bilgisayardan aynı alana girsin.' },
] as const

export const FAQ = [
  {
    question: 'Saha ekibinin uygulama indirmesi gerekiyor mu?',
    answer: 'Constructor ERP telefon ve bilgisayarın tarayıcısında çalışır. Telefonunuzun ana ekranına da ekleyebilirsiniz. Ekibiniz firma katılım bağlantısı üzerinden çalışma alanına katılır.',
  },
  {
    question: 'Ödemeyi nasıl yapıyoruz?',
    answer: 'Paketinizi ekibimizle birlikte belirleyebilirsiniz. Ödeme havale/EFT ya da elden alınır; abonelik dönemi firma hesabınızda görünür.',
  },
  {
    question: 'Abonelik biterse verilerimiz silinir mi?',
    answer: 'Abonelik süresi dolduğunda çalışma alanına erişim kilitlenir; süre dolması kayıtları silmez. Aboneliğiniz yenilenip erişim açıldığında mevcut kayıtlarınızla devam edersiniz.',
  },
  {
    question: 'Paketi sonradan değiştirebilir miyiz?',
    answer: 'Evet. Şantiye ve ekip sayınız değiştiğinde ekibimizle paket değişikliğini görüşebilirsiniz. Aynı firma alanında çalışmaya devam edersiniz.',
  },
  {
    question: 'Verilerimiz başka firmalarla karışır mı?',
    answer: 'Hayır. Her firmanın verisi veritabanı seviyesinde ayrıdır; bir firmanın kullanıcısı başka bir firmanın tek satırını bile göremez.',
  },
] as const

/**
 * Satış ekibinin telefonu ve e-postası derlemede ortamdan gelir (VITE_SALES_PHONE, VITE_SALES_EMAIL): kurulan her
 * ortamın kendi numarası olur, uydurma numara koda girmez. Verilmezse site yalnızca başvuru formunu gösterir.
 */
const phone: string | undefined = import.meta.env.VITE_SALES_PHONE || undefined
export const CONTACT = {
  phone,
  phoneHref: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined,
  email: (import.meta.env.VITE_SALES_EMAIL as string | undefined) || undefined,
}
