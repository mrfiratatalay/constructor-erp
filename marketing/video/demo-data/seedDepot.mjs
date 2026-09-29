import { randomUUID } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { MATERIALS, SHIPMENTS, TODAY_SHIPMENT } from './depot.mjs'
import { renderIrsaliyes } from './irsaliye.mjs'
import { SITES } from './world.mjs'

const DEPOT_NAME = 'Kızılkan Yapı · Ana Depo'
/** Çekimde depocunun telefondan yükleyeceği bugünün irsaliyesi burada durur. */
export const TODAY_IRSALIYE = fileURLToPath(new URL('.assets/irsaliye-bugun.jpg', import.meta.url))

/**
 * Deponun geçmişi, depocunun hesabından (her kaydın altında "Mehmet Yılmaz" yazsın): önce malzeme kartları, sonra en
 * eskisinden başlayarak sevkiyatlar, her birine irsaliye fotoğrafı; yanlış şantiyeye çıkan biri nedeniyle iptal edilir.
 */
export async function seedDepot(depot, today, siteIds) {
  const materials = await createMaterials(depot)
  const places = await placesOf(depot, siteIds)
  const plan = [...SHIPMENTS].sort((a, b) => b.day - a.day)
  const images = await renderIrsaliyes([...plan, { ...TODAY_SHIPMENT, day: 0 }].map((item, index) =>
    documentOf(item, index, today, materials)))
  for (const [index, shipment] of plan.entries()) {
    const request = requestOf(shipment, today, materials, places)
    await depot.post('/shipments', request)
    const file = { name: `irsaliye-${index + 1}.jpg`, type: 'image/jpeg', data: images[index] }
    await depot.upload(`/shipments/${request.id}/documents`, 'files', [file])
    if (shipment.cancel) await depot.post(`/shipments/${request.id}/cancellation`, { reason: shipment.cancel })
  }
  mkdirSync(new URL('.assets/', import.meta.url), { recursive: true })
  writeFileSync(TODAY_IRSALIYE, images[images.length - 1])
  return plan.length
}

async function createMaterials(session) {
  const materials = {}
  for (const material of MATERIALS) {
    const created = await session.post('/materials', { name: material.name, unit: material.unit, active: true })
    materials[material.key] = { ...material, id: created.id }
  }
  return materials
}

/** Depo ve şantiyelerin stok yerleri: şantiyeler kurulunca kendiliğinden gelir. */
async function placesOf(session, siteIds) {
  const locations = await session.get('/stock-locations')
  const bySite = Object.fromEntries(Object.entries(siteIds).map(([key, id]) => [key, locations.find((l) => l.siteId === id)]))
  return { depot: locations.find((location) => location.kind === 'DEPOT'), sites: bySite }
}

function requestOf(shipment, today, materials, places) {
  const inbound = shipment.to === 'INBOUND'
  const outside = shipment.to === 'OUTSIDE'
  return {
    id: randomUUID(),
    sourceId: inbound ? null : places.depot.id,
    destinationId: inbound ? places.depot.id : outside ? null : places.sites[shipment.to].id,
    partyName: shipment.party ?? null,
    expectsReturn: Boolean(shipment.expectsReturn),
    day: daysBefore(today, shipment.day),
    description: shipment.description ?? null,
    lines: shipment.lines.map((line) => ({ materialId: materials[line.material].id, quantity: line.quantity })),
  }
}

function documentOf(shipment, index, today, materials) {
  const site = SITES.find((candidate) => candidate.key === shipment.to)
  const destination = site ? `${site.name}, ${site.address}` : shipment.to === 'INBOUND' ? DEPOT_NAME : shipment.party
  return {
    number: `KY-${today.slice(0, 4)}-${String(412 + index).padStart(4, '0')}`,
    day: daysBefore(today, shipment.day),
    from: shipment.to === 'INBOUND' ? shipment.party : DEPOT_NAME,
    to: destination,
    lines: shipment.lines.map((line) => ({ ...materials[line.material], quantity: line.quantity })),
  }
}

export function daysBefore(today, days) {
  const date = new Date(`${today}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}
