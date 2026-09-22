import type { SiteToday } from '@/core/api/generated/model'

/** Dikkat isteyenler: açık sorunu olan ya da bugün hiç haber gelmeyen şantiyeler. */
export function needsAttention(site: SiteToday): boolean {
  return site.openIssues > 0 || site.noNewsToday
}

export function splitByAttention(sites: SiteToday[]): { attention: SiteToday[]; calm: SiteToday[] } {
  return {
    attention: sites.filter(needsAttention),
    calm: sites.filter((site) => !needsAttention(site)),
  }
}
