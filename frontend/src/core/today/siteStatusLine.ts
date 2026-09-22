import type { SiteToday } from '@/core/api/generated/model'
import { daysAgo } from '@/core/format/dates'
import type { StatusTone } from '@/core/format/statusTone'
import { isSilent } from '@/core/today/siteRow'

export interface StatusLine {
  tone: StatusTone
  label: string
}

/** "2 açık sorun · en eskisi 3 gündür": sayı işi, yaş aciliyeti söyler. */
function issuesLine(site: SiteToday): StatusLine {
  const count = `${site.openIssues} açık sorun`
  const days = site.oldestOpenIssueAt ? daysAgo(site.oldestOpenIssueAt) : 0
  if (days === 0) return { tone: 'danger', label: count }
  if (days === 1) return { tone: 'danger', label: `${count} · dünden beri` }
  const oldest = site.openIssues > 1 ? 'en eskisi ' : ''
  return { tone: 'danger', label: `${count} · ${oldest}${days} gündür` }
}

function silenceLine(site: SiteToday): StatusLine {
  if (!site.lastPostAt) return { tone: 'warning', label: 'Henüz hiç haber gelmedi' }
  const days = daysAgo(site.lastPostAt)
  return { tone: 'warning', label: days <= 1 ? 'Dünden beri haber yok' : `${days} gündür haber yok` }
}

/** Satırdaki tek durum; sakin şantiyede yoktur (iyi haber sessizdir). */
export function siteStatusLine(site: SiteToday): StatusLine | null {
  if (site.openIssues > 0) return issuesLine(site)
  if (isSilent(site)) return silenceLine(site)
  if (site.noNewsToday) return { tone: 'neutral', label: 'Bugün henüz haber yok' }
  return null
}
