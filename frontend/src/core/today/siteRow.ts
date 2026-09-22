import type { SiteToday } from '@/core/api/generated/model'
import { currentHour } from '@/core/format/dates'

/** "Bugün haber yok" ancak bu saatten sonra uyarıdır: sabah hiçbir şantiyeden haber gelmemiştir. */
export const SILENT_AFTER_HOUR = 13

/**
 * Liste aşağı doğru daralır: geniş (okunmamış yeni haber: fotoğraflarıyla), orta (açık sorun ya da sessiz:
 * fotoğrafsız), tek satır (sakin). Fotoğraf görmediğin yeni şeydir; sorunu kırmızı etiket anlatır.
 */
export type SiteDensity = 'wide' | 'quiet' | 'compact'

export interface SiteRow {
  site: SiteToday
  density: SiteDensity
}

export function isSilent(site: SiteToday, hour = currentHour()): boolean {
  return site.noNewsToday && hour >= SILENT_AFTER_HOUR
}

function densityOf(site: SiteToday, hour: number): SiteDensity {
  if (site.unreadPosts > 0) return 'wide'
  return site.openIssues > 0 || isSilent(site, hour) ? 'quiet' : 'compact'
}

/** Orta yoğunlukta önizleme yalnızca sorunlu şantiyede: sessiz şantiyenin son haberi eskidir, yerine sorumlu yazılır. */
export function showsPreview(site: SiteToday, density: SiteDensity): boolean {
  return density === 'wide' || (density === 'quiet' && site.openIssues > 0)
}

/** Sıra: açık sorun, okunmamış haber, sessiz, sakin; her grup kendi içinde son habere göre. */
function rankOf(site: SiteToday, hour: number): number {
  if (site.openIssues > 0) return 0
  if (site.unreadPosts > 0) return 1
  return isSilent(site, hour) ? 2 : 3
}

const newestFirst = (a: SiteToday, b: SiteToday) => (b.lastPostAt ?? '').localeCompare(a.lastPostAt ?? '')

export function siteRows(sites: SiteToday[], hour = currentHour()): SiteRow[] {
  return [...sites]
    .sort((a, b) => rankOf(a, hour) - rankOf(b, hour) || newestFirst(a, b))
    .map((site) => ({ site, density: densityOf(site, hour) }))
}
