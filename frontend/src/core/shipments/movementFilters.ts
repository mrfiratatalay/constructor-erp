import type { ShipmentRow, ShipmentRowType } from '@/core/api/generated/model'
import { endpointKind } from '@/core/shipments/movementPresentation'

export type MovementScope = 'all' | 'sites' | 'external' | 'returns'
export interface MovementFilter {
  scope: MovementScope
  dates: [string, string] | null
  type: ShipmentRowType | ''
  point: string
}

export const EMPTY_MOVEMENT_FILTER: MovementFilter = { scope: 'all', dates: null, type: '', point: '' }
export const MOVEMENT_TABS: { label: string; value: MovementScope }[] = [
  { label: 'Tüm Hareketler', value: 'all' },
  { label: 'Şantiyeler', value: 'sites' },
  { label: 'Harici Firmalar', value: 'external' },
  { label: 'Geri Beklenenler', value: 'returns' },
]

export function matchesScope(row: ShipmentRow, scope: MovementScope): boolean {
  if (scope === 'returns') return row.awaitingReturn
  if (scope === 'all') return true
  if (scope === 'sites' && !row.fromKind && !row.toKind && ['TO_SITE', 'TRANSFER'].includes(row.type)) return true
  const kind = scope === 'sites' ? 'SITE' : 'EXTERNAL'
  return endpointKind(row, 'from') === kind || endpointKind(row, 'to') === kind
}

export function matchesMovement(row: ShipmentRow, filter: MovementFilter): boolean {
  if (!matchesScope(row, filter.scope)) return false
  if (filter.type && row.type !== filter.type) return false
  if (filter.point && row.fromName !== filter.point && row.toName !== filter.point) return false
  return !filter.dates || (row.day >= filter.dates[0] && row.day <= filter.dates[1])
}

export function movementPoints(rows: ShipmentRow[]): string[] {
  return [...new Set(rows.flatMap((row) => [row.fromName, row.toName]).filter((name): name is string => !!name))]
    .sort((a, b) => a.localeCompare(b, 'tr'))
}
