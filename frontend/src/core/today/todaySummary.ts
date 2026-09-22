import type { TodayView } from '@/core/api/generated/model'
import { isSilent } from '@/core/today/siteRow'

/** danger: açık sorun var. warning: yalnızca sessiz şantiye var. calm: gün sürüyor. good: her şey yolunda. */
export type SummaryTone = 'danger' | 'warning' | 'calm' | 'good'

export interface TodaySummary {
  tone: SummaryTone
  text: string
  /** Cümle açık sorunlardan bahsediyorsa dokununca Sorunlar'a gider. */
  toIssues: boolean
}

function calmText(total: number, withNews: number): string {
  if (withNews === 0) return 'Bugün henüz haber gelmedi.'
  return `${withNews} şantiyeden haber geldi, ${total - withNews} şantiye bekleniyor.`
}

/** Başlığın altındaki tek cümle: "3 açık sorun · 2 şantiye sessiz". */
export function summarizeToday(today: TodayView): TodaySummary {
  const openIssues = today.totals.openIssues
  const silent = today.sites.filter((site) => isSilent(site)).length
  const alerts: string[] = []
  if (openIssues > 0) alerts.push(`${openIssues} açık sorun`)
  if (silent > 0) alerts.push(`${silent} şantiye sessiz`)
  if (alerts.length) {
    return { tone: openIssues > 0 ? 'danger' : 'warning', text: alerts.join(' · '), toIssues: openIssues > 0 }
  }

  const total = today.sites.length
  const withNews = today.sites.filter((site) => !site.noNewsToday).length
  if (withNews < total) return { tone: 'calm', text: calmText(total, withNews), toIssues: false }
  const everyone = total > 1 ? `${total} şantiyeden de haber geldi` : 'şantiyeden haber geldi'
  return { tone: 'good', text: `Bugün her şey yolunda — ${everyone}.`, toIssues: false }
}
