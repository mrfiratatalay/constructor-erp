import dayjs from 'dayjs'
import type {
  ProductionEntryView,
  ProductionItemView,
  ProductionItemViewStatus,
} from '@/core/api/generated/model'

/** Üstteki durum düğmeleri: Tümü ve dört durum. */
export type StatusFilter = 'ALL' | ProductionItemViewStatus

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Tümü' },
  { value: 'IN_PROGRESS', label: 'Devam eden' },
  { value: 'NEARLY_DONE', label: 'Bitmeye yakın' },
  { value: 'DELAYED', label: 'Geciken' },
  { value: 'COMPLETED', label: 'Tamamlanan' },
]

/** Listenin süzgeci: durum, taşeron, imalat türü ve arama (ad, tür ya da taşeron). */
export interface BoardFilter {
  status: StatusFilter
  crewId: string | undefined
  trade: string | undefined
  query: string
}

export const EMPTY_FILTER: BoardFilter = {
  status: 'ALL',
  crewId: undefined,
  trade: undefined,
  query: '',
}

/** Üst özet kartları: aktif (bitmemiş), tamamlanan (ve oranı), geciken, son 24 saatte girişi olan. */
export interface BoardSummary {
  total: number
  active: number
  completed: number
  completedPercent: number
  delayed: number
  updatedToday: number
}

export function boardSummary(items: ProductionItemView[], now = dayjs()): BoardSummary {
  const completed = items.filter((item) => item.status === 'COMPLETED').length
  const since = now.subtract(24, 'hour')
  return {
    total: items.length,
    active: items.length - completed,
    completed,
    completedPercent: items.length ? Math.round((completed / items.length) * 100) : 0,
    delayed: items.filter((item) => item.status === 'DELAYED').length,
    updatedToday: items.filter((item) => item.lastEntryAt && dayjs(item.lastEntryAt).isAfter(since))
      .length,
  }
}

export function statusCounts(items: ProductionItemView[]): Record<StatusFilter, number> {
  const counts = { ALL: items.length, IN_PROGRESS: 0, NEARLY_DONE: 0, DELAYED: 0, COMPLETED: 0 }
  items.forEach((item) => counts[item.status]++)
  return counts
}

const lower = (text: string) => text.toLocaleLowerCase('tr-TR')

/** Seçilen durum, taşeron ve türe uyuyor mu (seçilmeyen süzmez). */
function matchesChoices(item: ProductionItemView, filter: BoardFilter): boolean {
  return (
    (filter.status === 'ALL' || item.status === filter.status) &&
    (!filter.crewId || item.crew?.id === filter.crewId) &&
    (!filter.trade || item.trade === filter.trade)
  )
}

/** Arama adında, türünde ya da taşeronunda geçiyor mu; büyük-küçük harf Türkçe kurala göre (İ/i, I/ı). */
function matchesQuery(item: ProductionItemView, query: string): boolean {
  const wanted = lower(query.trim())
  return !wanted || lower([item.name, item.trade, item.crew?.name ?? ''].join(' ')).includes(wanted)
}

const matches = (item: ProductionItemView, filter: BoardFilter) =>
  matchesChoices(item, filter) && matchesQuery(item, filter.query)

/** Süzülen imalatlar; biten işler sona iner (sürenler üstte kalır), gerisi açıldığı sırada. */
export function visibleItems(
  items: ProductionItemView[],
  filter: BoardFilter,
): ProductionItemView[] {
  const shown = items.filter((item) => matches(item, filter))
  return [
    ...shown.filter((item) => item.status !== 'COMPLETED'),
    ...shown.filter((item) => item.status === 'COMPLETED'),
  ]
}

/** Süzgeçteki seçenekler, listedeki imalatlardan: türler ve taşeronlar, alfabetik. */
export function filterOptions(items: ProductionItemView[]) {
  const trades = [...new Set(items.map((item) => item.trade))].sort((a, b) =>
    a.localeCompare(b, 'tr'),
  )
  const crews = new Map(
    items.flatMap((item) => (item.crew ? [[item.crew.id, item.crew.name] as const] : [])),
  )
  return {
    trades,
    crews: [...crews]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr')),
  }
}

/** "Son günlük girişler" tablosunun satırı: giriş ve imalatı (silinmiş imalatın girişi gelmez). */
export interface RecentRow {
  entry: ProductionEntryView
  item: ProductionItemView
}

export function recentRows(
  entries: ProductionEntryView[],
  items: ProductionItemView[],
): RecentRow[] {
  const byId = new Map(items.map((item) => [item.id, item]))
  return entries.flatMap((entry) => {
    const item = byId.get(entry.itemId)
    return item ? [{ entry, item }] : []
  })
}
