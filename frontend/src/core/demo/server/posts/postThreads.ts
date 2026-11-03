import type { PhotoName } from '@/core/demo/media/demoPhotos'
import type { PersonKey, SiteKey } from '@/core/demo/server/seed/seedContext'

/**
 * Bir örnek mesaj. at: [bugüne göre gün, saat]. field: Saha günlüğünde de görünür; issue: sorun bildirimi;
 * reply: aynı şantiyedeki kaçıncı mesaja yanıt; resolved: sorunu kim, kaç saat sonra, hangi notla çözdü.
 */
export interface ThreadMessage {
  site: SiteKey
  by: PersonKey
  at: [number, string]
  body?: string
  photos?: PhotoName[]
  field?: boolean
  issue?: boolean
  reply?: number
  pinned?: boolean
  edited?: boolean
  deleted?: boolean
  forwarded?: boolean
  resolved?: { by: PersonKey; at: [number, string]; note: string }
}

export const RULES =
  'Şantiye kuralları: baret, yelek ve iş ayakkabısı zorunlu. İskeleye emniyet kemersiz çıkılmaz. 18:00’den sonra şantiyede kimse kalmaz.'

/** Yomra Park: kaba inşaat sürüyor, en hareketli şantiye. */
export const YOMRA: ThreadMessage[] = [
  { site: 'yomra', by: 'kemal', at: [-20, '08:30'], body: RULES, pinned: true },
  { site: 'yomra', by: 'ayse', at: [-6, '08:05'], body: 'Günaydın. Bu hafta hedef: 2. kat kolonlarını kapatmak, 1. kat duvarlarını bitirmek.' },
  { site: 'yomra', by: 'musa', at: [-6, '09:30'], body: 'İskele kuzey cepheye kuruldu.', photos: ['yomraIskele'], field: true },
  { site: 'yomra', by: 'kemal', at: [-6, '14:20'], body: 'Elinize sağlık. Tuğla yeterli mi?' },
  { site: 'yomra', by: 'mehmet', at: [-6, '14:35'], body: 'Şantiyede 6 palet var, yarın 4 palet daha geliyor.', reply: 3 },
  { site: 'yomra', by: 'ayse', at: [-5, '08:20'], body: '1. kat duvar örümü bitti, iskele 2. kata taşındı.', photos: ['yomra'], field: true },
  { site: 'yomra', by: 'mehmet', at: [-5, '10:40'], body: '40 adet kalıp paneli şantiyeye çıktı.' },
  { site: 'yomra', by: 'kemal', at: [-5, '16:12'], body: 'Yarın demirciler kaçta başlıyor?' },
  { site: 'yomra', by: 'ayse', at: [-5, '16:20'], body: '08:00’de sahadalar.', reply: 7 },
  {
    site: 'yomra',
    by: 'ayse',
    at: [-4, '11:00'],
    body: 'Vinçte hidrolik kaçağı var, operatör vinci durdurdu.',
    field: true,
    issue: true,
    resolved: { by: 'kemal', at: [-4, '15:40'], note: 'Servis geldi, conta değişti. Vinç çalışıyor.' },
  },
  { site: 'yomra', by: 'serkan', at: [-4, '11:05'], body: 'Sabahtan beri yavaş çalışıyordu, akşama kadar kullanmayalım.', reply: 9 },
  { site: 'yomra', by: 'ayse', at: [-3, '08:40'], body: '2. kat kolon kalıpları tamam.', photos: ['kolonKaliplari'], field: true },
  { site: 'yomra', by: 'musa', at: [-3, '09:10'], body: 'Kalıp yağı bitmek üzere, depodan istiyoruz.' },
  { site: 'yomra', by: 'mehmet', at: [-3, '09:25'], body: 'Öğlen gönderiyorum.', reply: 12 },
  { site: 'yomra', by: 'ayse', at: [-2, '09:15'], body: 'B blok 3. katta alçı başladı.', photos: ['alci'], field: true },
  { site: 'yomra', by: 'musa', at: [-2, '11:30'], body: 'Kolon donatıları bağlandı, kontrole hazır.', photos: ['kolonDonati'], field: true },
  { site: 'yomra', by: 'burak', at: [-2, '15:45'], body: 'İskele güvenlik kontrolü yarın sabah yapılacak.' },
  { site: 'yomra', by: 'ayse', at: [-1, '08:30'], body: 'Kontrol tamam, iskele uygun bulundu.', reply: 16 },
  { site: 'yomra', by: 'ayse', at: [-1, '17:50'], body: 'Haftanın özeti 📸', photos: ['yomra', 'yomraIskele', 'kolonKaliplari', 'alciKoridor', 'kolonDonati'] },
  { site: 'yomra', by: 'ayse', at: [0, '07:52'], body: 'Günaydın. Bugün 2. kat kolonlarını kapatıyoruz, demirciler 3. kat döşemede.' },
  { site: 'yomra', by: 'ayse', at: [0, '09:40'], body: 'Beton pompasının geliş saati belli değil, döküm bekliyor.', field: true, issue: true },
  { site: 'yomra', by: 'kemal', at: [0, '10:12'], body: 'Pompa firmasını arıyorum.', reply: 20 },
  { site: 'yomra', by: 'mehmet', at: [0, '10:14'], body: 'Demir kamyona yüklendi, yarım saate şantiyede.' },
  { site: 'yomra', by: 'mehmet', at: [0, '11:05'], body: 'İnşaat demiri şantiyeye teslim edildi.', photos: ['demirTeslim'], field: true },
  { site: 'yomra', by: 'kemal', at: [0, '13:15'], body: 'Pompa 15:00’te şantiyede, haber verdiler.', edited: true },
  { site: 'yomra', by: 'ayse', at: [0, '13:21'], body: 'Tamamdır, ekibi hazırlıyorum 👍', reply: 24 },
]

/** Kaşüstü Rezidans: döşemeler dökülüyor, elektrik başlamış. */
export const KASUSTU: ThreadMessage[] = [
  { site: 'kasustu', by: 'kemal', at: [-19, '09:00'], body: RULES, forwarded: true, pinned: true },
  { site: 'kasustu', by: 'emre', at: [-5, '09:00'], body: 'Elektrik boruları 5. katta döşendi.', field: true },
  { site: 'kasustu', by: 'ayse', at: [-4, '10:30'], body: '7. kat döşeme kalıbı tamam.', photos: ['kasustu'], field: true },
  { site: 'kasustu', by: 'kemal', at: [-4, '10:45'], body: 'Beton ne zaman?' },
  { site: 'kasustu', by: 'ayse', at: [-4, '10:50'], body: 'Hava uygun giderse perşembe.', reply: 3 },
  {
    site: 'kasustu',
    by: 'emre',
    at: [-3, '08:15'],
    body: '5. kat elektrik panosu için yanlış ölçüde kasa gelmiş.',
    field: true,
    issue: true,
    resolved: { by: 'ayse', at: [-2, '14:10'], note: 'Doğru kasa geldi, takıldı.' },
  },
  { site: 'kasustu', by: 'ayse', at: [-2, '08:00'], body: '7. kat döşeme betonu döküldü, kür için sulanıyor.', photos: ['kasustuDoseme'], field: true },
  { site: 'kasustu', by: 'kemal', at: [-2, '08:05'], body: 'Elinize sağlık.', reply: 6 },
  { site: 'kasustu', by: 'emre', at: [-1, '16:30'], body: 'Yarın 6. kat elektrik tavaları.' },
  { site: 'kasustu', by: 'kemal', at: [-1, '17:40'], body: 'Beton firmasıyla görüştüm, cuma 3 mikser geliyor.' },
  { site: 'kasustu', by: 'ayse', at: [0, '08:45'], body: 'Bugün 8. kat kolon filizleri bağlanıyor.', field: true },
  { site: 'kasustu', by: 'emre', at: [0, '11:20'], body: '6. kat elektrik tavaları bitti.', field: true },
]

/** Sahil Evleri: ince işler, bugün henüz haber yok (patronun 18:00 özetine düşer). */
export const SAHIL: ThreadMessage[] = [
  { site: 'sahil', by: 'burak', at: [-6, '13:00'], body: 'Çatı yalıtımı tamam.', photos: ['sahilCati'], field: true },
  { site: 'sahil', by: 'serkan', at: [-5, '09:30'], body: 'Vinç perşembe günü Yomra’ya geçiyor.' },
  { site: 'sahil', by: 'burak', at: [-4, '14:30'], body: 'Çatı aktarımı bitti, iskele sökülüyor.', photos: ['sahil'], field: true },
  { site: 'sahil', by: 'burak', at: [-3, '10:00'], body: 'A blok seramikler bitti, B blokta başladık.', field: true },
  { site: 'sahil', by: 'burak', at: [-3, '10:05'], body: 'Yanlış gruba yazmışım.', deleted: true },
  { site: 'sahil', by: 'mehmet', at: [-2, '09:55'], body: '120 iskele elemanı depoya dönecek, kamyon yarın.' },
  { site: 'sahil', by: 'burak', at: [-1, '11:20'], body: 'İskele sökümü bitti, malzeme depoya gitti.', field: true },
  { site: 'sahil', by: 'kemal', at: [-1, '11:25'], body: 'Son kat boyası ne zaman biter?' },
  { site: 'sahil', by: 'burak', at: [-1, '11:40'], body: 'Pazartesi biter.', reply: 7 },
]

/** Akçaabat Villaları teslim edildi; listenin altındaki "Tamamlanan" bölümünde durur. */
export const AKCAABAT: ThreadMessage[] = [
  { site: 'akcaabat', by: 'kemal', at: [-31, '17:00'], body: 'Anahtar teslimi yapıldı. Emeği geçen herkese teşekkürler.' },
]
