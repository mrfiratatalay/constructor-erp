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
  /** Dar yerlerde (telefonun sayı çipleri, toplu işaretleme çubuğu) tek kelime. */
  brief: string
  tone: Tone
  /** Ayın cetvelinde hücreye sığan işaret; şekli de farklıdır, yalnızca renge kalmaz. */
  short: string
}

export const STATUS_LOOKS: Record<DayStatus, StatusLook> = {
  PRESENT: { label: 'Geldi', brief: 'Geldi', tone: 'success', short: '✓' },
  HALF_DAY: { label: 'Yarım gün', brief: 'Yarım', tone: 'warning', short: '½' },
  ABSENT: { label: 'Gelmedi', brief: 'Gelmedi', tone: 'danger', short: '✕' },
  LEAVE: { label: 'İzinli', brief: 'İzinli', tone: 'primary', short: 'İ' },
}

/** Kaydı olmayan gün: "Gelmedi" değildir, şef henüz bakmamıştır. Boş halka: daha doldurulmamış. */
export const UNMARKED: StatusLook = { label: 'İşaretlenmedi', brief: 'Kalan', tone: 'info', short: '○' }

export const lookOf = (mark?: MarkLike | null): StatusLook => (mark ? STATUS_LOOKS[mark.status] : UNMARKED)

/** Ekip yalnızca geldi ya da gelmedi olur; ekipte kaç kişi olduğu tutulmaz. */
export function statusChoices(kind: RosterEntryView['kind']): DayStatus[] {
  return kind === 'CREW' ? ['PRESENT', 'ABSENT'] : ['PRESENT', 'HALF_DAY', 'ABSENT', 'LEAVE']
}

/** Türkçe yazımla saat: "2", "1,5". */
export const hoursText = (hours: number): string => String(hours).replace('.', ',')

/**
 * İşaretin uzun boyu, tek günün gösterildiği yerlerde (bugünün sütunu, satır, gün ayrıntısı): "Geldi", mesai varsa
 * "Geldi · +2 s", kaydı yoksa "İşaretlenmedi". Şekil (✓ ½ ✕ İ) yazıya eklenmez: anlamı kelime taşır, "İ İzinli"
 * yazım hatası gibi okunuyordu. Şekil yalnızca kısa boydadır (cetvel, takvim): MarkDot.
 */
export function markLabel(mark?: MarkLike | null): string {
  const look = lookOf(mark)
  const overtime = mark?.overtimeHours ? ` · +${hoursText(mark.overtimeHours)} s` : ''
  return `${look.label}${overtime}`
}

/** Kısa boyun açıklaması: üstüne gelince ve ekran okuyucuda "Geldi, 2 saat mesai". */
export function markTitle(mark?: MarkLike | null): string {
  const look = lookOf(mark)
  return mark?.overtimeHours ? `${look.label}, ${hoursText(mark.overtimeHours)} saat mesai` : look.label
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
