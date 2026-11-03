import type { HistoryEntryKind } from '@/core/api/generated/model'
import { dayOf } from '@/core/demo/server/demoClock'
import type { DocumentRecord, ShipmentLineRecord, ShipmentRecord } from './materialRecords'
import type { Route } from './shipmentRoute'

/**
 * Değişikliği kimin, ne zaman yaptığı. Bu dosyadaki fonksiyonlar db()'ye dokunmaz: çalışan demo da tohumlama da aynı
 * kuralla yazar, örnek verideki iptal ya da iade arayüzden yapılanla aynı izi bırakır.
 */
export interface Change {
  actorId: string
  at: string
}

export interface NewShipment {
  id: string
  companyId: string
  number: number
  route: Route
  partyId: string | null
  lines: ShipmentLineRecord[]
  day: string
  description: string | null
  expectsReturn: boolean
  returnOfId: string | null
  createdById: string
  createdAt: string
}

/** Yeni sevkiyat kayıtlı başlar ve öyle kalır: teslim alma adımı yoktur. Geçmişin ilk satırı onu kimin çıkardığıdır. */
export function newShipment({ route, ...input }: NewShipment): ShipmentRecord {
  return {
    ...input,
    type: route.type,
    status: 'RECORDED',
    sourceId: route.sourceId,
    destinationId: route.destinationId,
    history: [{ kind: 'CREATED', actorId: input.createdById, note: null, at: input.createdAt }],
    documents: [],
    fieldPosts: [],
  }
}

/** Numara firmaya göre sayılır ve hiç değişmez; sevkiyat silinmediği için en büyüğün bir fazlasıdır. */
export const nextNumber = (companyShipments: ShipmentRecord[]): number =>
  companyShipments.reduce((largest, shipment) => Math.max(largest, shipment.number), 0) + 1

function record(shipment: ShipmentRecord, kind: HistoryEntryKind, change: Change, note: string | null): void {
  shipment.history.push({ kind, actorId: change.actorId, note, at: change.at })
}

/** Kayıt silinmez, iptal edilir; nedeni geçmişte kalır. İptal edilmişi yeniden iptal etmek bir şey değiştirmez. */
export function cancel(shipment: ShipmentRecord, reason: string, change: Change): void {
  if (shipment.status === 'CANCELLED') return
  shipment.status = 'CANCELLED'
  record(shipment, 'CANCELLED', change, reason)
}

export interface Details {
  day: string
  description: string | null
}

/** Eski ve yeni değer nota yazılır: hareket yeniden düzeltilse bile ilk hali geçmişte okunur (ShipmentEditNotes). */
function editNote(shipment: ShipmentRecord, details: Details): string {
  const changes: string[] = []
  if (shipment.day !== details.day) changes.push(`Tarih: ${shipment.day} → ${details.day}`)
  if (shipment.description !== details.description) {
    changes.push(`Açıklama: ${shipment.description ?? '—'} → ${details.description ?? '—'}`)
  }
  return changes.join('\n')
}

/** Yalnızca tarih ve açıklama düzeltilir; miktar ve rota değişmez. Değişiklik yoksa geçmişe satır düşmez. */
export function edit(shipment: ShipmentRecord, details: Details, change: Change): void {
  if (shipment.day === details.day && shipment.description === details.description) return
  record(shipment, 'EDITED', change, editNote(shipment, details))
  shipment.day = details.day
  shipment.description = details.description
}

export function attach(shipment: ShipmentRecord, document: DocumentRecord): void {
  shipment.documents.push(document)
  record(shipment, 'DOCUMENT_ADDED', { actorId: document.createdById, at: document.createdAt }, document.fileName)
}

/**
 * Dışarıdaki malzemenin geri gelişi. Boş bir formdan girilseydi yanlış firmaya ya da malzemeye bağlanırdı; bu yüzden
 * iade çıkışın kendisinden başlar: kalemler birebir kopyalanır, malzeme çıktığı yere döner. İade düşünce çıkış artık
 * "dışarıda" sayılmaz.
 */
export function returnOf(out: ShipmentRecord, next: Change & { id: string; number: number }): ShipmentRecord {
  record(out, 'RETURN_ADDED', next, null)
  return newShipment({
    id: next.id,
    companyId: out.companyId,
    number: next.number,
    route: { type: 'RETURN', sourceId: null, destinationId: out.sourceId },
    partyId: out.partyId,
    lines: out.lines.map((line) => ({ ...line })),
    day: dayOf(next.at),
    description: null,
    expectsReturn: false,
    returnOfId: out.id,
    createdById: next.actorId,
    createdAt: next.at,
  })
}
