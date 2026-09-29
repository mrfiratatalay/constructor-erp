import type { MovementRow } from '@/core/api/generated/model'

/**
 * Tablodaki "Nereden" ve "Nereye": lokasyon yoksa türün anlamı yazılır (backend'deki Excel ile aynı). Geldi'nin
 * kaynağı tedarikçidir, kullanımın hedefi kullanım alanıdır, dışarı verilenin hedefi firmadır.
 */
export function movementFrom(row: MovementRow): string {
  if (row.source) return row.source.name
  if (row.type === 'INBOUND' || row.type === 'RETURN') return row.partyName ?? 'Tedarikçi'
  return row.type === 'ADJUSTMENT' ? 'Sayım' : '—'
}

export function movementTo(row: MovementRow): string {
  if (row.destination) return row.destination.name
  if (row.type === 'USED') return row.usageArea ?? 'Kullanım'
  if (row.type === 'OUTBOUND') return row.partyName ?? '—'
  return row.type === 'ADJUSTMENT' ? 'Sayım farkı' : '—'
}
