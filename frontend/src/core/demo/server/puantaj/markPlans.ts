import type { DayMarkViewStatus } from '@/core/api/generated/model'
import { addDays } from '@/core/demo/server/demoClock'
import type { PersonKey } from '@/core/demo/server/seed/seedContext'
import { scriptOf, type ScriptedMark } from './markScript'
import type { Lead, SeedRow } from './rosterSeed'

/** Bir günün örnek işareti ve izi: kim, hangi gün (`on`), saat kaçta yazdı. */
export interface DayPlan {
  status: DayMarkViewStatus
  overtimeHours: number | null
  note: string | null
  by: PersonKey
  on: string
  time: string
}

const HALF_DAY_RATE = 0.02
const OVERTIME_RATE = 0.05
const NOTE_RATE = 0.4

const NOTES = {
  ABSENT: ['Haber vermedi', 'Hasta', 'Telefonu kapalı'],
  CREW_ABSENT: ['Başka şantiyede', 'Malzeme bekliyor', 'Haber vermediler'],
  HALF_DAY: ['Öğleden sonra izin aldı', 'Öğlen hastaneye gitti'],
  OVERTIME: ['Malzeme indirme', 'Kalıp sökümü'],
  POUR: ['Beton dökümü', 'Beton dökümü için akşam kaldı'],
}

// Şefin sabah yoklamaya başladığı dakika: Ayşe 08:08'de, Burak öbür şantiyeden gelip biraz sonra. Mesai iş bitince,
// akşam yazılır; patron geçmiş günü ertesi akşam düzeltir.
const MORNING: Record<Lead, number> = { ayse: 8 * 60 + 8, burak: 8 * 60 + 14 }
const EVENING = 18 * 60 + 20
const OWNER_EVENING = 20 * 60 + 5

/** Aynı satırın aynı günü için hep aynı sayı (0 ile 1 arası): demo sıfırlansa da puantaj aynı görünür. */
export function chance(...parts: string[]): number {
  let hash = 0x811c9dc5
  for (const char of parts.join('/')) hash = Math.imul(hash ^ char.charCodeAt(0), 0x01000193)
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b)
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35)
  return ((hash ^ (hash >>> 16)) >>> 0) / 0x100000000
}

const pick = <T>(items: readonly T[], roll: number): T =>
  items[Math.min(Math.floor(roll * items.length), items.length - 1)]!

const clock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

// Haftada bir kat betonu dökülür; o akşam kalıp, demir ve vinç geç çıkar.
const isPourDay = (back: number) => back % 6 === 2

/** İzin önceden bilinir, senaryodadır; alışkanlıktan yalnızca gelmeme ve yarım gün çıkar. */
function statusOf(row: SeedRow, roll: number): DayMarkViewStatus {
  if (roll < row.absence) return 'ABSENT'
  const halfDay = row.record.kind === 'PERSON' && roll < row.absence + HALF_DAY_RATE
  return halfDay ? 'HALF_DAY' : 'PRESENT'
}

function overtimeOf(row: SeedRow, day: string, back: number): number | null {
  const roll = chance('mesai', row.key, day)
  if (row.pour && isPourDay(back)) return pick([2, 2.5, 3], roll)
  return roll < OVERTIME_RATE ? pick([1, 1.5, 2], roll / OVERTIME_RATE) : null
}

function notesFor(row: SeedRow, mark: Pick<ScriptedMark, 'status' | 'overtimeHours'>, back: number): string[] {
  if (mark.overtimeHours) return row.pour && isPourDay(back) ? NOTES.POUR : NOTES.OVERTIME
  if (mark.status === 'PRESENT') return []
  if (row.record.kind === 'CREW') return NOTES.CREW_ABSENT
  return mark.status === 'HALF_DAY' ? NOTES.HALF_DAY : NOTES.ABSENT
}

/** Satırın alışkanlığından bir gün: çoğu gün geldi; arada gelmedi, yarım gün, mesai ve kısa bir not. */
function habitualMark(row: SeedRow, day: string, back: number): ScriptedMark {
  const status = statusOf(row, chance(row.key, day))
  const overtimeHours = status === 'PRESENT' && row.record.kind === 'PERSON' ? overtimeOf(row, day, back) : null
  const notes = notesFor(row, { status, overtimeHours }, back)
  const roll = chance('not', row.key, day)
  const note = notes.length > 0 && roll < NOTE_RATE ? pick(notes, roll / NOTE_RATE) : null
  return { status, overtimeHours, note, byOwner: false }
}

/** O günün yoklamasını kim alır: genelde satırın şefi; biri izinliyken öbürü herkesi işaretler. */
function markerOf(row: SeedRow, back: number): Lead {
  if (back % 9 === 4) return 'burak'
  return back % 11 === 7 ? 'ayse' : row.lead
}

function signed(row: SeedRow, day: string, back: number, mark: ScriptedMark): DayPlan {
  const { status, overtimeHours, note } = mark
  if (mark.byOwner) {
    return { status, overtimeHours, note, by: 'kemal', on: addDays(day, 1), time: clock(OWNER_EVENING + row.index * 3) }
  }
  const lead = markerOf(row, back)
  const minutes = overtimeHours
    ? EVENING + Math.floor(chance('akşam', row.key, day) * 30)
    : MORNING[lead] + Math.floor(chance(lead, day) * 6) + row.index
  return { status, overtimeHours, note, by: lead, on: day, time: clock(minutes) }
}

/** Satırın o günkü işareti; null ise işaretlenmemiş. back: kaç iş günü önce (0: bugün). */
export function planOf(row: SeedRow, day: string, back: number): DayPlan | null {
  const scripted = scriptOf(row.key, back)
  if (scripted !== undefined) return scripted ? signed(row, day, back, scripted) : null
  // Bugünün yoklaması yalnızca senaryodaki kadar alınmış.
  if (back === 0) return null
  return signed(row, day, back, habitualMark(row, day, back))
}
