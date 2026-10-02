// Ayın puantajı: 1 Ekim'den dünün akşamına kadar her iş günü, gerçekçi bir dağılımla (çoğu Geldi; arada izin,
// yarım gün, gelmedi ve mesai). Bugün: canlı çekimde işaretlenecek dört kişi boş, diğerleri sabah işaretli.
import { rng } from './random.mjs'
import { demoToday, workdaysThisMonthBeforeToday } from './clock.mjs'
import { LIVE_ROLL_CALL, ROSTER } from './content.mjs'

function statusOf(random, kind) {
  const roll = random()
  if (kind === 'CREW') return roll < 0.9 ? 'PRESENT' : 'ABSENT'
  if (roll < 0.86) return 'PRESENT'
  if (roll < 0.9) return 'HALF_DAY'
  if (roll < 0.95) return 'LEAVE'
  return 'ABSENT'
}

async function markDay(owner, day, marks) {
  const byStatus = {}
  for (const { id, status } of marks) (byStatus[status] ??= []).push(id)
  for (const [status, entryIds] of Object.entries(byStatus)) {
    await owner.post(`/api/puantaj/days/${day}/bulk`, { entryIds, status })
  }
  for (const { id, overtime } of marks.filter((mark) => mark.overtime)) {
    await owner.put(`/api/puantaj/days/${day}/entries/${id}`, { status: 'PRESENT', overtimeHours: overtime, note: null })
  }
}

export async function seedAttendance(owner, rosterIds) {
  const random = rng(2026)
  for (const day of workdaysThisMonthBeforeToday()) {
    const marks = ROSTER.map(({ name, kind }) => {
      const status = statusOf(random, kind)
      const overtime = status === 'PRESENT' && kind === 'PERSON' && random() < 0.12 ? 2 : null
      return { id: rosterIds[name], status, overtime }
    })
    await markDay(owner, day, marks)
  }
  const morning = ROSTER.filter(({ name }) => !LIVE_ROLL_CALL.includes(name))
    .map(({ name }) => ({ id: rosterIds[name], status: 'PRESENT' }))
  await markDay(owner, demoToday(), morning)
}
