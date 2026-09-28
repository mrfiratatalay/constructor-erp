import type { DayMarkView, PuantajView, RosterEntryView } from '@/core/api/generated/model'
import type { DayStatus, MarkLike } from '@/core/puantaj/puantajLabels'

/** Bir kalem ve istenen günlerdeki işaretleri (güne göre). İşaretsiz gün kayıtta yoktur: "İşaretlenmedi". */
export interface PuantajRow {
  entry: RosterEntryView
  marks: Record<string, DayMarkView>
}

/** Ekranın iki bölümü: kişi kişi takip edilen personel ve ekip olarak takip edilen taşeronlar. */
export interface PuantajBook {
  people: PuantajRow[]
  crews: PuantajRow[]
}

/** Sunucu kalemleri zaten sıralı verir (önce kişiler, ada göre); sıra korunur. */
export function bookOf(view: PuantajView | undefined): PuantajBook {
  const byEntry = new Map<string, Record<string, DayMarkView>>()
  for (const mark of view?.marks ?? []) {
    byEntry.set(mark.entryId, { ...byEntry.get(mark.entryId), [mark.day]: mark })
  }
  const rows = (view?.entries ?? []).map((entry) => ({ entry, marks: byEntry.get(entry.id) ?? {} }))
  return {
    people: rows.filter((row) => row.entry.kind === 'PERSON'),
    crews: rows.filter((row) => row.entry.kind === 'CREW'),
  }
}

export type DayCounts = Record<DayStatus, number> & { unmarked: number }

/** Bir günün sayımı. Listeden çıkmış kalem işaretlenmediyse "işaretlenmedi" sayılmaz: onu kimse işaretlemez. */
export function dayCounts(rows: PuantajRow[], day: string): DayCounts {
  const counts: DayCounts = { PRESENT: 0, HALF_DAY: 0, ABSENT: 0, LEAVE: 0, unmarked: 0 }
  for (const row of rows) {
    const mark = row.marks[day]
    if (mark) counts[mark.status] += 1
    else if (!row.entry.archived) counts.unmarked += 1
  }
  return counts
}

/** Ayın toplamları. Çalıştığı gün: geldiği günler artı yarım günlerin yarısı (yevmiye buna göre). */
export interface RowTotals {
  worked: number
  half: number
  absent: number
  leave: number
  overtime: number
}

export const rowTotals = (row: PuantajRow): RowTotals => totalsOf(Object.values(row.marks))

/** Bir ayın günlerinden toplamlar: puantajın satırı da, çalışanın kendi ayı da. */
export function totalsOf(marks: MarkLike[]): RowTotals {
  const count = (status: DayStatus) => marks.filter((mark) => mark.status === status).length
  const half = count('HALF_DAY')
  return {
    worked: count('PRESENT') + half / 2,
    half,
    absent: count('ABSENT'),
    leave: count('LEAVE'),
    overtime: marks.reduce((sum, mark) => sum + (mark.overtimeHours ?? 0), 0),
  }
}

/** Arama: adda, görevde ya da ekip başında geçen (Türkçe büyük-küçük harf). */
export function matchesQuery(entry: RosterEntryView, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase('tr-TR')
  if (!needle) return true
  return [entry.name, entry.trade ?? ''].some((text) => text.toLocaleLowerCase('tr-TR').includes(needle))
}
