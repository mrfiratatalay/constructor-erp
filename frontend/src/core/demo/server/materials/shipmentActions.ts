import type { CancelRequest, ShipmentDetail, ShipmentEditRequest } from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { allow, changeBy, ledgerFor, requireShipment } from './materialAccess'
import type { ShipmentRecord } from './materialRecords'
import { dayFrom, limited, tidy } from './materialTexts'
import { cancel, edit, nextNumber, returnOf } from './shipmentChanges'
import { detailOf } from './shipmentViews'

/** PATCH /api/shipments/:shipmentId: tarih ve açıklama düzeltilir. İzni, backend'deki gibi sevkiyat çıkarma iznidir. */
export function editShipment({ params, body }: DemoRequest): ShipmentDetail {
  const member = allow('CREATE_MATERIAL_MOVEMENT')
  const ledger = ledgerFor(member)
  const shipment = requireShipment(ledger, params.shipmentId)
  if (shipment.status === 'CANCELLED') throw new DemoError(409, 'İptal edilmiş hareket düzenlenemez.')
  const request = (body ?? {}) as Partial<ShipmentEditRequest>
  const details = { day: dayFrom(request.day), description: limited(tidy(request.description), 500, 'Açıklama') }
  edit(shipment, details, changeBy(member))
  return detailOf(shipment, ledger)
}

/** POST .../cancellation: iptal patron ile depo sorumlusundadır; nedeni zorunludur ve geçmişte kalır. */
export function cancelShipment({ params, body }: DemoRequest): ShipmentDetail {
  const member = allow('CANCEL_MATERIAL_MOVEMENT')
  const reason = limited(tidy((body as Partial<CancelRequest> | undefined)?.reason), 300, 'İptal nedeni')
  if (!reason) throw badRequest('İptal nedenini yaz.')
  const ledger = ledgerFor(member)
  const shipment = requireShipment(ledger, params.shipmentId)
  cancel(shipment, reason, changeBy(member))
  return detailOf(shipment, ledger)
}

function requireReturnable(out: ShipmentRecord): void {
  if (out.type !== 'OUTBOUND' || !out.expectsReturn) throw badRequest('Bu sevkiyatta geri gelecek malzeme yok.')
  if (out.status === 'CANCELLED') throw badRequest('İptal edilmiş sevkiyatın iadesi olmaz.')
  if (!out.sourceId) throw badRequest('Malzemenin döneceği depo belli değil.')
}

/**
 * POST .../return: dışarıdaki malzeme geri geldi. Form sorulmaz; malzeme, firma ve dönüş yeri çıkıştan gelir. İade
 * zaten yazıldıysa (iki kez basılan düğme) ikincisi açılmaz, var olan döner.
 */
export function receiveReturn({ params }: DemoRequest): ShipmentDetail {
  const member = allow('CREATE_MATERIAL_MOVEMENT')
  const ledger = ledgerFor(member)
  const out = requireShipment(ledger, params.shipmentId)
  requireReturnable(out)
  const existing = ledger.shipments.find((back) => back.returnOfId === out.id && back.status !== 'CANCELLED')
  if (existing) return detailOf(existing, ledger)
  const back = returnOf(out, { ...changeBy(member), id: newId(), number: nextNumber(ledger.shipments) })
  db().materials.shipments.push(back)
  return detailOf(back, ledgerFor(member))
}
