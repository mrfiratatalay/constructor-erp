import type { ProductionItemRequest, ProductionItemView } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import type { Member } from '@/core/demo/server/demoSession'
import { roundTo } from './productionFigures'
import { crewsOf, entriesOf, productionMember, requireItem, requireSite, viewOf } from './productionLookups'
import type { ProductionItemRecord } from './productionRecords'
import { tidy } from './productionText'

/** Formdan gelen, düzeltilebilen alanlar; kimlik, şantiye ve açan değişmez. */
type ItemFields = Pick<
  ProductionItemRecord,
  'trade' | 'title' | 'crewId' | 'totalQuantity' | 'unit' | 'startDate' | 'plannedEnd' | 'note'
>

/** Zorunlu alanlar (backend'de bean validation). Arayüz kaydetmeden önce aynısını sorar, buraya eksik gelmez. */
const isComplete = (request: ProductionItemRequest) =>
  request.trade.trim() !== '' && request.totalQuantity > 0 && request.unit.trim() !== ''

const endsBeforeStart = ({ startDate, plannedEnd }: ProductionItemRequest) =>
  !!startDate && !!plannedEnd && plannedEnd < startDate

/** Taşeron yoklama listesindeki bir ekip olmalı; iş kaleminin zaten bağlı olduğu (sonradan çıkmış) ekip kalabilir. */
function checkCrew(member: Member, crewId: string | null, current: string | null): void {
  if (!crewId || crewId === current) return
  const crew = crewsOf(member.company.id).get(crewId)
  if (!crew || crew.archived) throw badRequest('Taşeron bulunamadı: yoklama listesindeki bir ekip seçilmeli.')
}

function checkRequest(member: Member, request: ProductionItemRequest, currentCrewId: string | null): void {
  if (!isComplete(request)) throw badRequest('İş türü, toplam miktar ve birim yazılmalı.')
  if (endsBeforeStart(request)) throw badRequest('Planlanan bitiş, başlangıçtan önce olamaz.')
  checkCrew(member, request.crewId ?? null, currentCrewId)
}

/** Miktar üç ondalıkla tutulur (backend'de Digits fraction = 3). */
const fieldsOf = (request: ProductionItemRequest): ItemFields => ({
  trade: request.trade.trim(),
  title: tidy(request.title),
  crewId: request.crewId ?? null,
  totalQuantity: roundTo(request.totalQuantity, 3),
  unit: request.unit.trim(),
  startDate: request.startDate ?? null,
  plannedEnd: request.plannedEnd ?? null,
  note: tidy(request.note),
})

/** "Yeni İş Kalemi": yalnızca şantiye şefi açar. Taşeron listede yoksa arayüz onu önce yoklamaya ekler. */
export function createItem({ params, body }: DemoRequest): ProductionItemView {
  const member = productionMember('MANAGE_PRODUCTION')
  const site = requireSite(member, params.siteId!)
  const request = body as ProductionItemRequest
  checkRequest(member, request, null)
  const item: ProductionItemRecord = {
    id: newId(),
    companyId: member.company.id,
    siteId: site.id,
    ...fieldsOf(request),
    createdById: member.person.id,
    createdAt: nowIso(),
  }
  db().production.items.push(item)
  return viewOf(item)
}

export function updateItem({ params, body }: DemoRequest): ProductionItemView {
  const member = productionMember('MANAGE_PRODUCTION')
  const item = requireItem(member, params.itemId!)
  const request = body as ProductionItemRequest
  checkRequest(member, request, item.crewId)
  Object.assign(item, fieldsOf(request))
  return viewOf(item)
}

/** Girişi olan iş kalemi silinmez: girişler şantiyenin kaydıdır, önce onlar silinir. */
export function deleteItem({ params }: DemoRequest): void {
  const item = requireItem(productionMember('MANAGE_PRODUCTION'), params.itemId!)
  if (entriesOf(item.id).length > 0) {
    throw new DemoError(409, 'Girişi olan iş kalemi silinmez: önce günlük girişlerini sil.')
  }
  const items = db().production.items
  items.splice(items.indexOf(item), 1)
}
