import { SAMPLE_WAYBILL } from '@/core/demo/media/demoDocuments'
import { addDays, at, isPast, today } from '@/core/demo/server/demoClock'
import type { DemoDatabase } from '@/core/demo/server/demoDb'
import { photoMedia } from '@/core/demo/server/posts/media'
import type { MediaRecord } from '@/core/demo/server/posts/postRecords'
import { newPostRecord } from '@/core/demo/server/posts/postStore'
import {
  fixedId,
  ID_GROUP,
  type PersonKey,
  type Seed,
  type SeedContext,
  type SiteKey,
} from '@/core/demo/server/seed/seedContext'
import { figuresOf, roundTo } from './productionFigures'
import type { ProductionEntryRecord, ProductionItemRecord } from './productionRecords'
import { SAMPLE_ITEMS, type DailyLog, type EntryMoment, type ItemSample } from './productionSamples'
import { fieldBody } from './productionText'

/** Modülün kimlik aralığı 30–39: iş kalemi, giriş, girişin dosyası, Saha gönderisi. */
const GROUP = {
  item: ID_GROUP.production,
  entry: ID_GROUP.production + 1,
  media: ID_GROUP.production + 2,
  post: ID_GROUP.production + 3,
}

/** İlerlemeyi şantiyenin şefi girer: Ayşe Yomra Park ile Kaşüstü'de, Burak Sahil Evleri'nde. */
const LEAD: Record<SiteKey, PersonKey> = { yomra: 'ayse', kasustu: 'ayse', sahil: 'burak', akcaabat: 'burak' }

// Şef girişi iş bitince, akşamüstü yapar; saat kalemden kaleme kayar ki liste elle girilmiş gibi dursun. Ekip de
// her gün aynı sayıda gelmez.
const EVENING = ['17:40', '16:55', '18:10', '17:20', '16:35', '17:55', '18:25']
const WORKER_SHIFT = [0, 1, -1, 2, 0, -2, 1]
const TODAY_AT = '11:30'

type NextId = (group: number) => string

interface SeedScope {
  draft: DemoDatabase
  context: SeedContext
  nextId: NextId
}

/** Günlüğün bir günü: sırası (0 en yenisi), bugüne göre günü, miktarı; salt saatleri kalemden kaleme kaydırır. */
interface LogDay {
  position: number
  delta: number
  quantity: number
  salt: number
}

/** Sıradaki sabit kimlik; her grubun kendi sayacı var. */
function idSequence(): NextId {
  const counts = new Map<number, number>()
  return (group) => {
    const next = (counts.get(group) ?? 0) + 1
    counts.set(group, next)
    return fixedId(group, next)
  }
}

const isSunday = (day: string) => new Date(`${day}T12:00:00Z`).getUTCDay() === 0

/** Son girişin gününden geriye, şantiyenin çalıştığı günler (pazar hariç), bugüne göre fark olarak. */
function workDays(last: number, count: number): number[] {
  const days: number[] = []
  for (let delta = last; days.length < count; delta--) {
    if (!isSunday(addDays(today(), delta))) days.push(delta)
  }
  return days
}

/** Taşeron yoklamanın ekibinden adıyla bulunur; yoklamada yoksa iş kalemi taşeronsuz kalır ("atanmadı"). */
function crewIdOf({ draft, context }: SeedScope, name: string | undefined): string | null {
  const crew = draft.puantaj.roster.find(
    (row) => row.companyId === context.company.id && row.kind === 'CREW' && row.name === name,
  )
  return crew?.id ?? null
}

function itemOf(scope: SeedScope, sample: ItemSample, index: number): ProductionItemRecord {
  const { context, nextId } = scope
  return {
    id: nextId(GROUP.item),
    companyId: context.company.id,
    siteId: context.sites[sample.site].id,
    trade: sample.trade,
    title: sample.title ?? null,
    crewId: crewIdOf(scope, sample.crew),
    totalQuantity: sample.total,
    unit: sample.unit,
    startDate: addDays(today(), sample.start),
    plannedEnd: addDays(today(), sample.end),
    note: sample.note ?? null,
    createdById: context.people[LEAD[sample.site]].id,
    // Kalem iş başlarken açılır; aynı gün açılanlar listede örnekteki sırayla dursun diye dakikası kayar.
    createdAt: at(Math.min(sample.start, -1), `08:${String(10 + index).padStart(2, '0')}`),
  }
}

function waybillMedia(createdAt: string, id: string): MediaRecord {
  const { url, sizeBytes } = SAMPLE_WAYBILL
  const file = { fileName: 'sevk-irsaliyesi.pdf', sizeBytes, durationSeconds: null }
  return { id, kind: 'DOCUMENT', url, thumbnailUrl: null, ...file, createdAt }
}

function mediaOf(moment: EntryMoment, createdAt: string, nextId: NextId): MediaRecord[] {
  const photos = (moment.photos ?? []).map((name) => photoMedia(name, createdAt, nextId(GROUP.media)))
  return moment.waybill ? [...photos, waybillMedia(createdAt, nextId(GROUP.media))] : photos
}

function entryOf(scope: SeedScope, item: ProductionItemRecord, log: DailyLog, day: LogDay): ProductionEntryRecord {
  const moment = log.moments?.[day.position] ?? {}
  const evening = EVENING[(day.position + day.salt) % EVENING.length]!
  const createdAt = at(day.delta, day.delta === 0 ? (log.todayAt ?? TODAY_AT) : evening)
  const workers = moment.workers ?? log.workers + WORKER_SHIFT[day.position % WORKER_SHIFT.length]!
  return {
    id: scope.nextId(GROUP.entry),
    itemId: item.id,
    companyId: item.companyId,
    siteId: item.siteId,
    day: addDays(today(), day.delta),
    quantity: day.quantity,
    // 0 girilen gün "çalışma yapılmadı" demektir: o gün kimse çalışmadı.
    workerCount: day.quantity > 0 ? workers : null,
    note: moment.note ?? null,
    postId: null,
    media: mediaOf(moment, createdAt, scope.nextId),
    createdById: item.createdById,
    createdAt,
  }
}

/** Saha'ya yansıtılan giriş Saha'da sıradan bir saha güncellemesidir: girişle aynı anda, aynı dosyalarla. */
function seedFieldPost(scope: SeedScope, item: ProductionItemRecord, entry: ProductionEntryRecord, done: number) {
  const body = fieldBody(item, entry, figuresOf(item.totalQuantity, done))
  const media = entry.media.map((file) => ({ ...file }))
  const fieldPost = { siteId: item.siteId, authorId: entry.createdById, body, media, createdAt: entry.createdAt }
  const post = newPostRecord({ ...fieldPost, id: scope.nextId(GROUP.post), fieldUpdate: true }, item.companyId)
  scope.draft.posts.push(post)
  return post.id
}

/**
 * Girişler eskiden yeniye yazılır: Saha'ya yansıyanın yazısı o ana kadarki toplamı söyler. Bugünün saati henüz
 * gelmemiş girişi yazılmaz (sabah açılan demoda öğleden sonranın girişi görünmesin).
 */
function seedLog(scope: SeedScope, item: ProductionItemRecord, log: DailyLog, salt: number): void {
  const days = workDays(log.last, log.daily.length)
  const logDays = log.daily.flatMap((quantity, position) =>
    quantity === null ? [] : [{ position, delta: days[position]!, quantity, salt }],
  )
  let done = 0
  for (const day of logDays.reverse()) {
    const entry = entryOf(scope, item, log, day)
    if (!isPast(entry.createdAt)) continue
    done = roundTo(done + day.quantity, 3)
    scope.draft.production.entries.push(entry)
    if (log.moments?.[day.position]?.onField) entry.postId = seedFieldPost(scope, item, entry, done)
  }
}

/** Süren üç şantiyenin iş kalemleri ve son haftaların günlük girişleri; birkaç giriş Saha'ya da yansımış. */
export const seedProduction: Seed = (draft, context) => {
  const scope: SeedScope = { draft, context, nextId: idSequence() }
  SAMPLE_ITEMS.forEach((sample, index) => {
    const item = itemOf(scope, sample, index)
    draft.production.items.push(item)
    if (sample.log) seedLog(scope, item, sample.log, index)
  })
}
