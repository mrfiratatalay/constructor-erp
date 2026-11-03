import type { CrewRef, MediaView, ProductionEntryView, ProductionItemView } from '@/core/api/generated/model'
import { today } from '@/core/demo/server/demoClock'
import { personName } from '@/core/demo/server/demoSession'
import type { MediaRecord } from '@/core/demo/server/posts/postRecords'
import type { RosterRecord } from '@/core/demo/server/puantaj/puantajRecords'
import { figuresOf, progressOf, statusOf } from './productionFigures'
import { itemName, type ProductionEntryRecord, type ProductionItemRecord } from './productionRecords'

/** İş kaleminin taşeronu: yoklamanın ekibi. Listeden çıkmışsa (archived) yeni iş kalemine seçilmez. */
export const crewRefOf = (row: RosterRecord): CrewRef => ({
  id: row.id,
  name: row.name,
  trade: row.trade,
  archived: row.archived,
})

/** Demoda dosya yüklenince hemen hazırdır: gerçek backend'deki dönüştürme (PROCESSING) yok. */
const mediaViewOf = (media: MediaRecord): MediaView => ({ ...media, status: 'READY' })

/** Gerçekleşen, kalan, yüzde ve durum kayıtta durmaz; her okumada girişlerden hesaplanır. */
export function itemViewOf(
  item: ProductionItemRecord,
  entries: ProductionEntryRecord[],
  crew?: CrewRef,
): ProductionItemView {
  const day = today()
  const progress = progressOf(entries, day)
  const figures = figuresOf(item.totalQuantity, progress.done)
  return {
    id: item.id,
    trade: item.trade,
    title: item.title,
    name: itemName(item),
    crew,
    totalQuantity: item.totalQuantity,
    unit: item.unit,
    doneQuantity: progress.done,
    remainingQuantity: figures.remaining,
    percent: figures.percent,
    todayQuantity: progress.today,
    status: statusOf(figures, item.plannedEnd, day),
    startDate: item.startDate,
    plannedEnd: item.plannedEnd,
    note: item.note,
    lastEntryAt: progress.lastEntryAt,
    createdAt: item.createdAt,
  }
}

export function entryViewOf(entry: ProductionEntryRecord): ProductionEntryView {
  return {
    id: entry.id,
    itemId: entry.itemId,
    day: entry.day,
    quantity: entry.quantity,
    workerCount: entry.workerCount,
    note: entry.note,
    authorName: personName(entry.createdById),
    createdAt: entry.createdAt,
    onField: entry.postId !== null,
    media: entry.media.map(mediaViewOf),
  }
}
