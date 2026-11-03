import type {
  AcceptInviteRequest,
  CurrentUserResponse,
  JoinInvite,
  JoinRequest,
  LoginRequest,
  SessionContextView,
  SwitchWorkspaceRequest,
} from '@/core/api/generated/model'
import { DEMO_PASSWORD } from '@/core/demo/demoMode'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError, forbidden, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { get, post } from '@/core/demo/server/demoRouter'
import { currentPerson, requireMember, requirePerson, signIn, signOut } from '@/core/demo/server/demoSession'
import type { CompanyRecord, PersonRecord } from './peopleRecords'
import { currentUserOf, sessionContextOf } from './sessionViews'

/** Demo hesaplarının hepsi aynı şifreyle girer; rol kartları da bu ucu kullanır. */
function login({ body }: DemoRequest): SessionContextView {
  const { email, password } = body as LoginRequest
  const typed = email.trim().toLocaleLowerCase('tr')
  const person = db().people.find((candidate) => candidate.active && candidate.email === typed)
  if (!person || password !== (person.password ?? DEMO_PASSWORD)) throw new DemoError(401, 'E-posta ya da şifre hatalı.')
  signIn(person)
  return sessionContextOf(person)
}

function context(): SessionContextView {
  return sessionContextOf(requirePerson())
}

function me(): CurrentUserResponse {
  const { person, company } = requireMember()
  return currentUserOf(person, company)
}

function switchWorkspace({ body }: DemoRequest): SessionContextView {
  const person = requirePerson()
  if ((body as SwitchWorkspaceRequest).companyId !== person.companyId) throw forbidden('Bu firmada üyeliğin yok.')
  return sessionContextOf(person)
}

/** Patronun gönderdiği tek kullanımlık giriş linki: açılınca o kişi olarak oturum açılır, link biter. */
function acceptInvite({ body }: DemoRequest): SessionContextView {
  const { token } = body as AcceptInviteRequest
  const person = db().people.find((candidate) => candidate.active && candidate.loginToken === token)
  if (!person) throw new DemoError(401, 'Bu giriş linki kullanılmış ya da süresi dolmuş.')
  person.loginToken = null
  signIn(person)
  return sessionContextOf(person)
}

function companyOfToken(token: string): CompanyRecord {
  const company = db().companies.find((candidate) => candidate.joinToken === token)
  if (!company) throw notFound('Katılma bağlantısı')
  return company
}

function joinInvite({ params }: DemoRequest): JoinInvite {
  const company = companyOfToken(params.token!)
  return { companyName: company.name, alreadyInside: currentPerson()?.companyId === company.id }
}

/** "Ahmet  yılmaz" → "Ahmet Yılmaz": sahada yazılan adlar listede düzgün dursun (backend'deki PersonNames). */
const tidyName = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toLocaleUpperCase('tr') + word.slice(1))
    .join(' ')

function newWorker(company: CompanyRecord, form: JoinRequest): PersonRecord {
  const fullName = tidyName(form.fullName ?? '')
  if (!fullName) throw badRequest('Adını yaz.')
  if ((form.phone ?? '').replace(/\D/g, '').length < 10) throw badRequest('Telefon numarası eksik ya da hatalı.')
  const createdAt = nowIso()
  const base = { companyId: company.id, email: null, platformAdmin: false, active: true, lastSeenAt: createdAt }
  const fresh = { id: newId(), fullName, phone: form.phone!.trim(), role: 'WORKER' as const, createdAt }
  return { ...base, ...fresh, loginToken: null, password: null }
}

/** Bağlantıyla katılan çalışan olur, bütün şantiyeleri görür; her şantiyenin sohbetine "katıldı" satırı düşer. */
function join({ params, body }: DemoRequest): void {
  const company = companyOfToken(params.token!)
  if (currentPerson()?.companyId === company.id) return
  const person = newWorker(company, body as JoinRequest)
  db().people.push(person)
  for (const site of db().sites.filter((candidate) => candidate.companyId === company.id)) {
    const event = { siteId: site.id, kind: 'MEMBER_JOINED' as const, actorId: person.id, subjectId: person.id }
    db().siteEvents.push({ ...event, id: newId(), createdAt: person.createdAt })
  }
  signIn(person)
}

export const authRoutes = [
  post('/api/auth/login', login),
  post('/api/auth/logout', () => signOut()),
  get('/api/auth/context', context),
  get('/api/auth/me', me),
  post('/api/auth/workspace', switchWorkspace),
  post('/api/auth/invites/accept', acceptInvite),
  get('/api/join/:token', joinInvite),
  post('/api/join/:token', join),
]
