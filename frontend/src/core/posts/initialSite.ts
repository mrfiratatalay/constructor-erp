import type { SiteView } from '@/core/api/generated/model'
import { readLastSite } from '@/core/posts/lastSite'

/** Öncelik: adreste gelen şantiye, son gönderilen şantiye, kişinin tek şantiyesi. */
export function chooseInitialSite(sites: SiteView[], preferred: string | null): string | null {
  const visible = (id: string | null) => (id && sites.some((site) => site.id === id) ? id : null)
  return visible(preferred) ?? visible(readLastSite()) ?? (sites.length === 1 ? sites[0]!.id : null)
}
