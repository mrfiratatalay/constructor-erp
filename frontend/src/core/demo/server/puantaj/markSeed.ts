import { addDays, at, daysBetween, daysFrom, isPast, today } from '@/core/demo/server/demoClock'
import { fixedId, type SeedContext } from '@/core/demo/server/seed/seedContext'
import { planOf, type DayPlan } from './markPlans'
import type { MarkRecord } from './puantajRecords'
import type { SeedRow } from './rosterSeed'

// İşaretlerin kimlik grubu; cetvelin kalemleri ID_GROUP.puantaj (10) grubundadır.
const MARK_GROUP = 11

const isSunday = (day: string) => new Date(`${day}T12:00:00Z`).getUTCDay() === 0

/** Geçen ayın ilk günü: ay sonu hesabı geçen ayın cetveline bakılarak yapılır, o ay da dolu görünsün. */
const firstSeededDay = (now: string) => `${addDays(`${now.slice(0, 8)}01`, -1).slice(0, 8)}01`

/** Bugün ve ondan geriye iş günleri (Pazar tatil); sırası "kaç iş günü önce"dir. */
function daysBack(now: string): string[] {
  const past = daysFrom(firstSeededDay(now), addDays(now, -1)).filter((day) => !isSunday(day))
  return [now, ...past.reverse()]
}

function recordOf(row: SeedRow, day: string, plan: DayPlan, context: SeedContext): Omit<MarkRecord, 'id'> {
  const { status, overtimeHours, note } = plan
  const markedAt = at(daysBetween(today(), plan.on), plan.time)
  return { entryId: row.record.id, day, status, overtimeHours, note, markedById: context.people[plan.by].id, markedAt }
}

/** Geçen aydan bugüne işaretler. Saati gelmemiş işaret yazılmaz: sabah erken açılan demoda bugünün yoklaması boştur. */
export function seedMarks(rows: SeedRow[], context: SeedContext): MarkRecord[] {
  const marks: MarkRecord[] = []
  daysBack(today()).forEach((day, back) => {
    // Bugün Pazarsa yoklama alınmaz.
    if (isSunday(day)) return
    for (const row of rows) {
      const plan = day >= row.since ? planOf(row, day, back) : null
      const mark = plan && recordOf(row, day, plan, context)
      if (mark && isPast(mark.markedAt)) marks.push({ ...mark, id: fixedId(MARK_GROUP, marks.length + 1) })
    }
  })
  return marks
}
