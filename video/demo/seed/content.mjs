// Reklamın demo firması: Atalay Yapı (Trabzon). Hiçbir kişi, telefon ya da e-posta gerçek değildir: alan adları
// ".test" (RFC 2606, hiçbir zaman gerçek olmaz), telefonlar 0500 000 … biçiminde yer tutucudur.
export const COMPANY = {
  name: 'Atalay Yapı',
  phone: '0462 000 00 00',
  email: 'info@atalayyapi.test',
  city: 'Trabzon',
}

export const OWNER = { fullName: 'Kemal Atalay', email: 'kemal@atalayyapi.test', password: 'demo-patron-2026' }

export const LEAD = {
  contactName: 'Kemal Atalay',
  phone: '0500 000 10 20',
  siteCount: 3,
  message: '3 aktif şantiyemiz var. Yoklama, malzeme ve imalat takibini tek yerde toplamak istiyoruz.',
}

export const SITES = {
  yomra: { name: 'Yomra Park Konutları', address: 'Kaşüstü Mah. Sahil Yolu, Yomra / Trabzon' },
  kasustu: { name: 'Kaşüstü Rezidans', address: 'Kaşüstü Mah. Akyazı Cad., Yomra / Trabzon' },
  sahil: { name: 'Sahil Evleri', address: 'Sahil Mah. Liman Yolu, Arsin / Trabzon' },
}

/** Uygulamayı kullanan ekip: katılım bağlantısıyla gelir, rolünü patron verir. */
export const MEMBERS = [
  { key: 'ayse', fullName: 'Ayşe Kara', phone: '0500 000 11 01', role: 'SITE_LEAD' },
  { key: 'mehmet', fullName: 'Mehmet Şahin', phone: '0500 000 11 02', role: 'WAREHOUSE' },
  { key: 'musa', fullName: 'Musa Aydın', phone: '0500 000 11 03', role: 'WORKER' },
  { key: 'burak', fullName: 'Burak Yıldız', phone: '0500 000 11 04', role: 'SITE_LEAD' },
]

/** Puantaj cetveli: kişiler ve taşeron ekipler. Uygulaması olmayanlar da cetvelde durur. */
export const ROSTER = [
  { kind: 'PERSON', name: 'Ali Yılmaz', trade: 'Kalıp ustası' },
  { kind: 'PERSON', name: 'Murat Demir', trade: 'Demir ustası' },
  { kind: 'PERSON', name: 'Emre Kaya', trade: 'Elektrik ustası' },
  { kind: 'PERSON', name: 'Hasan Koç', trade: 'Kalıpçı' },
  { kind: 'PERSON', name: 'İbrahim Arslan', trade: 'Demirci' },
  { kind: 'PERSON', name: 'Yusuf Polat', trade: 'Sıvacı' },
  { kind: 'PERSON', name: 'Serkan Güneş', trade: 'Vinç operatörü' },
  { kind: 'PERSON', name: 'Osman Kılıç', trade: 'Düz işçi' },
  { kind: 'PERSON', name: 'Kadir Öztürk', trade: 'Düz işçi' },
  { kind: 'PERSON', name: 'Cem Aksoy', trade: 'Tesisatçı' },
  { kind: 'CREW', name: 'Alçı Ekibi', trade: 'Alçı' },
  { kind: 'CREW', name: 'Kalıp Ekibi', trade: 'Kalıp' },
  { kind: 'CREW', name: 'Seramik Ekibi', trade: 'Seramik' },
  { kind: 'CREW', name: 'Elektrik Ekibi', trade: 'Elektrik' },
]

/** Çekimde canlı işaretlenecekler: seed bugünü onlar için boş bırakır. */
export const LIVE_ROLL_CALL = ['Ali Yılmaz', 'Murat Demir', 'Emre Kaya', 'Hasan Koç']

export const MATERIALS = [
  { key: 'panel', name: 'Kalıp paneli', unit: 'adet' },
  { key: 'cement', name: 'Çimento', unit: 'torba' },
  { key: 'rebar', name: 'İnşaat demiri Ø16', unit: 'ton' },
  { key: 'prop', name: 'Teleskopik dikme', unit: 'adet' },
  { key: 'plaster', name: 'Saten alçı', unit: 'torba' },
  { key: 'cable', name: 'NYM kablo 3x2,5', unit: 'metre' },
  { key: 'scaffold', name: 'İskele elemanı', unit: 'adet' },
]
