import type { SiteToday } from '@/core/api/generated/model'
import { chatPreview, type ChatPreview } from '@/core/posts/postPreview'
import { eventLine } from '@/core/sites/siteEvents'

const time = (iso: string | null | undefined) => (iso ? Date.parse(iso) : 0)

/**
 * Listede sayılan en son şeyin zamanı: son mesaj ya da kuruluş satırı. Katıldı/çıkarıldı satırları sunucudan
 * gelmez: her şantiyeye birden düşerler, sayılsalardı bütün şantiyeler aynı anda en üste zıplardı.
 */
export function activityAt(site: SiteToday): string | null {
  const event = site.latestEvent?.createdAt ?? null
  return time(event) > time(site.lastPostAt) ? event : (site.lastPostAt ?? event)
}

/**
 * Şantiye listesi WhatsApp'ın sohbet listesidir: sabitlenenler en üstte (son sabitlenen önde), sonra akışında
 * en son bir şey olan. Sessizlik etiketi yok: bir şantiyenin ne zaman konuştuğunu satırdaki zaman söyler.
 */
export function sitesInListOrder(sites: SiteToday[]): SiteToday[] {
  const pinned = sites.filter((site) => site.pinnedAt).sort((a, b) => time(b.pinnedAt) - time(a.pinnedAt))
  const rest = sites.filter((site) => !site.pinnedAt).sort((a, b) => time(activityAt(b)) - time(activityAt(a)))
  return [...pinned, ...rest]
}

/**
 * Satırın alt yazısı, akıştaki son şey: son mesaj ("Sen: ✓✓ Demirci neden yok?") ya da ondan sonra olduysa
 * sistem satırı. Hiç mesajı olmayan şantiyede kuruluş satırı durur ("Patron şantiyeyi kurdu").
 */
export function sitePreview(site: SiteToday, viewerId?: string): ChatPreview | null {
  const event = site.latestEvent
  const eventIsNewer = event && time(event.createdAt) > time(site.lastPostAt)
  if (site.latestPost && !eventIsNewer) return chatPreview(site.latestPost, viewerId)
  return event ? { author: null, text: eventLine(event, viewerId), tick: null } : null
}
