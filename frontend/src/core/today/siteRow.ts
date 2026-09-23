import type { SiteToday } from '@/core/api/generated/model'
import { postPreview } from '@/core/posts/postPreview'
import { leadNames } from '@/core/sites/siteNames'

/**
 * Şantiye listesi WhatsApp'ın sohbet listesidir: son haber gelen üstte. Yoğunluk kademesi, sessizlik
 * etiketi ve "dikkat" sıralaması yok — bir satırın ne zaman konuştuğunu saatin kendisi söyler
 * ("Dün 17:40", "12 Eyl"), ikinci kez etiketle söylemek gürültüdür.
 */
export function sitesByRecency(sites: SiteToday[]): SiteToday[] {
  return [...sites].sort((a, b) => (b.lastPostAt ?? '').localeCompare(a.lastPostAt ?? ''))
}

/**
 * Satırın alt yazısı: son gönderinin ilk satırı ("Ahmet: Demir gelmedi"), gönderi yoksa sorumlusu.
 * Sorumlu da yoksa satır susar: "henüz haber yok" gibi olumsuz bir cümle yazılmaz.
 */
export function sitePreview(site: SiteToday): string {
  if (site.latestPost) return postPreview(site.latestPost)
  return site.leads.length ? leadNames(site.leads) : ''
}
