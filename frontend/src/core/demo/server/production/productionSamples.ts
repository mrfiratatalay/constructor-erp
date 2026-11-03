import type { PhotoName } from '@/core/demo/media/demoPhotos'
import type { SiteKey } from '@/core/demo/server/seed/seedContext'

/** Bir günün öne çıkan ayrıntısı: not, fotoğraf, örnek irsaliye, o gün gelen kişi sayısı, Saha'ya yansıtma. */
export interface EntryMoment {
  note?: string
  photos?: PhotoName[]
  waybill?: boolean
  workers?: number
  onField?: boolean
}

/**
 * Bir iş kaleminin günlük girişleri. Girişler son girişin gününden (last: 0 bugün, -1 dün) geriye doğru, pazar
 * dışındaki günlere sırayla düşer: daily[0] en yeni gün. null, o gün giriş yok demektir (yağmur dışarıdaki işi
 * durdurur, içerideki işi durdurmaz). moments da aynı sırayla: 0 en yeni gün.
 */
export interface DailyLog {
  last: number
  todayAt?: string
  workers: number
  daily: (number | null)[]
  moments?: Record<number, EntryMoment>
}

/** Örnek iş kalemi; tarihler bugüne göre gün farkıdır (-20: yirmi gün önce). Taşeron yoklamadaki ekibin adıdır. */
export interface ItemSample {
  site: SiteKey
  trade: string
  title?: string
  crew?: string
  total: number
  unit: string
  start: number
  end: number
  note?: string
  log?: DailyLog
}

// Yomra Park ve Kaşüstü kaba inşaatta (demir, kalıp), Sahil Evleri ince işlerde (alçı, seramik, mantolama).
const YOMRA: ItemSample[] = [
  {
    site: 'yomra', trade: 'Demir İşleri', crew: 'Kaya Demir', total: 120, unit: 'ton', start: -20, end: 22,
    note: 'A ve B Blok kolon, perde ve döşeme demiri (temel hariç).',
    log: {
      last: 0, todayAt: '10:45', workers: 12,
      daily: [3.5, 4, 3, 4.2, 0, 3.5, 4.5, 3, 4, 3.5, 5, 3.5, 4, 3, 4.3, 5.5],
      moments: {
        0: { note: 'B Blok 4. kat kolon filizleri bağlandı.', photos: ['kolonDonati'] },
        3: {
          note: "Depodan gelen 16'lık demir döşendi, sevk irsaliyesi ekte.",
          photos: ['demirTeslim'],
          waybill: true,
        },
        4: { note: 'Yağmur nedeniyle çalışma yapılmadı.' },
        7: { note: 'A Blok 3. kat döşeme demiri bitti, kontrol mühendisi onayladı.', onField: true },
      },
    },
  },
  {
    site: 'yomra', trade: 'Kalıp İşleri', crew: 'Recep Usta', total: 4200, unit: 'm²', start: -20, end: 20,
    note: 'Kolon, perde ve döşeme kalıbı; iki blok.',
    log: {
      last: 0, todayAt: '11:30', workers: 9,
      daily: [180, 210, 165, 195, null, 220, 170, 185, 205, 160, 190, 175, 200, 185, 190],
      moments: {
        1: { note: 'B Blok 4. kat kolon kalıpları kuruldu.', photos: ['kolonKaliplari'], onField: true },
        6: { note: 'A Blok 3. kat döşeme kalıbı bitti, demirciye teslim edildi.' },
      },
    },
  },
  {
    site: 'yomra', trade: 'Beton', title: 'Radye Temel Betonu', total: 860, unit: 'm³', start: -33, end: -23,
    note: 'C30 hazır beton, pompayla döküm.',
    log: {
      last: -24, workers: 14,
      daily: [180, null, 240, null, 200, null, 240],
      moments: { 0: { note: 'Son bölüm döküldü, radye temel tamamlandı.' } },
    },
  },
  {
    site: 'yomra', trade: 'Duvar', title: 'Tuğla Duvar', total: 3600, unit: 'm²', start: -7, end: 45,
    log: {
      last: -1, workers: 6,
      daily: [85, 70, 95, null, 60],
      moments: { 0: { note: 'A Blok dış duvarlar ikinci kata çıktı.', photos: ['yomraIskele'] } },
    },
  },
  {
    site: 'yomra', trade: 'Elektrik', title: 'Elektrik Altyapı (Boru-Kutu)', crew: 'Volkan Elektrik', total: 72,
    unit: 'daire', start: -14, end: 40,
    log: {
      last: -1, workers: 4,
      daily: [3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3],
      moments: { 2: { note: 'A Blok 2. kat daireler bitti.' } },
    },
  },
]

const KASUSTU: ItemSample[] = [
  {
    site: 'kasustu', trade: 'Demir İşleri', title: 'A Blok Demir İşleri', crew: 'Kaya Demir', total: 85, unit: 'ton',
    start: -24, end: 6,
    log: {
      last: -1, workers: 10,
      daily: [4.5, 5, 3.5, null, 4.5, 5.5, 4, 3.5, 5, 4.5, 4, 5, 4.4, 4.5, 5.5, 4, 3.5, 4, 4],
      moments: {
        0: { note: 'Çatı katı döşeme demiri bağlanıyor, yarın biter.', photos: ['kasustuDoseme'], onField: true },
        6: { note: '6. kat döşeme demiri kontrol edildi, betona hazır.' },
      },
    },
  },
  {
    site: 'kasustu', trade: 'Kalıp İşleri', crew: 'Recep Usta', total: 2600, unit: 'm²', start: -24, end: -3,
    log: {
      last: 0, todayAt: '11:50', workers: 8,
      daily: [120, 140, 135, null, 150, 160, 145, 155, 130, 150, 165, 140, 150, 155, 145, 150],
      moments: {
        0: { note: 'Çatı katı kalıbı sürüyor; ekipte 2 kişi eksik.', workers: 6 },
        2: { note: 'Kalıp paneli geç geldi, yarım gün beklendi.' },
        8: { note: '5. kat kolon ve perde kalıpları kuruldu.', photos: ['kasustu'] },
      },
    },
  },
  {
    site: 'kasustu', trade: 'Elektrik', title: 'Elektrik Tesisatı', crew: 'Volkan Elektrik', total: 7, unit: 'kat',
    start: -7, end: 30,
    log: {
      last: -2, workers: 4,
      daily: [0.5, 0.5, 0.5, 0.5],
      moments: { 0: { note: '2. kat boru ve kutular tamam.' } },
    },
  },
  {
    site: 'kasustu', trade: 'Duvar', title: 'Gazbeton Duvar', total: 2400, unit: 'm²', start: 3, end: 40,
    note: 'Kaba inşaat bitince başlar; taşeron henüz seçilmedi.',
  },
]

const SAHIL: ItemSample[] = [
  {
    site: 'sahil', trade: 'Alçı', title: 'Alçı Sıva', crew: 'Hüseyin Usta', total: 5400, unit: 'm²', start: -24, end: 10,
    log: {
      last: 0, todayAt: '12:10', workers: 8,
      daily: [210, 225, 190, 240, 205, 230, 215, 180, 220, 235, 200, 210, 225, 195, 230, 210, 185, 220, 205, 215],
      moments: {
        0: { note: '3. kat koridor alçısı bitti.', photos: ['alciKoridor'] },
        4: { note: '2. kat daireler tamamlandı, boyacıya hazır.', photos: ['alci'], onField: true },
      },
    },
  },
  {
    site: 'sahil', trade: 'Seramik', title: 'Banyo Seramiği', crew: 'Nuri Usta', total: 640, unit: 'm²',
    start: -11, end: -2,
    log: {
      last: -1, workers: 5,
      daily: [35, 50, 45, 55, 40, 50, 45, 55, 50],
      moments: {
        0: { note: 'Banyo seramiğinin ikinci partisi bekleniyor; ekip yarın 3 kişi.' },
        5: { note: '1. kat banyolar bitti.' },
      },
    },
  },
  {
    site: 'sahil', trade: 'Çatı', title: 'Çatı Kaplama', total: 1150, unit: 'm²', start: -38, end: -25,
    note: 'OSB, su yalıtımı ve kiremit.',
    log: {
      last: -26, workers: 6,
      daily: [110, 120, 95, 130, 115, 125, 105, 120, 110, 120],
      moments: { 0: { note: 'Son kiremitler döşendi, çatı tamamlandı.', photos: ['sahilCati'], onField: true } },
    },
  },
  {
    site: 'sahil', trade: 'Mantolama', total: 3200, unit: 'm²', start: -25, end: 8, note: '5 cm taşyünü, dört cephe.',
    log: {
      last: -1, workers: 6,
      daily: [140, 155, 150, 160, 135, 145, 150, 165, 140, 155, 150, 160, 145, 150, 155, 140, 150, 160, 145, 150],
      moments: { 0: { note: 'Kuzey cephe bitti, güney cephede son iskele.', photos: ['sahil'] } },
    },
  },
  {
    site: 'sahil', trade: 'Elektrik', title: 'Elektrik Tesisatı', crew: 'Volkan Elektrik', total: 24, unit: 'daire',
    start: -20, end: 5,
    log: {
      last: -2, workers: 4,
      daily: [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2],
      moments: { 1: { note: 'Daire tablolarının montajı sürüyor.' } },
    },
  },
]

/** Süren üç şantiyenin iş kalemleri; tamamlanan şantiyede (Akçaabat) takip edilen iş yok. */
export const SAMPLE_ITEMS: ItemSample[] = [...YOMRA, ...KASUSTU, ...SAHIL]
