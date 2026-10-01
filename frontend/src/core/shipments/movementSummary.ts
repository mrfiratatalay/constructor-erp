import type { ShipmentRow } from '@/core/api/generated/model'
import { endpointKind } from '@/core/shipments/movementPresentation'

export interface MovementSummary {
  todayCount: number
  todayPoints: number
  monthCount: number
  waitingCount: number
  externalCount: number
  externalParties: number
}

export function movementSummary(rows: ShipmentRow[], today: string): MovementSummary {
  const active = rows.filter((row) => row.status !== 'CANCELLED')
  const todayRows = active.filter((row) => row.day === today)
  const external = active.filter((row) => endpointKind(row, 'from') === 'EXTERNAL' || endpointKind(row, 'to') === 'EXTERNAL')
  return {
    todayCount: todayRows.length,
    todayPoints: new Set(todayRows.flatMap(destinations)).size,
    monthCount: active.filter((row) => row.day.startsWith(today.slice(0, 7))).length,
    waitingCount: active.filter((row) => row.awaitingReturn).length,
    externalCount: external.length,
    externalParties: new Set(external.flatMap(parties)).size,
  }
}

function destinations(row: ShipmentRow): string[] {
  return row.toName ? [row.toName] : []
}

function parties(row: ShipmentRow): string[] {
  const name = endpointKind(row, 'from') === 'EXTERNAL' ? row.fromName : row.toName
  return name ? [name] : []
}
