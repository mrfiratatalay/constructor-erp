// Malzeme: katalog (patron), sevkiyat geçmişi (depo sorumlusu Mehmet). Filmde Mehmet yeni bir sevkiyat açar.
import { randomUUID } from 'node:crypto'
import { api } from '../lib/stack.mjs'

const CATALOG = [
  ['Kalıp paneli', 'adet'], ['Çimento', 'torba'], ['İnşaat demiri', 'ton'], ['İskele borusu', 'adet'], ['Kum', 'm³'],
  ['Tuğla', 'adet'],
]

export const seedCatalog = async (owner) => {
  for (const [name, unit] of CATALOG) await api(owner, 'POST', '/api/materials', { name, unit, active: true })
  const materials = await api(owner, 'GET', '/api/materials')
  const places = await api(owner, 'GET', '/api/stock-locations')
  return {
    material: Object.fromEntries(materials.map((item) => [item.name, item.id])),
    place: Object.fromEntries(places.map((item) => [item.name, item.id])),
  }
}

const ship = (depot, move) =>
  api(depot, 'POST', '/api/shipments', {
    id: randomUUID(), sourceId: move.from ?? null, destinationId: move.to ?? null, partyId: null,
    partyName: move.party ?? null, returnOfId: move.returnOf ?? null, expectsReturn: Boolean(move.expectsReturn),
    day: move.day, description: move.note ?? null, lines: move.lines,
  })

/** Son iki haftanın hareketleri: gelen, giden, iade, geri beklenen. */
export const seedShipments = async (depot, { material, place }) => {
  const line = (name, quantity) => [{ materialId: material[name], quantity }]
  const panels = await ship(depot, { from: place['Ana Depo'], to: place['Yomra Park Konutları'], lines: line('Kalıp paneli', 32),
    expectsReturn: true, day: '2026-09-24', note: '2. kat kolon kalıpları için' })
  const moves = [
    { party: 'Trabzon Kum Ocağı', to: place['Kaşüstü Rezidans'], lines: line('Kum', 12), day: '2026-09-25' },
    { from: place['Ana Depo'], to: place['Kaşüstü Rezidans'], lines: line('İskele borusu', 40), expectsReturn: true, day: '2026-09-26' },
    { from: place['Ana Depo'], to: place['Sahil Evleri'], lines: line('Çimento', 60), day: '2026-09-27' },
    { party: 'Doğu Çimento A.Ş.', to: place['Ana Depo'], lines: line('Çimento', 120), day: '2026-09-29' },
    { from: place['Yomra Park Konutları'], to: place['Ana Depo'], lines: line('Kalıp paneli', 8), returnOf: panels.id, day: '2026-09-30' },
    { party: 'Karadeniz Demir', to: place['Yomra Park Konutları'], lines: line('İnşaat demiri', 6), day: '2026-10-02' },
    // "Geri gelecek mi?" yalnızca dışarı verilende sorulur (Shipments.expectsReturn): başka firmaya ödünç malzeme.
    { from: place['Ana Depo'], party: 'Sürmene İnşaat', lines: line('Kalıp paneli', 30), expectsReturn: true, day: '2026-09-28',
      note: 'Bir haftalığına ödünç' },
    { from: place['Ana Depo'], party: 'Akçaabat Yapı', lines: line('İskele borusu', 20), expectsReturn: true, day: '2026-09-22' },
  ]
  for (const move of moves) await ship(depot, move)
}
