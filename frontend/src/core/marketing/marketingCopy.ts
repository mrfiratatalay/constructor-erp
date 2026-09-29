/**
 * Tanıtım sitesinin metinleri. Telefon ve masaüstü aynı içeriği kendi bileşenleriyle çizer; metin tek yerde durur.
 * icon: shared/atoms/MarketingIcon'daki adlardan biri.
 */
export const PRODUCT_POINTS = [
  {
    icon: 'camera',
    title: 'Sahadan canlı haber',
    text: 'Şef fotoğrafı, videoyu, sesli notu şantiyenin defterine atar; patron ofisten anında görür. WhatsApp grubunda kaybolan mesaj yok.',
  },
  {
    icon: 'clipboard',
    title: 'Yoklama ve puantaj',
    text: 'Sabah yoklaması iki dokunuş. Ay sonunda puantaj cetveli hazır, Excel\'e tek tıkla dökülür.',
  },
  {
    icon: 'truck',
    title: 'Malzeme ve sevkiyat',
    text: 'Depodan şantiyeye, şantiyeden şantiyeye giden her kalem irsaliyesiyle kayıtlı; stok kendiliğinden düşer.',
  },
  {
    icon: 'chart',
    title: 'İlerleme takibi',
    text: 'Taşeron iş kalemleri, günlük imalat girişleri ve yüzde ilerleme. Hakediş öncesi tartışma biter.',
  },
  {
    icon: 'tasks',
    title: 'Görevler',
    text: 'Kim, neyi, ne zamana kadar yapacak: şantiyeye bağlı iş listesi, fotoğraflı teslim.',
  },
  {
    icon: 'shield',
    title: 'Firmanıza özel alan',
    text: 'Her firma yalnızca kendi verisini görür. Ekibinizin yetkisi rolüne göre: patron, şef, çalışan.',
  },
] as const

export const START_STEPS = [
  { title: 'Başvurun', text: 'Formu doldurun ya da arayın. Aynı gün dönüyoruz.' },
  { title: 'Paketinizi seçin', text: 'Ekibinizin büyüklüğüne göre paketi birlikte belirleriz. Ödeme havale ya da elden.' },
  { title: 'Kurulum bağlantısı', text: 'Size özel, tek kullanımlık bir link gelir: logonuz, hesabınız, ilk şantiyeniz.' },
  { title: 'Ekibinizi çağırın', text: 'Saha ekibi WhatsApp bağlantısıyla katılır; şifre, kurulum, eğitim gerekmez.' },
] as const

export const FAQ = [
  {
    question: 'Saha ekibinin uygulama indirmesi gerekiyor mu?',
    answer: 'Hayır. Constructor ERP tarayıcıda çalışır; isteyen telefonunun ana ekranına ekler. Ekip WhatsApp\'tan gelen bağlantıyla girer, şifre ezberlemez.',
  },
  {
    question: 'Ödemeyi nasıl yapıyoruz?',
    answer: 'Kredi kartı altyapısı kullanmıyoruz: ödemeyi havale/EFT ya da elden alıyoruz, faturanızı kesiyoruz. Aboneliğiniz ödeme alındığı gün başlar.',
  },
  {
    question: 'Abonelik biterse verilerimiz silinir mi?',
    answer: 'Hayır. Süre dolduğunda çalışma alanı yalnızca kilitlenir; ödeme yapıldığı an her şey kaldığı yerden açılır. Verileriniz silinmez.',
  },
  {
    question: 'Paketi sonradan değiştirebilir miyiz?',
    answer: 'Evet. Şantiye ve ekip büyüdükçe bir üst pakete geçersiniz; yeni modüller aynı gün açılır, veriniz yerinde kalır.',
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
