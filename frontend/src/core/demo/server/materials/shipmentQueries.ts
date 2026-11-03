import type { FieldShipmentRef, ShipmentDetail, ShipmentRow, StockLevel } from '@/core/api/generated/model'
import { badRequest } from '@/core/demo/server/demoError'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { shipmentNumber } from '@/core/shipments/quantity'
import { allow, ledgerFor, requireShipment } from './materialAccess'
import type { ShipmentRecord } from './materialRecords'
import { detailOf, fieldRefsOf, rowOf } from './shipmentViews'

const newestFirst = (a: ShipmentRecord, b: ShipmentRecord) => b.day.localeCompare(a.day) || b.number - a.number

/** Aramanın baktığı yazılar: açıklama, iki uç, çıkaran kişi, numara ("SV-000123" ya da "123") ve malzeme adları. */
function textsOf(shipment: ShipmentRecord, row: ShipmentRow): string[] {
  const ends = [row.fromName ?? '', row.toName ?? '']
  const materials = row.lines.map((line) => line.materialName)
  const numbers = [shipmentNumber(row.number), String(row.number)]
  return [shipment.description ?? '', ...ends, row.createdByName, ...numbers, ...materials]
}

/** GET /api/shipments: tek liste, en yeniden eskiye. Süzgeç yoktur, yalnızca arama. */
export function listShipments({ query }: DemoRequest): ShipmentRow[] {
  const ledger = ledgerFor(allow('VIEW_MATERIALS'))
  const search = (query.get('search') ?? '').trim().toLocaleLowerCase('tr')
  return [...ledger.shipments].sort(newestFirst).flatMap((shipment) => {
    const row = rowOf(shipment, ledger)
    const found = !search || textsOf(shipment, row).some((text) => text.toLocaleLowerCase('tr').includes(search))
    return found ? [row] : []
  })
}

export function getShipment({ params }: DemoRequest): ShipmentDetail {
  const ledger = ledgerFor(allow('VIEW_MATERIALS'))
  return detailOf(requireShipment(ledger, params.shipmentId), ledger)
}

/** GET /api/shipments/field-refs: şantiyenin Saha akışındaki malzeme kartları, sevkiyatların güncel durumuyla. */
export function listFieldRefs({ query }: DemoRequest): FieldShipmentRef[] {
  const ledger = ledgerFor(allow('VIEW_MATERIALS'))
  const siteId = query.get('siteId')
  if (!siteId) throw badRequest('Şantiye belirtilmeli.')
  return ledger.shipments.flatMap((shipment) => fieldRefsOf(shipment, siteId, ledger))
}

/** Sevkiyatın bu yerdeki etkisi: buraya geldiyse artı, buradan çıktıysa eksi. İptal edilen sayılmaz. */
function directionAt(shipment: ShipmentRecord, placeId: string): number {
  if (shipment.status === 'CANCELLED') return 0
  if (shipment.destinationId === placeId) return 1
  return shipment.sourceId === placeId ? -1 : 0
}

/**
 * GET /api/shipments/stock: bir yerdeki kalan, girenler eksi çıkanlar. Stok bir kolon değildir, her seferinde
 * sevkiyatlardan hesaplanır; böylece unutulan bir kayıt ortada yalan söyleyen bir tablo bırakmaz.
 */
export function listStock({ query }: DemoRequest): StockLevel[] {
  const ledger = ledgerFor(allow('VIEW_MATERIALS'))
  const placeId = query.get('placeId')
  if (!placeId) throw badRequest('Depo ya da şantiye belirtilmeli.')
  const totals = new Map<string, number>()
  for (const shipment of ledger.shipments) {
    const direction = directionAt(shipment, placeId)
    for (const line of direction ? shipment.lines : []) {
      totals.set(line.materialId, (totals.get(line.materialId) ?? 0) + direction * line.quantity)
    }
  }
  // Ondalıklı miktarlarda (4,2 ton) kayan nokta artığı sıfırı "0,0000001" diye göstermesin.
  return [...totals]
    .map(([materialId, total]) => ({ materialId, quantity: Math.round(total * 1000) / 1000 }))
    .filter((level) => level.quantity !== 0)
}
