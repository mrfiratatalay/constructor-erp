import type {
  ChangeTenantStatusRequest,
  CreateTenantRequest,
  OnboardingInviteView,
  OnboardingLink,
  TenantCreated,
  TenantDetail,
  TenantRow,
  UpdateTenantRequest,
} from '@/core/api/generated/model'
import { at, nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest } from '@/core/demo/server/demoError'
import { newId, newToken } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { get, post, put } from '@/core/demo/server/demoRouter'
import { requirePlatformAdmin } from '@/core/demo/server/demoSession'
import type { CompanyRecord } from '@/core/demo/server/people/peopleRecords'
import { recentAudit, recordAudit, STATUS_NAMES } from './platformAudit'
import { billingRoutes, openPeriod, recordPaymentOf } from './tenantBilling'
import { inviteViewOf, memberRowsOf, requireCompany, tenantDetailOf, tenantRowOf } from './tenantViews'

const INVITE_DAYS = 14

function listTenants(): TenantRow[] {
  requirePlatformAdmin()
  return [...db().companies].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(tenantRowOf)
}

/** Yeni link üretilince bekleyen eskisi iptal olur: ortada aynı firmayı kurabilecek iki link kalmaz. */
export function issueInvite(companyId: string, actorId: string): OnboardingLink {
  for (const old of db().platform.onboardingInvites.filter((invite) => invite.companyId === companyId)) {
    if (old.status === 'PENDING') old.status = 'REVOKED'
  }
  const invite = { id: newId(), companyId, token: newToken(), status: 'PENDING' as const, createdAt: nowIso() }
  const record = { ...invite, expiresAt: at(INVITE_DAYS, '23:59'), usedAt: null, usedById: null, createdById: actorId }
  db().platform.onboardingInvites.push(record)
  recordAudit('INVITE_CREATED', companyId, 'Kurulum linki üretildi', actorId)
  return { inviteId: record.id, url: `${location.origin}/kurulum/${record.token}`, expiresAt: record.expiresAt }
}

function newCompany(form: CreateTenantRequest): CompanyRecord {
  const name = form.name.trim()
  if (!name) throw badRequest('Firmanın adını yaz.')
  const slug = name.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[^a-z0-9]+/g, '-')
  const contact = { phone: form.phone ?? null, email: form.email ?? null, city: form.city ?? null }
  const state = { logoUrl: null, status: 'ACTIVE' as const, lockReason: null, setupCompleted: false }
  return { id: newId(), name, slug, ...contact, ...state, joinToken: newToken(), createdAt: nowIso() }
}

/** Satış kazanılınca: firma açılır, abonelik başlar, ödeme (varsa) yazılır, kurulum linki üretilir. */
function createTenant({ body }: DemoRequest): TenantCreated {
  const admin = requirePlatformAdmin()
  const form = body as CreateTenantRequest
  const company = newCompany(form)
  db().companies.push(company)
  recordAudit('TENANT_CREATED', company.id, `${company.name} firması açıldı`, admin.id)
  openPeriod({ companyId: company.id, planId: form.planId, months: form.months, startsOn: form.startsOn }, admin.id)
  if (form.payment) recordPaymentOf(company.id, form.payment, admin.id)
  const lead = db().platform.salesRequests.find((request) => request.id === form.salesRequestId)
  if (lead) Object.assign(lead, { status: 'WON', companyId: company.id })
  return { companyId: company.id, invite: issueInvite(company.id, admin.id) }
}

function updateTenant({ params, body }: DemoRequest): TenantDetail {
  const admin = requirePlatformAdmin()
  const company = requireCompany(params.companyId!)
  const form = body as UpdateTenantRequest
  if (!form.name.trim()) throw badRequest('Firmanın adını yaz.')
  Object.assign(company, { name: form.name.trim(), phone: form.phone ?? null, email: form.email ?? null, city: form.city ?? null })
  recordAudit('TENANT_UPDATED', company.id, 'Firma bilgileri güncellendi', admin.id)
  return tenantDetailOf(company)
}

/** Askıya almak ya da arşivlemek veriyi silmez; firma yeniden açılınca her şey yerinde. */
function changeStatus({ params, body }: DemoRequest): TenantDetail {
  const admin = requirePlatformAdmin()
  const company = requireCompany(params.companyId!)
  const form = body as ChangeTenantStatusRequest
  Object.assign(company, { status: form.status, lockReason: form.status === 'ACTIVE' ? null : (form.reason ?? null) })
  recordAudit('TENANT_STATUS_CHANGED', company.id, `Firma durumu: ${STATUS_NAMES[form.status]}`, admin.id)
  return tenantDetailOf(company)
}

function listInvites({ params }: DemoRequest): OnboardingInviteView[] {
  requirePlatformAdmin()
  return db()
    .platform.onboardingInvites.filter((invite) => invite.companyId === params.companyId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(inviteViewOf)
}

function revokeInvite({ params }: DemoRequest): void {
  const admin = requirePlatformAdmin()
  const invite = db().platform.onboardingInvites.find((item) => item.id === params.inviteId)
  if (!invite || invite.status !== 'PENDING') throw badRequest('Yalnızca bekleyen link iptal edilebilir.')
  invite.status = 'REVOKED'
  recordAudit('INVITE_REVOKED', invite.companyId, 'Kurulum linki iptal edildi', admin.id)
}

/** Platform uçlarının hepsi önce süper yöneticiyi ister; firma kimliği adresten gelir. */
function forCompany<T>(read: (companyId: string, adminId: string) => T) {
  return ({ params }: DemoRequest): T => {
    const admin = requirePlatformAdmin()
    return read(requireCompany(params.companyId!).id, admin.id)
  }
}

export const tenantRoutes = [
  get('/api/platform/tenants', listTenants),
  post('/api/platform/tenants', createTenant),
  get('/api/platform/tenants/:companyId', forCompany((companyId) => tenantDetailOf(requireCompany(companyId)))),
  put('/api/platform/tenants/:companyId', updateTenant),
  post('/api/platform/tenants/:companyId/status', changeStatus),
  get('/api/platform/tenants/:companyId/members', forCompany((companyId) => memberRowsOf(companyId))),
  get('/api/platform/tenants/:companyId/audit', forCompany((companyId) => recentAudit(100, companyId))),
  get('/api/platform/tenants/:companyId/invites', listInvites),
  post('/api/platform/tenants/:companyId/invites', forCompany(issueInvite)),
  post('/api/platform/tenants/:companyId/invites/:inviteId/revoke', revokeInvite),
  ...billingRoutes,
]
