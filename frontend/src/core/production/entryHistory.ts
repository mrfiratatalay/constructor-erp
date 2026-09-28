import type { ProductionEntryView } from '@/core/api/generated/model'
import { fullDate } from '@/core/format/dates'

/** Geçmişin bir günü: "28 Eylül 2026 · +3,5 ton" ve o günün girişleri (sabah +2, akşam +1,5). */
export interface HistoryDay {
  day: string
  title: string
  total: number
  entries: ProductionEntryView[]
}

/** Girişler gün gün, en yeni gün üstte (sunucu bu sırayla verir); günün toplamı üç haneye yuvarlanır. */
export function historyDays(entries: ProductionEntryView[]): HistoryDay[] {
  const days: HistoryDay[] = []
  for (const entry of entries) {
    const last = days.at(-1)
    if (last?.day === entry.day) last.entries.push(entry)
    else days.push({ day: entry.day, title: fullDate(entry.day), total: 0, entries: [entry] })
  }
  days.forEach((day) => {
    day.total =
      Math.round(day.entries.reduce((sum, entry) => sum + entry.quantity, 0) * 1000) / 1000
  })
  return days
}
