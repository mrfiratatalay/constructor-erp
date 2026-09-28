import type { MovementDetail } from '@/core/api/generated/model'
import { dateTime, dayWithYear } from '@/core/format/dates'
import { PURPOSE_LABELS } from '@/core/materials/materialLabels'
import { movementFrom, movementTo } from '@/core/materials/movementEnds'
import { formatQuantity, withUnit } from '@/core/materials/quantity'

export type FactKey =
  | 'material'
  | 'category'
  | 'route'
  | 'quantity'
  | 'day'
  | 'party'
  | 'purpose'
  | 'expected'
  | 'returnNote'
  | 'usage'
  | 'count'
  | 'reason'
  | 'description'
  | 'createdBy'

const countText = (detail: MovementDetail) =>
  detail.countedQuantity == null
    ? null
    : `Sistem ${formatQuantity(detail.systemQuantity ?? 0)} · Sayılan ${formatQuantity(detail.countedQuantity)}`

const dayOrNull = (day: string | null | undefined) => (day ? dayWithYear(day) : null)

/**
 * Hareketin bilgileri, yalnızca dolu olanlar (İlke 3: olumsuz bilgi yer kaplamaz). Kabuk göstermediklerini atar:
 * masaüstünde yol ve miktar ayrı kartta durur.
 */
export function movementFacts(detail: MovementDetail, skip: FactKey[] = []): [string, string][] {
  const row = detail.movement
  const facts: [FactKey, string, string | null | undefined][] = [
    [
      'material',
      'Malzeme',
      row.materialCode ? `${row.materialName} · ${row.materialCode}` : row.materialName,
    ],
    ['category', 'Kategori', row.category],
    ['route', 'Yol', `${movementFrom(row)} → ${movementTo(row)}`],
    ['quantity', 'Miktar', withUnit(row.quantity, row.unit)],
    ['day', 'Tarih', dayWithYear(row.day)],
    ['party', 'Firma / Kişi', row.partyName],
    ['purpose', 'Veriliş amacı', row.purpose ? PURPOSE_LABELS[row.purpose] : null],
    ['expected', 'Beklenen iade', dayOrNull(row.expectedReturnDate)],
    ['returnNote', 'Geri dönüş notu', detail.returnNote],
    ['usage', 'Kullanım alanı', row.usageArea],
    ['count', 'Sayım', countText(detail)],
    ['reason', 'Neden', detail.reason],
    ['description', 'Açıklama', row.description],
    ['createdBy', 'Kaydı giren', `${row.createdByName} · ${dateTime(row.createdAt)}`],
  ]
  return facts.flatMap(([key, label, value]) =>
    value && !skip.includes(key) ? [[label, value]] : [],
  )
}
