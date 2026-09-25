import type { SiteAttendanceEntries, SiteAttendanceSheet } from '@/core/api/generated/model'
import { absenceMark, buildDraft, CAME, type AttendanceMark, type DraftRow } from '@/core/attendance/attendanceDraft'
import { ABSENCE_CHOICES, ABSENCE_REASON, type AbsenceChoice } from '@/core/attendance/attendanceLabels'

/** Yoklama ekranındaki satır: kişi, işareti ve şantiyesi (birden çok şantiye varsa satırda küçük yazar). */
export interface RollRow extends DraftRow {
  siteId: string
  siteName: string
}

/** Kişiye dokununca açılan küçük seçim: Geldi ya da gelmeme nedenlerinden biri. Not yazdırılmaz. */
export type QuickChoice = 'PRESENT' | AbsenceChoice

export const QUICK_CHOICES: { value: QuickChoice; label: string }[] = [
  { value: 'PRESENT', label: 'Geldi' },
  ...ABSENCE_CHOICES,
]

const byName = (a: RollRow, b: RollRow) => a.worker.fullName.localeCompare(b.worker.fullName, 'tr')

/**
 * Bütün aktif şantiyelerin personeli tek listede, Türkçe alfabe sırasıyla; kullanıcı şantiye seçmez. Her şantiyenin
 * satırları kendi kaydından kurulur (buildDraft: bu ekranda dokunulan > kayıtlı > "Geldi").
 */
export function buildRoll(sheets: SiteAttendanceSheet[], touched: RollRow[]): RollRow[] {
  return sheets
    .flatMap((sheet) => {
      const current = touched.filter((row) => row.siteId === sheet.siteId)
      const rows = buildDraft({ workers: sheet.workers, recorded: sheet.day.entries, current, withRoster: true })
      return rows.map((row) => ({ ...row, siteId: sheet.siteId, siteName: sheet.siteName }))
    })
    .sort(byName)
}

/** Gelenler üstte; gelmeyenler (izinliler dahil) altta. */
export function splitRoll(rows: RollRow[]): { came: RollRow[]; away: RollRow[] } {
  return {
    came: rows.filter((row) => row.mark.status === 'PRESENT'),
    away: rows.filter((row) => row.mark.status !== 'PRESENT'),
  }
}

export function quickMark(choice: QuickChoice, note: string | null): AttendanceMark {
  return choice === 'PRESENT' ? { ...CAME, note } : absenceMark(choice, note)
}

/** Gelmeyenler bölümünde kişinin yanında yazan: "Hasta", "İzinli", "Habersiz", "Diğer". */
export function reasonLabel(mark: AttendanceMark): string {
  if (mark.status === 'EXCUSED') return 'İzinli'
  return mark.reason ? ABSENCE_REASON[mark.reason] : 'Gelmedi'
}

/** Kayıtta olmayan biri listede mi (sonradan eklenen personel)? O şantiyenin listesi eksik kalmıştır. */
const hasUnrecorded = (sheet: SiteAttendanceSheet) =>
  sheet.workers.some((worker) => !sheet.day.entries.some((entry) => entry.worker.id === worker.id))

/**
 * Kaydedilecek şantiyeler: yoklaması alınmamış, bu ekranda değiştirilmiş ya da listesi eksik kalmış olanlar.
 * Zaten alınmış, dokunulmamış şantiye yeniden yazılmaz (şefin aldığı yoklamanın "düzenleyen"i boşuna değişmesin).
 */
export function pendingSites(sheets: SiteAttendanceSheet[], rows: RollRow[], touched: RollRow[]): SiteAttendanceEntries[] {
  const changed = new Set(touched.map((row) => row.siteId))
  return sheets
    .filter((sheet) => !sheet.day.recordedAt || changed.has(sheet.siteId) || hasUnrecorded(sheet))
    .map((sheet) => ({
      siteId: sheet.siteId,
      entries: rows
        .filter((row) => row.siteId === sheet.siteId)
        .map(({ worker, mark }) => ({ workerId: worker.id, ...mark })),
    }))
    .filter((site) => site.entries.length > 0)
}
