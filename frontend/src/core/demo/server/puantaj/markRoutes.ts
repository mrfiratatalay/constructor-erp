import type { BulkMarkRequest, DayMarkView, MarkRequest } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { del, post, put, type DemoRoute } from '@/core/demo/server/demoRouter'
import type { Member } from '@/core/demo/server/demoSession'
import {
  checkedMarking,
  parseStatus,
  requireEditableDay,
  requireRollCaller,
  requireStatusFor,
  type DayStatus,
  type Marking,
} from './markRules'
import { findMark, requireMarkable } from './puantajLedger'
import type { MarkRecord } from './puantajRecords'
import { markView } from './puantajViews'

const MAX_BULK = 300

/** Kalem başına günde tek kayıt: varsa üstüne yazılır. Kimin, ne zaman işaretlediği de yazılır. */
function saveMark(entryId: string, day: string, marking: Marking, member: Member): MarkRecord {
  const stamp = { markedById: member.person.id, markedAt: nowIso() }
  const existing = findMark(entryId, day)
  if (existing) return Object.assign(existing, marking, stamp)
  const created: MarkRecord = { id: newId(), entryId, day, ...marking, ...stamp }
  db().puantaj.marks.push(created)
  return created
}

/** Her seçim anında kaydedilir; ayrı bir "Kaydet" ya da "Tamamla" yoktur. */
function markEntry({ params, body }: DemoRequest): DayMarkView {
  const member = requireRollCaller()
  const day = requireEditableDay(member, params.day)
  const entry = requireMarkable(member.company.id, params.entryId!)
  const marking = checkedMarking(entry.kind, (body ?? {}) as MarkRequest)
  return markView(saveMark(entry.id, day, marking, member))
}

/** İşaret kaldırılınca gün yeniden "İşaretlenmedi" olur; "Gelmedi" değil. */
function clearMark({ params }: DemoRequest): void {
  const member = requireRollCaller()
  const day = requireEditableDay(member, params.day)
  const entry = requireMarkable(member.company.id, params.entryId!)
  const marks = db().puantaj.marks
  const index = marks.findIndex((mark) => mark.entryId === entry.id && mark.day === day)
  if (index >= 0) marks.splice(index, 1)
}

/** Toplu işaretleme yalnızca durumu değiştirir: not yerinde kalır, geldi olmayan günün mesaisi silinir. */
function withStatus(existing: MarkRecord | undefined, status: DayStatus): Marking {
  const overtimeHours = status === 'PRESENT' ? (existing?.overtimeHours ?? null) : null
  return { status, overtimeHours, note: existing?.note ?? null }
}

/** Şefin seçtikleri tek hamlede. Bir kalem kurala uymazsa hiçbiri kaydedilmez: önce hepsi denetlenir. */
function markEntries({ params, body }: DemoRequest): DayMarkView[] {
  const member = requireRollCaller()
  const day = requireEditableDay(member, params.day)
  const request = (body ?? {}) as BulkMarkRequest
  const ids = [...new Set(request.entryIds ?? [])]
  if (ids.length === 0) throw badRequest('Önce listeden kişi seç.')
  if (ids.length > MAX_BULK) throw badRequest('Tek seferde en çok 300 kişi işaretlenir.')
  const status = parseStatus(request.status)
  const entries = ids.map((id) => requireMarkable(member.company.id, id))
  entries.forEach((entry) => requireStatusFor(entry.kind, status))
  return entries.map((entry) => markView(saveMark(entry.id, day, withStatus(findMark(entry.id, day), status), member)))
}

export const markRoutes: DemoRoute[] = [
  put('/api/puantaj/days/:day/entries/:entryId', markEntry),
  del('/api/puantaj/days/:day/entries/:entryId', clearMark),
  post('/api/puantaj/days/:day/bulk', markEntries),
]
