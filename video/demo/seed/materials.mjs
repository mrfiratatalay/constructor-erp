// Malzeme hareketleri, ürünün gerçek kurallarıyla: depoya giriş tedarikçiden, şantiyeye sevkiyat ana depodan;
// "Geri bekleniyor" yalnızca harici firmaya (ör. kalıbı ödünç alan taşeron) geri dönecek gönderimdir.
// Bugünün "Ana depo → Yomra Park, 24 adet kalıp paneli" sevkiyatı çekimde arayüzden canlı girilir.
import { randomUUID } from 'node:crypto'
import { dayOffset } from './clock.mjs'
import { MATERIALS } from './content.mjs'

export const SUPPLIER = 'Karadeniz Yapı Market'
export const SUBCONTRACTOR = 'Yıldız Kalıp (taşeron)'

async function locationsOf(owner, sites) {
  const locations = await owner.get('/api/stock-locations')
  const depot = locations.find((location) => location.kind === 'DEPOT') ?? await owner.post('/api/stock-locations', { name: 'Ana depo' })
  const siteLocation = (siteId) => locations.find((location) => location.siteId === siteId).id
  return { depot, points: Object.fromEntries(Object.entries(sites).map(([key, id]) => [key, siteLocation(id)])) }
}

async function seedCatalog(owner) {
  const existing = await owner.get('/api/materials')
  const ids = {}
  for (const material of MATERIALS) {
    const found = existing.find((candidate) => candidate.name === material.name)
    ids[material.key] = (found ?? await owner.post('/api/materials', { ...material, active: true })).id
  }
  return ids
}

/** Hareket planı: gün (bugüne göre), tür, satırlar. Sıra = SV numarası sırası. */
function plan(depot, sites) {
  return [
    { day: -20, inbound: true, lines: [['panel', 160], ['prop', 120]], description: 'Sezon başı kalıp alımı' },
    { day: -17, to: sites.yomra, lines: [['panel', 40], ['prop', 30]] },
    { day: -15, inbound: true, lines: [['cable', 600], ['plaster', 200]] },
    { day: -13, to: sites.kasustu, lines: [['prop', 60]] },
    { day: -11, outside: true, returning: true, lines: [['panel', 8]], description: 'Kalıp desteği' },
    { day: -10, to: sites.sahil, lines: [['scaffold', 120]] },
    { day: -9, outside: true, returning: false, lines: [['panel', 30], ['prop', 20]], description: 'Kaşüstü taşeron işi için ödünç' },
    { day: -6, to: sites.yomra, lines: [['plaster', 80]] },
    { day: -3, to: sites.yomra, lines: [['cable', 250]] },
    { day: -1, inbound: true, lines: [['cement', 120]], description: 'İrsaliye no 4471' },
    { day: 0, to: sites.yomra, lines: [['rebar', 4.5]], description: 'İnşaat demiri, şantiyeye teslim' },
  ].map((move) => ({ ...move, depot }))
}

function requestOf(move, materialIds) {
  return {
    id: randomUUID(),
    sourceId: move.inbound ? null : move.depot.id,
    destinationId: move.inbound ? move.depot.id : move.outside ? null : move.to,
    partyName: move.inbound ? SUPPLIER : move.outside ? SUBCONTRACTOR : null,
    returnOfId: null,
    expectsReturn: Boolean(move.outside),
    day: dayOffset(move.day),
    description: move.description ?? null,
    lines: move.lines.map(([key, quantity]) => ({ materialId: materialIds[key], quantity })),
  }
}

export async function seedMaterials(warehouse, sites) {
  const { depot, points } = await locationsOf(warehouse, sites)
  const materialIds = await seedCatalog(warehouse)
  const created = []
  for (const move of plan(depot, points)) {
    const detail = await warehouse.post('/api/shipments', requestOf(move, materialIds))
    created.push(detail.row)
    if (move.returning) await warehouse.post(`/api/shipments/${detail.row.id}/return`)
  }
  return { depot, materialIds, created }
}
