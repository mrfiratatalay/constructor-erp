import type { MemberViewRole } from '@/core/api/generated/model'
import { db } from './demoDb'
import { DemoError, forbidden, unauthorized } from './demoError'
import type { CompanyRecord, PersonRecord } from './people/peopleRecords'
import { accessOf, featuresOf } from './platform/subscriptions'

/** Firmanın çalışma alanındaki kişi: gerçek backend'in CurrentUser'ı. */
export interface Member {
  person: PersonRecord
  company: CompanyRecord
  role: MemberViewRole
}

export const personById = (id: string | null | undefined): PersonRecord | undefined =>
  id ? db().people.find((person) => person.id === id) : undefined

export const personName = (id: string | null | undefined): string => personById(id)?.fullName ?? 'Eski çalışan'

export const companyById = (id: string | null | undefined): CompanyRecord | undefined =>
  id ? db().companies.find((company) => company.id === id) : undefined

export function currentPerson(): PersonRecord | null {
  const session = db().session
  const person = personById(session?.personId)
  return person?.active ? person : null
}

export function requirePerson(): PersonRecord {
  const person = currentPerson()
  if (!person) throw unauthorized()
  return person
}

/** Firma uçları için: oturum, üyelik ve açık çalışma alanı. Kapalıysa arayüz kilit ekranına geçer. */
export function requireMember(): Member {
  const person = requirePerson()
  const company = companyById(person.companyId)
  if (!company || !person.role) throw forbidden()
  if (!accessOf(company).open) throw new DemoError(403, 'Firmanın çalışma alanı kapalı.', 'WORKSPACE_LOCKED')
  return { person, company, role: person.role }
}

export function requireRole(...roles: MemberViewRole[]): Member {
  const member = requireMember()
  if (!roles.includes(member.role)) throw forbidden()
  return member
}

/** Modül firmanın paketinde değilse uç kapalıdır (backend'deki @RequiresFeature). */
export function requireFeature(feature: string): Member {
  const member = requireMember()
  if (!featuresOf(member.company).includes(feature)) throw forbidden('Bu modül firmanızın paketinde yok.')
  return member
}

export function requirePlatformAdmin(): PersonRecord {
  const person = requirePerson()
  if (!person.platformAdmin) throw forbidden()
  return person
}

export function signIn(person: PersonRecord): void {
  db().session = { personId: person.id }
}

export function signOut(): void {
  db().session = null
}

/** Firmanın etkin kişileri. */
export const companyPeople = (companyId: string): PersonRecord[] =>
  db().people.filter((person) => person.companyId === companyId && person.active)
