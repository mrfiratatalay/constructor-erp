import type { PersonKey, SiteKey } from '@/core/demo/server/seed/seedContext'
import type { MaterialKey, PartyKey } from './seedCatalog'

/** Bugüne göre gün ve saat: [-3, '14:15'] üç gün önce 14.15 (İstanbul). */
export type Moment = [number, string]

/** Sevkiyatın bir ucu: ana depo, bir şantiye ya da dışarıdaki bir taraf. */
export type EndKey = 'depot' | SiteKey | PartyKey

export interface ShipmentSeed {
  key?: string
  at: Moment
  by: PersonKey
  from: EndKey
  to: EndKey
  lines: [MaterialKey, number][]
  note?: string
  expectsReturn?: boolean
  waybill?: string
  edited?: { at: Moment; by: PersonKey; note: string }
  cancelled?: { at: Moment; by: PersonKey; reason: string }
}

/** Dışarı verilenin geri gelişi: çıkışın kendisinden başlar, kalemleri ondan kopyalanır. */
export interface ReturnSeed {
  at: Moment
  by: PersonKey
  returnOf: string
}

/**
 * Son üç haftanın defteri, eskiden yeniye; numaralar bu sıradan gelir. Depo stoğu hiçbir an eksiye düşmez. Akçaabat
 * tamamlandı, oradan sökülen iskele ve kalıplar depoya döndü. Değirmendere'ye verilen dikmeler hâlâ dışarıda,
 * Sürmene'ye verilen iskele geri geldi. İki Yomra sevkiyatının irsaliyesi örnek PDF'in kendisidir (aynı yük).
 */
export const SHIPMENT_SEEDS: (ShipmentSeed | ReturnSeed)[] = [
  {
    at: [-20, '08:10'], by: 'mehmet', from: 'karadeniz', to: 'depot',
    lines: [['rebar16', 24], ['rebar12', 12], ['wire', 400]],
    note: 'Kantar fişi muhasebeye verildi.',
  },
  {
    at: [-19, '09:30'], by: 'mehmet', from: 'akcaabat', to: 'depot',
    lines: [['scaffold', 240], ['panel', 220], ['prop', 180]],
    note: "Akçaabat'ta söküm bitti; iskele ve kalıplar depoya döndü.",
  },
  {
    at: [-18, '10:15'], by: 'mehmet', from: 'akyazi', to: 'depot',
    lines: [['cement', 300], ['plaster', 150], ['cable', 1000], ['formOil', 12]],
  },
  {
    at: [-17, '08:40'], by: 'mehmet', from: 'depot', to: 'yomra',
    lines: [['rebar16', 4.2], ['panel', 40]],
    note: 'B blok 3. kat kolonları için.',
    waybill: 'irsaliye-yomra-park.pdf',
  },
  {
    at: [-16, '11:20'], by: 'mehmet', from: 'depot', to: 'degirmendere',
    lines: [['prop', 40], ['panel', 30]],
    expectsReturn: true,
    note: 'İş karşılığı verildi; döşeme betonu atılınca geri getirecekler. Teslim alan: Hakan Bey.',
  },
  {
    at: [-15, '14:30'], by: 'mehmet', from: 'depot', to: 'yomra',
    lines: [['prop', 100], ['panel', 80], ['wire', 80]],
    note: 'B blok 3. kat döşeme kalıbı.',
  },
  {
    at: [-14, '14:20'], by: 'mehmet', from: 'depot', to: 'sahil',
    lines: [['plaster', 80], ['cement', 40]],
    note: 'Daire içi sıva için.',
  },
  {
    key: 'surmeneLoan',
    at: [-13, '11:30'], by: 'mehmet', from: 'depot', to: 'surmene',
    lines: [['scaffold', 120]],
    expectsReturn: true,
    note: 'Cephe iskelesi için ödünç; iki hafta içinde dönecek.',
  },
  {
    at: [-12, '08:20'], by: 'burak', from: 'depot', to: 'kasustu',
    lines: [['rebar12', 8], ['rebar16', 5], ['wire', 120]],
    note: 'Zemin kat döşeme donatısı.',
  },
  {
    at: [-11, '15:45'], by: 'mehmet', from: 'trabzon', to: 'depot',
    lines: [['cement', 250]],
  },
  {
    at: [-10, '10:30'], by: 'ayse', from: 'depot', to: 'yomra',
    lines: [['cement', 150], ['formOil', 4]],
    edited: { at: [-10, '17:05'], by: 'mehmet', note: 'Teslim alan: Musa Aydın.' },
  },
  {
    at: [-9, '13:10'], by: 'mehmet', from: 'depot', to: 'sahil',
    lines: [['cable', 600], ['plaster', 40]],
    note: 'Daire içi elektrik tesisatı için.',
  },
  {
    at: [-8, '09:40'], by: 'mehmet', from: 'depot', to: 'kasustu',
    lines: [['cement', 100]],
    cancelled: {
      at: [-8, '09:52'], by: 'mehmet',
      reason: "Yanlış şantiye seçildi; çimento Yomra Park'a gitti, yeni kayıt açıldı.",
    },
  },
  {
    at: [-8, '09:55'], by: 'mehmet', from: 'depot', to: 'yomra',
    lines: [['cement', 100]],
    note: "Kaşüstü'ne yanlış girilen kaydın doğrusu.",
  },
  {
    at: [-6, '16:30'], by: 'ayse', from: 'yomra', to: 'kasustu',
    lines: [['prop', 60], ['panel', 50]],
    note: "Kaşüstü 1. kat döşemesi için; Yomra'da 3. kat kalıbı söküldü.",
  },
  { at: [-5, '11:00'], by: 'mehmet', returnOf: 'surmeneLoan' },
  {
    at: [-4, '08:50'], by: 'mehmet', from: 'akyazi', to: 'depot',
    lines: [['plaster', 200], ['cement', 150]],
  },
  {
    at: [-3, '14:15'], by: 'burak', from: 'depot', to: 'kasustu',
    lines: [['cement', 80], ['wire', 60]],
    note: 'Grobeton ve tamirat için.',
  },
  {
    at: [-2, '10:20'], by: 'mehmet', from: 'depot', to: 'arsin',
    lines: [['cement', 40]],
    note: 'Satıldı; bedeli havaleyle gelecek.',
  },
  {
    at: [-1, '09:00'], by: 'mehmet', from: 'depot', to: 'yomra',
    lines: [['rebar16', 4.2], ['panel', 40]],
    note: 'B blok 4. kat kolonları için.',
    waybill: 'irsaliye-yomra-park-4-kat.pdf',
  },
  {
    at: [0, '08:15'], by: 'mehmet', from: 'depot', to: 'sahil',
    lines: [['scaffold', 80], ['cable', 300]],
    note: 'Cephe mantolama iskelesi; kablo daire tesisatı için.',
  },
]
