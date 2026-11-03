import type { Figures } from './productionFigures'
import { itemName, type ProductionEntryRecord, type ProductionItemRecord } from './productionRecords'

// Backend'in yazdığı gibi Türkçe sayı: 3,5 · 12.000 · %48,8 (DecimalFormat "#,##0.###").
const NUMBER = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 3 })
const PERCENT = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 })

/** Boş bırakılan yazı saklanmaz. */
export const tidy = (text: string | null | undefined): string | null => text?.trim() || null

/**
 * Saha'ya yansıyan girişin yazısı; Saha'da başlık, sohbet listesinde önizleme olur:
 * "📐 İlerleme · Demir İşleri: +3,5 ton · 62 / 120 ton (%51,7)" ve varsa altında not.
 */
export function fieldBody(item: ProductionItemRecord, entry: ProductionEntryRecord, after: Figures): string {
  const { unit } = item
  const added = `+${NUMBER.format(entry.quantity)} ${unit}`
  const reached = `${NUMBER.format(after.done)} / ${NUMBER.format(after.total)} ${unit}`
  const line = `📐 İlerleme · ${itemName(item)}: ${added} · ${reached} (%${PERCENT.format(after.percent)})`
  return entry.note ? `${line}\n${entry.note}` : line
}
