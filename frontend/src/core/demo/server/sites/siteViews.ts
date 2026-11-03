import type { MemberViewRole, SiteEventView, SiteLead, SiteView } from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import { notFound } from '@/core/demo/server/demoError'
import { companyPeople, personName, requireMember, type Member } from '@/core/demo/server/demoSession'
import type { PersonRecord } from '@/core/demo/server/people/peopleRecords'
import type { SiteEventRecord, SiteRecord } from './siteRecords'

const leadOf = (person: PersonRecord): SiteLead => ({ id: person.id, fullName: person.fullName, phone: person.phone })

/** Herkes her şantiyededir: katılımcılar firmanın etkin kişileridir, rolüne göre gruplanır. */
export function siteViewOf(site: SiteRecord): SiteView {
  const people = companyPeople(site.companyId).sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
  const withRole = (role: MemberViewRole) => people.filter((person) => person.role === role).map(leadOf)
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    status: site.status,
    leads: withRole('SITE_LEAD'),
    owners: withRole('OWNER'),
    storekeepers: withRole('WAREHOUSE'),
    workers: withRole('WORKER'),
    photoUrl: site.photoUrl,
    photoThumbnailUrl: site.photoThumbnailUrl,
  }
}

export function siteEventViewOf(event: SiteEventRecord): SiteEventView {
  return {
    id: event.id,
    siteId: event.siteId,
    kind: event.kind,
    actorId: event.actorId,
    actorName: event.actorId ? personName(event.actorId) : null,
    subjectId: event.subjectId,
    subjectName: event.subjectId ? personName(event.subjectId) : null,
    createdAt: event.createdAt,
  }
}

/** Şantiye firmanın değilse yokmuş gibi davranılır (404): başka firmanın şantiyesinin varlığı bile sızmaz. */
export function requireSite(siteId: string): { member: Member; site: SiteRecord } {
  const member = requireMember()
  const site = db().sites.find((candidate) => candidate.id === siteId && candidate.companyId === member.company.id)
  if (!site) throw notFound('Şantiye')
  return { member, site }
}

export function seenAt(siteId: string, personId: string): string | null {
  return db().visits.find((visit) => visit.siteId === siteId && visit.personId === personId)?.seenAt ?? null
}

/** Kişi şantiyeyi açtı: okunmamışlar sıfırlanır, mesajlardaki tikler maviye döner. Önceki ziyaret döner. */
export function markSeen(siteId: string, personId: string, at: string): string | null {
  const visit = db().visits.find((candidate) => candidate.siteId === siteId && candidate.personId === personId)
  const previous = visit?.seenAt ?? null
  if (visit) visit.seenAt = at
  else db().visits.push({ siteId, personId, seenAt: at })
  return previous
}
