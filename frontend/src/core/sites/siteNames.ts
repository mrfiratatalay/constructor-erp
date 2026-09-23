import type { SiteLead, SiteView } from '@/core/api/generated/model'

/** "Çamlıca Konutları, Kartal B Blok" ya da boşsa tire. */
export function siteNames(siteIds: string[], sites: SiteView[]): string {
  const names = sites.filter((site) => siteIds.includes(site.id)).map((site) => site.name)
  return names.length > 0 ? names.join(', ') : '—'
}

/** Başlıkta ve satır önizlemesinde kullanılır; sorumlu yoksa ekran susar. */
export function leadNames(leads: SiteLead[]): string {
  return leads.map((lead) => lead.fullName).join(', ')
}
