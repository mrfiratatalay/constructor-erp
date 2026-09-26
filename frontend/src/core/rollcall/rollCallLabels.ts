import type { DayRecord, MarkMemberRequest, MarkMemberRequestReason } from '@/core/api/generated/model'
import type { StatusTone } from '@/core/format/statusTone'

/** Üretilen tip "neden yok"u (null) da içerir; neden adları için yalnızca gerçek nedenler. */
type AbsenceReason = NonNullable<MarkMemberRequestReason>

/** Kaydı olmayan gün "katılmadı"dır: o gün yoklama mesajı vardı, kişi katılmadı ve işaretlenmedi. */
export type DayKind = DayRecord['status'] | 'MISSED'

/** Renk tek başına anlam taşımaz (TASARIM.md İlke 2): her tonun yanında yazısı vardır. */
const KINDS: Record<DayKind, { label: string; tone: StatusTone }> = {
  PRESENT: { label: 'Geldi', tone: 'success' },
  ABSENT: { label: 'Gelmedi', tone: 'danger' },
  EXCUSED: { label: 'İzinli', tone: 'warning' },
  MISSED: { label: 'Katılmadı', tone: 'neutral' },
}

const REASONS: Record<AbsenceReason, string> = {
  SICK: 'Hastalık',
  UNEXCUSED: 'Habersiz',
  OTHER: 'Diğer',
}

export interface MarkChoice {
  key: string
  label: string
  request: MarkMemberRequest
}

/**
 * Patronun küçük seçimi, tek dokunuş: gelmeme nedeni ayrı bir adım değildir, seçeneğin kendisidir. İzinli
 * arka planda ayrı bir durumdur (EXCUSED) ama kullanıcı onu "neden gelmedi?" sorusunun cevabı olarak görür.
 */
export const MARK_CHOICES: MarkChoice[] = [
  { key: 'PRESENT', label: 'Geldi', request: { status: 'PRESENT' } },
  { key: 'SICK', label: 'Hastalık', request: { status: 'ABSENT', reason: 'SICK' } },
  { key: 'EXCUSED', label: 'İzinli', request: { status: 'EXCUSED' } },
  { key: 'UNEXCUSED', label: 'Habersiz', request: { status: 'ABSENT', reason: 'UNEXCUSED' } },
  { key: 'OTHER', label: 'Diğer', request: { status: 'ABSENT', reason: 'OTHER' } },
]

export function dayKind(record: DayRecord | null | undefined): DayKind {
  return record ? record.status : 'MISSED'
}

export function statusLabel(kind: DayKind): string {
  return KINDS[kind].label
}

/** Satırda ve takvimde yazan: "Geldi", "İzinli", "Gelmedi · Hastalık", "Katılmadı". */
export function recordLabel(record: DayRecord | null | undefined): string {
  const base = KINDS[dayKind(record)].label
  return record?.status === 'ABSENT' && record.reason ? `${base} · ${REASONS[record.reason]}` : base
}

export function recordTone(record: DayRecord | null | undefined): StatusTone {
  return KINDS[dayKind(record)].tone
}
