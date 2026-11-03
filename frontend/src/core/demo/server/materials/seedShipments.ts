import { SAMPLE_WAYBILL } from '@/core/demo/media/demoDocuments'
import { at, dayOf, isPast } from '@/core/demo/server/demoClock'
import type { DemoDatabase } from '@/core/demo/server/demoDb'
import { newPostRecord } from '@/core/demo/server/posts/postStore'
import { fixedId, type PersonKey, type SeedContext } from '@/core/demo/server/seed/seedContext'
import { fieldNotes } from './fieldTexts'
import { ledgerOf, placeIn, type Ledger, type Place } from './materialLedger'
import type { DocumentRecord, ShipmentRecord } from './materialRecords'
import { depotId, ID, isPartyKey, materialId, partyId } from './seedCatalog'
import { SHIPMENT_SEEDS, type EndKey, type ReturnSeed, type ShipmentSeed } from './seedShipmentRows'
import { attach, cancel, edit, newShipment, returnOf } from './shipmentChanges'
import { routeOf } from './shipmentRoute'

interface SeedRun {
  draft: DemoDatabase
  context: SeedContext
  ledger: Ledger
  /** Geri gelecek diye verilenler, anahtarlarıyla: iade satırı çıkışını buradan bulur. */
  loans: Map<string, ShipmentRecord>
}

const personOf = (run: SeedRun, key: PersonKey) => run.context.people[key].id

/** Depo ve şantiye birer yerdir; dışarıdaki taraf yer değil, firmadır. */
function endFromKey(run: SeedRun, key: EndKey): { place: Place | null; partyId: string | null } {
  if (isPartyKey(key)) return { place: null, partyId: partyId(key) }
  const id = key === 'depot' ? depotId() : run.context.sites[key].id
  return { place: placeIn(run.ledger, id) ?? null, partyId: null }
}

/** Örnek irsaliye, kamyon yüklenirken bir dakika sonra eklenmiş gibi. */
function waybillOf(fileName: string, shipment: ShipmentRecord): DocumentRecord {
  return {
    id: fixedId(ID.document, shipment.number),
    fileName,
    contentType: SAMPLE_WAYBILL.contentType,
    sizeBytes: SAMPLE_WAYBILL.sizeBytes,
    url: SAMPLE_WAYBILL.url,
    createdById: shipment.createdById,
    createdAt: new Date(Date.parse(shipment.createdAt) + 60_000).toISOString(),
  }
}

/** Sonradan olanlar: irsaliye eklendi, açıklama düzeltildi, sevkiyat iptal edildi. */
function addFollowUps(run: SeedRun, row: ShipmentSeed, shipment: ShipmentRecord): void {
  if (row.waybill) attach(shipment, waybillOf(row.waybill, shipment))
  if (row.edited) {
    const change = { actorId: personOf(run, row.edited.by), at: at(...row.edited.at) }
    edit(shipment, { day: shipment.day, description: row.edited.note }, change)
  }
  if (row.cancelled) {
    const change = { actorId: personOf(run, row.cancelled.by), at: at(...row.cancelled.at) }
    cancel(shipment, row.cancelled.reason, change)
  }
}

/** Tohumlamada db() yoktur: Saha gönderisi doğrudan taslağa yazılır, bağlantısı sevkiyatta kalır. */
function addFieldPosts(run: SeedRun, shipment: ShipmentRecord): void {
  fieldNotes(shipment, run.ledger).forEach(({ siteId, body }, index) => {
    const id = fixedId(ID.fieldPost, shipment.number * 10 + index)
    const { createdById: authorId, createdAt, companyId } = shipment
    run.draft.posts.push(newPostRecord({ id, siteId, authorId, body, fieldUpdate: true, createdAt }, companyId))
    shipment.fieldPosts.push({ postId: id, siteId })
  })
}

function seedShipment(run: SeedRun, row: ShipmentSeed, number: number): ShipmentRecord {
  const createdAt = at(...row.at)
  const from = endFromKey(run, row.from)
  const to = endFromKey(run, row.to)
  const party = from.partyId ?? to.partyId
  const shipment = newShipment({
    id: fixedId(ID.shipment, number),
    companyId: run.ledger.companyId,
    number,
    route: routeOf({ source: from.place, destination: to.place }, party !== null, false),
    partyId: party,
    lines: row.lines.map(([key, quantity]) => ({ materialId: materialId(key), quantity })),
    day: dayOf(createdAt),
    description: row.note ?? null,
    expectsReturn: row.expectsReturn === true,
    returnOfId: null,
    createdById: personOf(run, row.by),
    createdAt,
  })
  if (row.key) run.loans.set(row.key, shipment)
  addFollowUps(run, row, shipment)
  addFieldPosts(run, shipment)
  return shipment
}

function seedReturn(run: SeedRun, row: ReturnSeed, number: number): ShipmentRecord {
  const out = run.loans.get(row.returnOf)
  if (!out) throw new Error(`Örnek iadenin çıkışı bulunamadı: ${row.returnOf}`)
  const next = { id: fixedId(ID.shipment, number), number, actorId: personOf(run, row.by), at: at(...row.at) }
  return returnOf(out, next)
}

/** Sevkiyatlar sırayla yazılır. Bugünün sabah sevkiyatı listenin sonundadır ve yalnızca saati geçtiyse vardır. */
export function seedShipments(draft: DemoDatabase, context: SeedContext): void {
  const ledger = ledgerOf(draft.materials, draft.sites, context.company.id)
  const run: SeedRun = { draft, context, ledger, loans: new Map() }
  SHIPMENT_SEEDS.filter((row) => isPast(at(...row.at))).forEach((row, index) => {
    const number = index + 1
    const shipment = 'returnOf' in row ? seedReturn(run, row, number) : seedShipment(run, row, number)
    draft.materials.shipments.push(shipment)
  })
}
