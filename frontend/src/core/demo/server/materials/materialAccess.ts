import type { WorkspaceViewPermissionsItem } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { notFound } from '@/core/demo/server/demoError'
import { requireFeature, type Member } from '@/core/demo/server/demoSession'
import { requirePermission } from '@/core/demo/server/people/permissions'
import { ledgerOf, type Ledger } from './materialLedger'
import type { ShipmentRecord } from './materialRecords'
import type { Change } from './shipmentChanges'

/** Önce modül firmanın paketinde mi (@RequiresFeature), sonra rolün izni var mı (@PreAuthorize): backend'deki sıra. */
export function allow(permission: WorkspaceViewPermissionsItem): Member {
  requireFeature('materials')
  return requirePermission(permission)
}

/** Firma kimliği istemciden değil oturumdan gelir; başka firmanın hiçbir kaydı bu defterde yoktur. */
export const ledgerFor = (member: Member): Ledger => ledgerOf(db().materials, db().sites, member.company.id)

/** Başka firmanın sevkiyatı da "bulunamadı"dır. */
export function requireShipment(ledger: Ledger, shipmentId: string | undefined): ShipmentRecord {
  const shipment = ledger.shipments.find((candidate) => candidate.id === shipmentId)
  if (!shipment) throw notFound('Sevkiyat')
  return shipment
}

export const changeBy = (member: Member): Change => ({ actorId: member.person.id, at: nowIso() })
