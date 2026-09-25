import type { AttendanceCounts, SiteAttendanceMonth, SiteAttendanceOverview } from '@/core/api/generated/model'
import { presenceRate } from '@/core/attendance/attendanceDraft'
import { monthTitle, shortDay } from '@/core/format/dates'

/** "10 geldi · 2 gelmedi · 0 izinli": sayılar hep yazıyla (TASARIM.md İlke 2). */
export function countsLine(counts: AttendanceCounts): string {
  return `${counts.present} geldi · ${counts.absent} gelmedi · ${counts.excused} izinli`
}

/** Yoklama ekranının Geçmiş'inde bir gün: "3 geldi · 1 gelmedi"; izinli yalnızca varsa yazılır (İlke 3). */
export function dayCountsLine(counts: AttendanceCounts): string {
  const base = `${counts.present} geldi · ${counts.absent} gelmedi`
  return counts.excused ? `${base} · ${counts.excused} izinli` : base
}

/** Yoklama ana sayfasında şantiyenin satırı: bugünün durumu; alınmadıysa son yoklama günü; hiç yoksa hiçbir şey. */
export function todayLine(site: SiteAttendanceOverview): string {
  if (site.today) return `Bugün ${countsLine(site.today)}`
  return site.lastDay ? `Son yoklama: ${shortDay(site.lastDay)}` : ''
}

/** "Eylül 2026 · 25 yoklama günü · %92 geldi": ayrı rapor ekranı yerine tek satır; o ay yoklama yoksa boş. */
export function monthSummary(history: SiteAttendanceMonth | undefined): string {
  const rate = history ? presenceRate(history.totals) : null
  if (!history?.days.length || rate === null) return ''
  return `${monthTitle(history.month)} · ${history.days.length} yoklama günü · %${rate} geldi`
}
