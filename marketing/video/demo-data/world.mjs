/**
 * Reklam videolarının hayali dünyası: bütün videolarda aynı firma, aynı kişiler, aynı şantiyeler. Adlar gerçek
 * birine ait değildir. Numaralar 0500 ile başlar: hiçbir operatöre verilmemiş bir önektir, videoda görünen numara
 * kimsenin telefonunu çaldırmaz.
 */
const phone = (index) => `0500 000 10 ${String(index).padStart(2, '0')}`

/** Backend bu hesapla açılır (APP_BOOTSTRAP_*): firma ve patron boş veritabanında bir kez oluşur. */
export const OWNER = {
  company: 'Toprak Yapı',
  name: 'Murat Toprak',
  email: 'patron@toprakyapi.local',
  password: 'demo1234',
}

/** Uygulamayı kullanan yönetim: şefler yoklamayı alır, depo sorumlusu malzemeye bakar. */
export const STAFF = [
  { key: 'ahmet', name: 'Ahmet Kaya', role: 'SITE_LEAD', phone: phone(1) },
  { key: 'serkan', name: 'Serkan Demir', role: 'SITE_LEAD', phone: phone(2) },
  { key: 'mehmet', name: 'Mehmet Yılmaz', role: 'WAREHOUSE', phone: phone(3) },
]

/** Bağlantıdan katılan çalışanlar: yoklamaya kendiliğinden girer, kendi puantajını görür. */
export const APP_WORKERS = [
  { key: 'huseyin', name: 'Hüseyin Çelik', trade: 'Kalıpçı', phone: phone(11) },
  { key: 'mustafa', name: 'Mustafa Arslan', trade: 'Kalıpçı', phone: phone(12) },
  { key: 'ibrahim', name: 'İbrahim Koç', trade: 'Duvarcı', phone: phone(13) },
  { key: 'emre', name: 'Emre Şahin', trade: 'Operatör', phone: phone(14) },
  { key: 'yusuf', name: 'Yusuf Kılıç', trade: 'Sıvacı', phone: phone(15) },
  { key: 'ramazan', name: 'Ramazan Doğan', trade: 'Düz işçi', phone: phone(16) },
]

/** Uygulaması olmayanlar: şef onları adıyla listeye ekler. */
export const LISTED_PEOPLE = [
  { key: 'cemal', name: 'Cemal Aksoy', trade: 'Duvarcı', phone: phone(21) },
  { key: 'bayram', name: 'Bayram Güneş', trade: 'Düz işçi' },
  { key: 'kemal', name: 'Kemal Aslan', trade: 'Boyacı', phone: phone(23) },
  { key: 'hakan', name: 'Hakan Polat', trade: 'Kaynakçı', phone: phone(24) },
  { key: 'nurettin', name: 'Nurettin Yavuz', trade: 'Bekçi' },
  { key: 'selim', name: 'Selim Karaca', trade: 'Düz işçi' },
  { key: 'veli', name: 'Veli Bozkurt', trade: 'İskele ustası', phone: phone(27) },
  { key: 'orhan', name: 'Orhan Tekin', trade: 'Seramikçi', phone: phone(28) },
]

/** Taşeron ekipler: ekip olarak sayılır, ekipte kaç kişi olduğuna bakılmaz. */
export const CREWS = [
  { key: 'demirci', name: 'Hasan Usta', trade: 'Demirci', phone: phone(31) },
  { key: 'elektrik', name: 'Volkan Usta', trade: 'Elektrik', phone: phone(32) },
  { key: 'tesisat', name: 'Erdal Usta', trade: 'Tesisat', phone: phone(33) },
  { key: 'alcipan', name: 'Kadir Usta', trade: 'Alçıpan', phone: phone(34) },
]

export const SITES = [
  { key: 'kartal', name: 'Kartal Konutları B Blok', address: 'Yakacık Mah. Kartal / İstanbul' },
  { key: 'atasehir', name: 'Ataşehir Ofis Binası', address: 'Barbaros Mah. Ataşehir / İstanbul' },
  { key: 'beylikduzu', name: 'Beylikdüzü Villaları', address: 'Adnan Kahveci Mah. Beylikdüzü / İstanbul' },
  { key: 'cekmekoy', name: 'Çekmeköy Okulu', address: 'Mimar Sinan Mah. Çekmeköy / İstanbul' },
  { key: 'maltepe', name: 'Maltepe Rezidans', address: 'Cevizli Mah. Maltepe / İstanbul', completed: true },
]
