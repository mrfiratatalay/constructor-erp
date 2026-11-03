import type { CrewRef, ProductionItemView, WorkspaceViewPermissionsItem } from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import { notFound } from '@/core/demo/server/demoError'
import { requireFeature, type Member } from '@/core/demo/server/demoSession'
import { requirePermission } from '@/core/demo/server/people/permissions'
import type { SiteRecord } from '@/core/demo/server/sites/siteRecords'
import type { ProductionEntryRecord, ProductionItemRecord } from './productionRecords'
import { crewRefOf, itemViewOf } from './productionViews'

type ProductionPermission = Extract<WorkspaceViewPermissionsItem, 'VIEW_PRODUCTION' | 'MANAGE_PRODUCTION'>

/** Uçların kapısı: modül firmanın paketinde olmalı (@RequiresFeature), kişinin de izni (@PreAuthorize). */
export function productionMember(permission: ProductionPermission): Member {
  requireFeature('production')
  return requirePermission(permission)
}

/** Başka firmanın şantiyesi "bulunamadı" döner: varlığı bile belli edilmez. */
export function requireSite(member: Member, siteId: string): SiteRecord {
  const site = db().sites.find((candidate) => candidate.id === siteId && candidate.companyId === member.company.id)
  if (!site) throw notFound('Şantiye')
  return site
}

export function requireItem(member: Member, itemId: string): ProductionItemRecord {
  const item = db().production.items.find(
    (candidate) => candidate.id === itemId && candidate.companyId === member.company.id,
  )
  if (!item) throw notFound('İş kalemi')
  return item
}

export const entriesOf = (itemId: string): ProductionEntryRecord[] =>
  db().production.entries.filter((entry) => entry.itemId === itemId)

/**
 * Firmanın taşeron ekipleri: yoklamanın CREW satırları (firmada tek taşeron listesi). Listeden çıkmışlar da gelir:
 * eski iş kaleminin taşeronu adıyla görünmeye devam eder.
 */
export function crewsOf(companyId: string): Map<string, CrewRef> {
  const crews = db().puantaj.roster.filter((row) => row.companyId === companyId && row.kind === 'CREW')
  return new Map(crews.map((row) => [row.id, crewRefOf(row)]))
}

/** İş kaleminin ekrandaki hali. Çok kalem okunurken taşeronlar bir kez okunup verilir. */
export function viewOf(item: ProductionItemRecord, crews = crewsOf(item.companyId)): ProductionItemView {
  return itemViewOf(item, entriesOf(item.id), item.crewId ? crews.get(item.crewId) : undefined)
}
