import type { CrewRef, ProductionBoardView, ProductionDetailView } from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { crewsOf, entriesOf, productionMember, requireItem, requireSite, viewOf } from './productionLookups'
import type { ProductionEntryRecord, ProductionItemRecord } from './productionRecords'
import { entryViewOf } from './productionViews'

const RECENT_ENTRIES = 20

const openedFirst = (a: ProductionItemRecord, b: ProductionItemRecord) => a.createdAt.localeCompare(b.createdAt)

const newestFirst = (a: ProductionEntryRecord, b: ProductionEntryRecord) => b.createdAt.localeCompare(a.createdAt)

/** Geçmiş gün gün okunur: en yeni gün üstte; giriş, işin yapıldığı güne düşer (geçmiş güne de girilebilir). */
const latestDayFirst = (a: ProductionEntryRecord, b: ProductionEntryRecord) =>
  b.day.localeCompare(a.day) || newestFirst(a, b)

/**
 * Şantiyenin İlerleme sekmesi tek istekte: iş kalemleri (açıldıkları sırayla) ve en yeni 20 günlük giriş. Özet
 * kartları ve süzgeç bu listeden ekranda sayılır.
 */
export function getBoard({ params }: DemoRequest): ProductionBoardView {
  const member = productionMember('VIEW_PRODUCTION')
  const site = requireSite(member, params.siteId!)
  const crews = crewsOf(member.company.id)
  const items = db().production.items.filter((item) => item.siteId === site.id).sort(openedFirst)
  const recent = db().production.entries.filter((entry) => entry.siteId === site.id).sort(newestFirst)
  return {
    items: items.map((item) => viewOf(item, crews)),
    recentEntries: recent.slice(0, RECENT_ENTRIES).map(entryViewOf),
  }
}

/** İş kaleminin detayı ve bütün günlük girişleri. */
export function getItemDetail({ params }: DemoRequest): ProductionDetailView {
  const item = requireItem(productionMember('VIEW_PRODUCTION'), params.itemId!)
  return { item: viewOf(item), entries: entriesOf(item.id).sort(latestDayFirst).map(entryViewOf) }
}

/** Yeni iş kaleminde seçilebilecek taşeronlar: listede duran ekipler, Türkçe abece sırasıyla. */
export function listCrews(): CrewRef[] {
  const member = productionMember('VIEW_PRODUCTION')
  return [...crewsOf(member.company.id).values()]
    .filter((crew) => !crew.archived)
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
}
