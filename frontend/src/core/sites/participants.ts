import type { CurrentUserResponse, SiteView } from '@/core/api/generated/model'
import { firstName } from '@/core/format/names'
import { ROLE_LABELS } from '@/core/team/roles'

export interface Participant {
  id: string
  /** Kişinin kendisi "Sen" diye yazılır (WhatsApp'taki grup bilgisi gibi). */
  name: string
  role: string
  phone: string | null
  isViewer: boolean
}

/**
 * Şantiyenin katılımcıları, bakan kişi en üstte "Sen" olarak. Patron şantiyelerin üyesi değildir ama her
 * grubun içindedir: patron bakıyorsa listenin başında o durur. Rol etiketi firmadaki rolüdür (Patron / Şef).
 */
export function siteParticipants(site: SiteView, viewer: CurrentUserResponse | undefined): Participant[] {
  const others = site.leads
    .filter((lead) => lead.id !== viewer?.id)
    .map((lead) => ({ id: lead.id, name: lead.fullName, role: ROLE_LABELS.SITE_LEAD, phone: lead.phone ?? null, isViewer: false }))
  if (!viewer) return others
  const self = { id: viewer.id, name: 'Sen', role: ROLE_LABELS[viewer.role], phone: null, isViewer: true }
  return [self, ...others]
}

/** Başlığın altındaki satır, WhatsApp'taki gibi ilk adlar ve en sonda "Sen": "Musa, Ahmet, Sen". */
export function participantLine(site: SiteView, viewer: CurrentUserResponse | undefined): string {
  const names = site.leads.filter((lead) => lead.id !== viewer?.id).map((lead) => firstName(lead.fullName))
  return [...names, ...(viewer ? ['Sen'] : [])].join(', ')
}

/** Başlıktaki 📞: kişi kendini aramaz; telefonu olan ilk katılımcı. */
export function firstCallable(site: SiteView, viewer: CurrentUserResponse | undefined) {
  return site.leads.find((lead) => lead.phone && lead.id !== viewer?.id) ?? null
}
