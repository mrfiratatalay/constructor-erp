import type { AttendanceEntryViewReason, AttendanceEntryViewStatus } from '@/core/api/generated/model'
import type { StatusTone } from '@/core/format/statusTone'

export type AttendanceStatus = AttendanceEntryViewStatus
/** Üretilen tip "neden yok"u (null) da içerir; neden adları için yalnızca gerçek nedenler. */
export type AbsenceReason = NonNullable<AttendanceEntryViewReason>

/** Renk tek başına anlam taşımaz (TASARIM.md İlke 2): her tonun yanında yazısı vardır. */
export const ATTENDANCE_STATUS: Record<AttendanceStatus, { label: string; tone: StatusTone }> = {
  PRESENT: { label: 'Geldi', tone: 'success' },
  ABSENT: { label: 'Gelmedi', tone: 'danger' },
  EXCUSED: { label: 'İzinli', tone: 'warning' },
}

export const ABSENCE_REASON: Record<AbsenceReason, string> = {
  SICK: 'Hasta',
  UNEXCUSED: 'Habersiz',
  OTHER: 'Diğer',
}

/**
 * "Gelmedi" seçilince çıkan dört seçenek. İzinli arka planda ayrı bir durumdur (EXCUSED) ama kullanıcı onu
 * gelmeme nedenlerinden biri olarak görür: "neden gelmedi?" sorusunun cevabıdır.
 */
export type AbsenceChoice = AbsenceReason | 'EXCUSED'

export const ABSENCE_CHOICES: { value: AbsenceChoice; label: string }[] = [
  { value: 'SICK', label: 'Hasta' },
  { value: 'EXCUSED', label: 'İzinli' },
  { value: 'UNEXCUSED', label: 'Habersiz' },
  { value: 'OTHER', label: 'Diğer' },
]

/** Satırda yazan: "Geldi", "İzinli", "Gelmedi · Hasta". */
export function markLabel(status: AttendanceStatus, reason?: AbsenceReason | null): string {
  const base = ATTENDANCE_STATUS[status].label
  return status === 'ABSENT' && reason ? `${base} · ${ABSENCE_REASON[reason]}` : base
}
