import type { CurrentUserResponse, MemberViewRole, SiteLead, SiteView } from '@/core/api/generated/model'
import { firstName } from '@/core/format/names'
import { ROLE_LABELS } from '@/core/team/roles'

export interface Participant {
  id: string
  fullName: string
  /** Kişinin kendisi "Sen" diye yazılır (WhatsApp'taki grup bilgisi gibi). */
  name: string
  role: MemberViewRole
  roleLabel: string
  phone: string | null
  isViewer: boolean
}

/** Çalışanın etiketi yazılmaz: WhatsApp'ta da yalnızca yöneticinin etiketi olur, kişilerin çoğu çalışandır. */
const participantOf = (person: SiteLead, role: MemberViewRole, viewerId: string | undefined): Participant => ({
  id: person.id,
  fullName: person.fullName,
  name: person.id === viewerId ? 'Sen' : person.fullName,
  role,
  roleLabel: role === 'WORKER' ? '' : ROLE_LABELS[role],
  phone: person.phone ?? null,
  isViewer: person.id === viewerId,
})

/**
 * Şantiyenin katılımcıları: firmanın bütün kişileri (herkes her şantiyededir), bakan kişi en üstte "Sen" olarak,
 * sonra patronlar, şefler, depo sorumluları ve çalışanlar. Rol etiketi firmadaki rolüdür (Patron / Şef / Depo
 * sorumlusu).
 */
export function siteParticipants(site: SiteView, viewer: CurrentUserResponse | undefined): Participant[] {
  const people = [
    ...site.owners.map((owner) => participantOf(owner, 'OWNER', viewer?.id)),
    ...site.leads.map((lead) => participantOf(lead, 'SITE_LEAD', viewer?.id)),
    ...site.storekeepers.map((keeper) => participantOf(keeper, 'STOREKEEPER', viewer?.id)),
    ...site.workers.map((worker) => participantOf(worker, 'WORKER', viewer?.id)),
  ]
  return [...people.filter((person) => person.isViewer), ...people.filter((person) => !person.isViewer)]
}

/** Başlığın altındaki satır, WhatsApp'taki gibi ilk adlar ve en sonda "Sen": "Musa, Ahmet, Sen". */
export function participantLine(site: SiteView, viewer: CurrentUserResponse | undefined): string {
  const others = siteParticipants(site, viewer).filter((person) => !person.isViewer)
  return [...others.map((person) => firstName(person.fullName)), ...(viewer ? ['Sen'] : [])].join(', ')
}

/** Başlıktaki 📞 ile aranabilecek biri: adı, firmadaki rolü, numarası. */
export interface Callable {
  id: string
  fullName: string
  role: string
  phone: string
}

/** Başlıktaki 📞'nun listesi: numarası olan katılımcılar, patronlar önde; kişi kendini aramaz. */
export function callablePeople(site: SiteView, viewer: CurrentUserResponse | undefined): Callable[] {
  return siteParticipants(site, viewer).flatMap(({ id, fullName, roleLabel, phone, isViewer }) =>
    phone && !isViewer ? [{ id, fullName, role: roleLabel, phone }] : [],
  )
}

/** Düğmenin yazısı ne yapacağını söyler: tek kişide "Musa" (doğrudan arar), birden fazlada "Ara" (liste açar). */
export function callLabel(people: Callable[]): string {
  return people.length === 1 ? firstName(people[0]!.fullName) : 'Ara'
}
