// Ayın puantajı: 1 Ekim'den dünün akşamına kadar her iş günü, gerçekçi bir dağılımla (çoğu Geldi; arada izin,
// yarım gün, gelmedi ve mesai). Bugün: canlı çekimde işaretlenecek dört kişi boş, diğerleri sabah işaretli.
import { rng } from './random.mjs'
import { demoToday, workdaysThisMonthBeforeToday } from './clock.mjs'
import { LIVE_ROLL_CALL } from './content.mjs'

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

/** Cetvelin tamamı: seed'in eklediği ustalar ve ekipler, bir de uygulamayı kullanan çalışanlar (ör. Musa). */
async function rosterOf(owner) {
  const today = demoToday()
  const { entries } = await owner.get(`/api/puantaj?from=${today.slice(0, 8)}01&to=${today}`)
  return entries.filter((entry) => !entry.archived)
}

export async function seedAttendance(owner) {
  const random = rng(2026)
  const roster = await rosterOf(owner)
  for (const day of workdaysThisMonthBeforeToday()) {
    const marks = roster.map(({ id, kind }) => {
      const status = statusOf(random, kind)
      const overtime = status === 'PRESENT' && kind === 'PERSON' && random() < 0.12 ? 2 : null
      return { id, status, overtime }
    })
    await markDay(owner, day, marks)
  }
  const morning = roster.filter(({ name }) => !LIVE_ROLL_CALL.includes(name)).map(({ id }) => ({ id, status: 'PRESENT' }))
  await markDay(owner, demoToday(), morning)
}
