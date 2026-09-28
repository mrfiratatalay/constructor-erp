import type { DayMarkView, DayMarkViewStatus, RosterEntryView } from '@/core/api/generated/model'

export type DayStatus = DayMarkViewStatus

/** Bir günün durumu ve mesaisi: puantajdaki işaret de, çalışanın Puantajım'daki günü de bu biçimdedir. */
export type MarkLike = Pick<DayMarkView, 'status' | 'overtimeHours'>

/**
 * Etiketin tonu; iki kütüphanenin ortak adları (el-tag ve van-tag "type"). Renk yalnızca durum içindir: geldi
 * yeşil, yarım gün sarı, gelmedi kırmızı, izinli mavi, işaretlenmedi gri. Etiketin içinde her zaman yazı da vardır.
 */
export type Tone = 'success' | 'warning' | 'danger' | 'primary' | 'info'

export interface StatusLook {
  label: string
  tone: Tone
  /** Ayın cetvelinde hücreye sığan işaret; şekli de farklıdır, yalnızca renge kalmaz. */
  short: string
}

export const STATUS_LOOKS: Record<DayStatus, StatusLook> = {
  PRESENT: { label: 'Geldi', tone: 'success', short: '✓' },
  HALF_DAY: { label: 'Yarım gün', tone: 'warning', short: '½' },
  ABSENT: { label: 'Gelmedi', tone: 'danger', short: '✕' },
  LEAVE: { label: 'İzinli', tone: 'primary', short: 'İ' },
}

/** Kaydı olmayan gün: "Gelmedi" değildir, şef henüz bakmamıştır. */
export const UNMARKED: StatusLook = { label: 'İşaretlenmedi', tone: 'info', short: '–' }

export const lookOf = (mark?: MarkLike | null): StatusLook => (mark ? STATUS_LOOKS[mark.status] : UNMARKED)

/** Ekip yalnızca geldi ya da gelmedi olur; ekipte kaç kişi olduğu tutulmaz. */
export function statusChoices(kind: RosterEntryView['kind']): DayStatus[] {
  return kind === 'CREW' ? ['PRESENT', 'ABSENT'] : ['PRESENT', 'HALF_DAY', 'ABSENT', 'LEAVE']
}

/** Türkçe yazımla saat: "2", "1,5". */
export const hoursText = (hours: number): string => String(hours).replace('.', ',')

/** Etiketin yazısı: "Geldi"; mesai varsa "Geldi +2 s". */
export function markText(mark?: MarkLike | null): string {
  const look = lookOf(mark)
  return mark?.overtimeHours ? `${look.label} +${hoursText(mark.overtimeHours)} s` : look.label
}

/** Ayın cetvelindeki dar hücre: "✓", mesai varsa "✓+2". */
export function shortText(mark: MarkLike): string {
  const short = STATUS_LOOKS[mark.status].short
  return mark.overtimeHours ? `${short}+${hoursText(mark.overtimeHours)}` : short
}

/** Satırın kalın adı: kişide adı, ekipte iş kolu ("Demirci"); iş kolu yazılmadıysa ekip başının adı. */
export function entryTitle(entry: RosterEntryView): string {
  return entry.kind === 'CREW' && entry.trade ? entry.trade : entry.name
}

/** Adın altındaki gri satır: kişide görevi, ekipte ekip başı. */
export function entrySubtitle(entry: RosterEntryView): string {
  if (entry.kind === 'PERSON') return entry.trade ?? ''
  return entry.trade ? `Ekip başı · ${entry.name}` : 'Taşeron ekip'
}
