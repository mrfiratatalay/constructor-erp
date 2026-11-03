import type { CompleteSetupRequest, SessionContextView } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import { companyById, signIn } from '@/core/demo/server/demoSession'
import type { CompanyRecord, PersonRecord } from '@/core/demo/server/people/peopleRecords'
import { sessionContextOf } from '@/core/demo/server/people/sessionViews'
import { recordAudit } from './platformAudit'
import type { OnboardingInviteRecord } from './platformRecords'

// bcrypt şifrenin yalnızca ilk 72 baytını kullanır; Türkçe harf iki bayttır (backend'deki SetupOwners).
const MAX_PASSWORD_BYTES = 72

function newOwner(company: CompanyRecord, owner: CompleteSetupRequest['owner']): PersonRecord {
  const email = owner.email.trim().toLocaleLowerCase('tr')
  if (!owner.fullName.trim() || !email) throw badRequest('Adınızı ve e-postanızı yazın.')
  if (db().people.some((person) => person.email === email)) {
    throw badRequest('Bu e-posta ile kayıtlı bir hesap var. Başka bir e-posta yazın.')
  }
  if (new TextEncoder().encode(owner.password).length > MAX_PASSWORD_BYTES) {
    throw badRequest('Şifre en çok 72 karakter olabilir; Türkçe harfler (ç, ğ, ı, ö, ş, ü) iki karakter sayılır.')
  }
  const createdAt = nowIso()
  const identity = { id: newId(), companyId: company.id, fullName: owner.fullName.trim(), phone: null, email }
  const state = { role: 'OWNER' as const, platformAdmin: false, active: true, createdAt, lastSeenAt: createdAt }
  return { ...identity, ...state, loginToken: null, password: owner.password }
}

function firstSite(company: CompanyRecord, owner: PersonRecord, site: CompleteSetupRequest['firstSite']): void {
  if (!site?.name.trim()) return
  const createdAt = nowIso()
  const record = { id: newId(), companyId: company.id, name: site.name.trim(), address: site.address?.trim() || null }
  const state = { status: 'ACTIVE' as const, photoUrl: null, photoThumbnailUrl: null, createdAt, createdById: owner.id }
  db().sites.push({ ...record, ...state })
  db().siteEvents.push({ id: newId(), siteId: record.id, kind: 'CREATED', actorId: owner.id, subjectId: null, createdAt })
}

/**
 * Satın alan firmanın kendi kurulumu: firma bilgileri, patron hesabı ve ilk şantiye. Link bir kez kullanılır;
 * patron doğrudan kendi çalışma alanına girer.
 */
export function completeSetup(invite: OnboardingInviteRecord, form: CompleteSetupRequest): SessionContextView {
  const company = companyById(invite.companyId)
  if (!company) throw notFound('Firma')
  if (!form.company.name.trim()) throw badRequest('Firmanın adını yazın.')
  const owner = newOwner(company, form.owner)
  const contact = { phone: form.company.phone ?? null, email: form.company.email ?? null, city: form.company.city ?? null }
  Object.assign(company, { name: form.company.name.trim(), ...contact, setupCompleted: true })
  db().people.push(owner)
  firstSite(company, owner, form.firstSite)
  Object.assign(invite, { status: 'USED', usedAt: nowIso(), usedById: owner.id })
  recordAudit('SETUP_COMPLETED', company.id, `${company.name} kurulumu tamamladı (${owner.fullName})`, owner.id)
  signIn(owner)
  return sessionContextOf(owner)
}
