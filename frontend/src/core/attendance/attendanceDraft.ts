import type {
  AttendanceCounts,
  AttendanceEntryView,
  SaveAttendanceRequest,
  WorkerView,
} from '@/core/api/generated/model'
import type { AbsenceChoice, AbsenceReason, AttendanceStatus } from '@/core/attendance/attendanceLabels'

/** Bir kişinin o günkü işareti. */
export interface AttendanceMark {
  status: AttendanceStatus
  reason: AbsenceReason | null
  note: string | null
}

export interface DraftRow {
  worker: WorkerView
  mark: AttendanceMark
}

export const CAME: AttendanceMark = { status: 'PRESENT', reason: null, note: null }

const byName = (a: DraftRow, b: DraftRow) => a.worker.fullName.localeCompare(b.worker.fullName, 'tr')

const markOf = (entry: AttendanceEntryView): AttendanceMark => ({
  status: entry.status,
  reason: entry.reason ?? null,
  note: entry.note ?? null,
})

export interface DraftInput {
  workers: WorkerView[]
  recorded: AttendanceEntryView[]
  /** Bu pencerede şimdiye kadar yapılan işaretler: veri yenilense de kaybolmaz. */
  current: DraftRow[]
  /** Şu anki personelin tamamı gelsin mi: bugün evet; geçmiş gün düzenlenirken o günün listesi neyse o. */
  withRoster: boolean
}

/**
 * Yoklama penceresinin listesi, Türkçe alfabe sırasıyla. Herkes varsayılan "Geldi"dir (şef yalnızca gelmeyene
 * dokunur). Öncelik: bu pencerede yapılan işaret > o gün kaydedilmiş işaret > "Geldi".
 */
export function buildDraft({ workers, recorded, current, withRoster }: DraftInput): DraftRow[] {
  const marks = new Map(recorded.map((entry) => [entry.worker.id, markOf(entry)]))
  current.forEach((row) => marks.set(row.worker.id, row.mark))
  const people = new Map(recorded.map((entry) => [entry.worker.id, entry.worker]))
  if (withRoster || !recorded.length) workers.forEach((worker) => people.set(worker.id, worker))
  current.forEach((row) => people.set(row.worker.id, row.worker))
  return [...people.values()].map((worker) => ({ worker, mark: marks.get(worker.id) ?? CAME })).sort(byName)
}

/** "Gelmedi"nin altındaki seçimden işarete: İzinli ayrı bir durumdur, ötekiler "Gelmedi" + neden. */
export function absenceMark(choice: AbsenceChoice, note: string | null): AttendanceMark {
  const cleaned = note?.trim() || null
  if (choice === 'EXCUSED') return { status: 'EXCUSED', reason: null, note: cleaned }
  return { status: 'ABSENT', reason: choice, note: cleaned }
}

/** İşaretten "Gelmedi" altındaki seçime (pencere yeniden açılınca seçili gelsin diye); geldiyse yok. */
export function absenceChoiceOf(mark: AttendanceMark): AbsenceChoice | null {
  if (mark.status === 'EXCUSED') return 'EXCUSED'
  return mark.status === 'ABSENT' ? mark.reason : null
}

export function countMarks(marks: AttendanceMark[]): AttendanceCounts {
  const count = (status: AttendanceStatus) => marks.filter((mark) => mark.status === status).length
  return { present: count('PRESENT'), absent: count('ABSENT'), excused: count('EXCUSED') }
}

/** "%92 geldi": yoklamaya yazılanların yüzde kaçı geldi. Hiç kayıt yoksa yüzde de yoktur. */
export function presenceRate(counts: AttendanceCounts): number | null {
  const total = counts.present + counts.absent + counts.excused
  return total ? Math.round((counts.present / total) * 100) : null
}

export function toRequest(rows: DraftRow[]): SaveAttendanceRequest {
  return { entries: rows.map(({ worker, mark }) => ({ workerId: worker.id, ...mark })) }
}
