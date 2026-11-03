import type {
  DocumentView,
  FieldShipmentRef,
  HistoryEntry,
  ShipmentDetail,
  ShipmentLineView,
  ShipmentRow,
} from '@/core/api/generated/model'
import { daysBetween, today } from '@/core/demo/server/demoClock'
import { personName } from '@/core/demo/server/demoSession'
import { fieldSummary } from './fieldTexts'
import { endOf, materialIn, type Ledger } from './materialLedger'
import type { DocumentRecord, ShipmentRecord } from './materialRecords'

/** Hâlâ dışarıda: geri gelecek diye verilmiş, iptal edilmemiş ve iadesi (iptal edilmemiş haliyle) yazılmamış. */
function awaitingReturn(shipment: ShipmentRecord, ledger: Ledger): boolean {
  if (!shipment.expectsReturn || shipment.status === 'CANCELLED') return false
  return !ledger.shipments.some((back) => back.returnOfId === shipment.id && back.status !== 'CANCELLED')
}

function linesOf(shipment: ShipmentRecord, ledger: Ledger): ShipmentLineView[] {
  return shipment.lines.flatMap((line) => {
    const material = materialIn(ledger, line.materialId)
    if (!material) return []
    return [{ materialId: material.id, materialName: material.name, quantity: line.quantity, unit: material.unit }]
  })
}

/** Listenin satırı. daysOut yalnızca hâlâ dışarıda olanda dolar: "40 gündür dönmedi". */
export function rowOf(shipment: ShipmentRecord, ledger: Ledger): ShipmentRow {
  const from = endOf(ledger, shipment, 'from')
  const to = endOf(ledger, shipment, 'to')
  const waiting = awaitingReturn(shipment, ledger)
  return {
    id: shipment.id,
    number: shipment.number,
    type: shipment.type,
    status: shipment.status,
    fromName: from.name,
    toName: to.name,
    fromKind: from.kind,
    toKind: to.kind,
    day: shipment.day,
    createdAt: shipment.createdAt,
    createdByName: personName(shipment.createdById),
    expectsReturn: shipment.expectsReturn,
    awaitingReturn: waiting,
    daysOut: waiting ? daysBetween(shipment.day, today()) : null,
    lines: linesOf(shipment, ledger),
  }
}

export const documentView = (document: DocumentRecord): DocumentView => {
  const { id, fileName, contentType, sizeBytes, url, createdAt } = document
  return { id, fileName, contentType, sizeBytes, url, createdAt }
}

function historyOf(shipment: ShipmentRecord): HistoryEntry[] {
  return [...shipment.history]
    .sort((a, b) => a.at.localeCompare(b.at))
    .map((event) => ({
      shipmentId: shipment.id,
      kind: event.kind,
      actorName: personName(event.actorId),
      note: event.note,
      at: event.at,
    }))
}

/** Ayrıntı: satırın kendisi, açıklaması, irsaliyeleri ve değişmez geçmişi bir arada. */
export function detailOf(shipment: ShipmentRecord, ledger: Ledger): ShipmentDetail {
  return {
    row: rowOf(shipment, ledger),
    description: shipment.description,
    createdByName: personName(shipment.createdById),
    documents: [...shipment.documents].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(documentView),
    history: historyOf(shipment),
  }
}

/** Saha kartı: gönderi yalnızca referanstır, durum (ör. İptal) her okumada sevkiyatın güncel halinden gelir. */
export function fieldRefsOf(shipment: ShipmentRecord, siteId: string, ledger: Ledger): FieldShipmentRef[] {
  const links = shipment.fieldPosts.filter((link) => link.siteId === siteId)
  if (!links.length) return []
  const summary = fieldSummary(shipment, ledger)
  return links.map(({ postId }) => ({
    postId,
    shipmentId: shipment.id,
    number: shipment.number,
    type: shipment.type,
    status: shipment.status,
    summary,
  }))
}
