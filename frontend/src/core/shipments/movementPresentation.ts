import type { ShipmentRow, ShipmentRowType } from '@/core/api/generated/model'

export type MovementKind = 'SITE' | 'OUTSIDE' | 'RETURN' | 'INBOUND'
export type MovementTone = 'success' | 'warning' | 'info' | 'danger'

const MOVEMENT_LABELS: Record<ShipmentRowType, string> = {
  TO_SITE: 'Şantiyeye sevkiyat',
  OUTBOUND: 'Harici çıkış',
  INBOUND: 'Depoya giriş',
  RETURN: 'İade / geri dönüş',
  TRANSFER: 'Noktalar arası transfer',
}

export const movementTypeLabel = (type: ShipmentRowType) => MOVEMENT_LABELS[type]

/** Kayıt teslim onayı içermez; normal hareketi teslim edilmiş gibi göstermeyiz. */
export function movementStatus(row: ShipmentRow): { label: string; tone: MovementTone } {
  if (row.status === 'CANCELLED') return { label: 'İptal edildi', tone: 'danger' }
  if (row.awaitingReturn) return { label: 'Geri bekleniyor', tone: 'warning' }
  if (row.type === 'RETURN') return { label: 'Geri döndü', tone: 'info' }
  if (row.expectsReturn) return { label: 'Geri alındı', tone: 'info' }
  return { label: 'Kaydedildi', tone: 'success' }
}

export function endpointKind(row: ShipmentRow, end: 'from' | 'to'): string {
  const actual = end === 'from' ? row.fromKind : row.toKind
  if (actual) return actual
  if (end === 'from' && ['INBOUND', 'RETURN'].includes(row.type)) return 'EXTERNAL'
  if (end === 'to' && row.type === 'OUTBOUND') return 'EXTERNAL'
  if (end === 'to' && row.type === 'TO_SITE') return 'SITE'
  return 'DEPOT'
}
