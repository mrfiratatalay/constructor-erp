import type { MemberView, SiteView } from '@/core/api/generated/model'
import { timeAgo } from '@/core/format/dates'

/**
 * Listede ismin altındaki satır: kişinin şantiyeleri ("Namık Kemal, Kartal B Blok"). Patron her şantiyenin
 * içindedir. Şantiyesi yoksa satır boş kalır: olumsuz bilgi yer kaplamaz (TASARIM.md İlke 3).
 */
export function siteLine(member: MemberView, sites: SiteView[]): string {
  if (member.role === 'OWNER') return 'Patron'
  return sites.filter((site) => member.siteIds.includes(site.id)).map((site) => site.name).join(', ')
}

/** Kişi bilgisindeki durum, WhatsApp'ın sözüyle: "son görülme 2 saat önce"; linki hiç açmadıysa "Henüz girmedi". */
export function seenLine(member: MemberView): string {
  return member.lastSeenAt ? `son görülme ${timeAgo(member.lastSeenAt)}` : 'Henüz girmedi'
}
