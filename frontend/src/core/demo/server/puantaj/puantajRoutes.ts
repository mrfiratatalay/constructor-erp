import type { MyPuantajView, PuantajView } from '@/core/api/generated/model'
import { daysBetween, monthRange, today } from '@/core/demo/server/demoClock'
import { badRequest } from '@/core/demo/server/demoError'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { get, type DemoRoute } from '@/core/demo/server/demoRouter'
import { requireFeature } from '@/core/demo/server/demoSession'
import { isIsoDay, requireRollCaller } from './markRules'
import { markRoutes } from './markRoutes'
import { addMissingWorkers, ledgerOf, marksOf, rosterOf } from './puantajLedger'
import { entryView, isOnList, markView, myDayView } from './puantajViews'
import { rosterRoutes } from './rosterRoutes'

// Bir okumada en çok iki ay: ayın cetveli ve bir önceki haftayla birlikte bugünün ekranı sığar.
const MAX_RANGE_DAYS = 62
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

/** İstenen günlerin puantajı: bugünün ekranı son günleri, ayın cetveli bütün ayı ister. */
function getPuantaj({ query }: DemoRequest): PuantajView {
  const { company } = requireRollCaller()
  const from = query.get('from') ?? ''
  const to = query.get('to') ?? ''
  const valid = isIsoDay(from) && isIsoDay(to) && from <= to && daysBetween(from, to) < MAX_RANGE_DAYS
  if (!valid) throw badRequest('Tarih aralığı hatalı.')
  const { entries, marks } = ledgerOf(company.id, from, to)
  return { from, to, today: today(), entries: entries.map(entryView), marks: marks.map(markView) }
}

/**
 * Puantajım: oturumu açık kişinin kendi ayı; başkasının kaydı buradan gelmez. Patron ve şef yoklamada sayılmaz,
 * listeleri boş döner. Yalnızca işaretlenmiş günler gelir, işaretlendiği anda.
 */
function getMyPuantaj({ query }: DemoRequest): MyPuantajView {
  const { person, company } = requireFeature('attendance')
  const month = query.get('month') ?? ''
  if (!MONTH.test(month)) throw badRequest('Ay hatalı.')
  const [from, to] = monthRange(month)
  addMissingWorkers(company.id)
  const entry = rosterOf(company.id).find((candidate) => candidate.personId === person.id)
  const days = entry ? marksOf(entry.id, from, to).map(myDayView) : []
  return { from, to, today: today(), counted: entry ? isOnList(entry) : false, days }
}

/** Yoklama ve puantaj: bugünün ekranı, ayın cetveli, liste ve Puantajım. Excel dökümü düz bağlantıdır, burada yok. */
export const puantajRoutes: DemoRoute[] = [
  get('/api/puantaj', getPuantaj),
  get('/api/puantaj/me', getMyPuantaj),
  ...rosterRoutes,
  ...markRoutes,
]
