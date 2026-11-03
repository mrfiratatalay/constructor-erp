import type { DayMarkViewStatus, MarkRequest, RosterEntryViewKind } from '@/core/api/generated/model'
import { today } from '@/core/demo/server/demoClock'
import { badRequest, forbidden } from '@/core/demo/server/demoError'
import { requireFeature, requireRole, type Member } from '@/core/demo/server/demoSession'

export type DayStatus = DayMarkViewStatus

/** Kurallardan geçmiş bir işaret: durum, varsa mesai saati ve not. */
export interface Marking {
  status: DayStatus
  overtimeHours: number | null
  note: string | null
}

const STATUSES: readonly unknown[] = ['PRESENT', 'HALF_DAY', 'ABSENT', 'LEAVE']
const MAX_OVERTIME = 16
const MAX_NOTE = 200

/** Yoklamayı patron ve şef alır, listeyi de onlar düzenler; çalışanın yalnızca Puantajım'ı vardır. */
export function requireRollCaller(): Member {
  requireFeature('attendance')
  return requireRole('OWNER', 'SITE_LEAD')
}

/** '2026-11-03' biçiminde gerçek bir gün mü? */
export const isIsoDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(day))

/** Boş yazı kaydedilmez. */
export const tidy = (text: unknown): string | null => (typeof text === 'string' && text.trim()) || null

/**
 * "Bugün" firmanın saatine göredir. Şef yalnızca bugünü işaretler, geçmiş bir günü patron düzeltir (şef geçmişe
 * dönüp puantajla oynayamaz); ileri bir günün yoklaması alınmaz.
 */
export function requireEditableDay(member: Member, day: string | undefined): string {
  if (!day || !isIsoDay(day)) throw badRequest('Tarih hatalı.')
  if (day > today()) throw badRequest('İleri bir günün yoklaması alınmaz.')
  if (member.role !== 'OWNER' && day < today()) throw forbidden('Geçmiş bir günü yalnızca patron düzeltebilir.')
  return day
}

export function parseStatus(value: unknown): DayStatus {
  if (!STATUSES.includes(value)) throw badRequest('Durumu seç.')
  return value as DayStatus
}

/** Ekip yalnızca geldi ya da gelmedi olur: ekipte kaç kişi olduğuna değil, ekibin gelip gelmediğine bakılır. */
export function requireStatusFor(kind: RosterEntryViewKind, status: DayStatus): void {
  if (kind === 'CREW' && status !== 'PRESENT' && status !== 'ABSENT') {
    throw badRequest('Ekip için yalnızca Geldi ya da Gelmedi seçilir.')
  }
}

/** Mesai ayrı bir durum değil, geldiği güne eklenen saattir: "yarım gün + mesai" kendiyle çelişir. */
function requireOvertime(kind: RosterEntryViewKind, status: DayStatus, hours: number): void {
  if (kind === 'CREW') throw badRequest('Ekibe mesai yazılmaz.')
  if (status !== 'PRESENT') throw badRequest('Mesai yalnızca Geldi gününe yazılır.')
  if (hours > MAX_OVERTIME || !Number.isInteger(hours * 2)) {
    throw badRequest('Mesai yarım saatlik adımlarla, en çok 16 saat yazılır.')
  }
}

/** Tek günün işareti: önce durum, gerekiyorsa mesai (sıfır mesai yok sayılır) ve not. */
export function checkedMarking(kind: RosterEntryViewKind, request: MarkRequest): Marking {
  const status = parseStatus(request.status)
  requireStatusFor(kind, status)
  const hours = request.overtimeHours
  const overtimeHours = typeof hours === 'number' && hours > 0 ? hours : null
  if (overtimeHours !== null) requireOvertime(kind, status, overtimeHours)
  const note = tidy(request.note)
  if (note && note.length > MAX_NOTE) throw badRequest('Not en çok 200 harf olabilir.')
  return { status, overtimeHours, note }
}
