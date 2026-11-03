import type {
  CurrentUserResponse,
  MemberView,
  MemberViewRole,
  SessionContextView,
  WorkspaceView,
} from '@/core/api/generated/model'
import { companyById } from '@/core/demo/server/demoSession'
import { accessOf, featuresOf } from '@/core/demo/server/platform/subscriptions'
import type { CompanyRecord, PersonRecord } from './peopleRecords'
import { permissionsOf } from './permissions'

function workspaceOf(company: CompanyRecord, role: MemberViewRole): WorkspaceView {
  const features = featuresOf(company)
  return {
    companyId: company.id,
    name: company.name,
    slug: company.slug,
    logoUrl: company.logoUrl,
    phone: company.phone,
    email: company.email,
    role,
    permissions: permissionsOf(role, features),
    features,
    access: accessOf(company),
  }
}

/** Oturumun bağlamı: arayüzün rol, izin, modül ve kilit kararlarını verdiği tek kaynak (gerçek backend'deki gibi). */
export function sessionContextOf(person: PersonRecord): SessionContextView {
  const user = { id: person.id, fullName: person.fullName, email: person.email, platformAdmin: person.platformAdmin }
  const company = companyById(person.companyId)
  if (!company || !person.role) return { user, workspaces: [] }
  const option = { companyId: company.id, name: company.name, logoUrl: company.logoUrl, role: person.role }
  return { user, workspaces: [option], workspace: workspaceOf(company, person.role) }
}

export function currentUserOf(person: PersonRecord, company: CompanyRecord): CurrentUserResponse {
  const role = person.role ?? 'WORKER'
  return {
    id: person.id,
    fullName: person.fullName,
    role,
    companyName: company.name,
    permissions: permissionsOf(role, featuresOf(company)),
  }
}

export function memberViewOf(person: PersonRecord): MemberView {
  return { id: person.id, fullName: person.fullName, phone: person.phone, role: person.role ?? 'WORKER', active: person.active }
}
