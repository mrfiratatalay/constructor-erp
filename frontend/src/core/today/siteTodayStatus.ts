import type { SiteToday } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'
import type { StatusTone } from '@/core/format/statusTone'

/** Şantiye kartındaki tek durum: en önemli olan gösterilir (sorun > haber yok > son haber). */
export function siteTodayStatus(site: SiteToday): { tone: StatusTone; label: string } {
  if (site.openIssues > 0) return { tone: 'danger', label: `${site.openIssues} açık sorun` }
  if (site.noNewsToday) return { tone: 'warning', label: 'Bugün haber yok' }
  return { tone: 'success', label: `Son haber ${clockTime(site.lastPostAt!)}` }
}
