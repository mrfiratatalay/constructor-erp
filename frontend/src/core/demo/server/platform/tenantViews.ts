import type {
  OnboardingInviteView,
  PaymentView,
  SubscriptionView,
  TenantDetail,
  TenantMemberRow,
  TenantRow,
} from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import { notFound } from '@/core/demo/server/demoError'
import { companyById, personName } from '@/core/demo/server/demoSession'
import type { CompanyRecord } from '@/core/demo/server/people/peopleRecords'
import type { OnboardingInviteRecord, SubscriptionRecord } from './platformRecords'
import { accessOf, currentSubscription, planById, stateOf } from './subscriptions'

export function requireCompany(companyId: string): CompanyRecord {
  const company = companyById(companyId)
  if (!company) throw notFound('Firma')
  return company
}

const peopleOf = (companyId: string) => db().people.filter((person) => person.companyId === companyId)

/** Demo firmasının sayıları canlı hesaplanır; içi boş örnek firmalarınki kayıtlı rakamlardan gelir. */
function usage(company: CompanyRecord): Pick<TenantRow, 'siteCount' | 'lastActivityAt'> {
  if (company.figures) return { siteCount: company.figures.sites, lastActivityAt: company.figures.lastActivityAt }
  const posts = db().posts.filter((post) => post.companyId === company.id)
  const lastActivityAt = posts.reduce<string | null>((latest, post) => (post.createdAt > (latest ?? '') ? post.createdAt : latest), null)
  return { siteCount: db().sites.filter((site) => site.companyId === company.id && site.status === 'ACTIVE').length, lastActivityAt }
}

export function tenantRowOf(company: CompanyRecord): TenantRow {
  const access = accessOf(company)
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    status: company.status,
    city: company.city,
    planName: access.planName ?? null,
    subscriptionState: access.subscriptionState ?? null,
    endsOn: access.endsOn ?? null,
    daysLeft: access.daysLeft ?? null,
    open: access.open,
    userCount: peopleOf(company.id).filter((person) => person.active).length,
    ...usage(company),
    setupCompleted: company.setupCompleted,
    createdAt: company.createdAt,
  }
}

function subscriptionViewOf(subscription: SubscriptionRecord): SubscriptionView {
  const { id, planId, status, startsOn, endsOn, priceSnapshot, currency, note, createdAt } = subscription
  const planName = planById(planId)?.name ?? 'Paket'
  return { id, planId, planName, status, state: stateOf(subscription), startsOn, endsOn, priceSnapshot, currency, note, createdAt }
}

function paymentsOf(companyId: string): PaymentView[] {
  return db()
    .platform.payments.filter((payment) => payment.companyId === companyId)
    .sort((a, b) => b.paidOn.localeCompare(a.paidOn))
    .map(({ id, subscriptionId, amount, currency, method, paidOn, description, createdById }) => (({
	id,
	subscriptionId,
	amount,
	currency,
	method,
	paidOn,
	description,
	createdByName: createdById ? personName(createdById) : null
})))
}

export function tenantDetailOf(company: CompanyRecord): TenantDetail {
  const subscriptions = db()
    .platform.subscriptions.filter((subscription) => subscription.companyId === company.id)
    .sort((a, b) => b.startsOn.localeCompare(a.startsOn))
  return {
    summary: tenantRowOf(company),
    phone: company.phone,
    email: company.email,
    logoUrl: company.logoUrl,
    lockReason: company.lockReason,
    currentSubscriptionId: currentSubscription(company.id)?.id ?? null,
    subscriptions: subscriptions.map(subscriptionViewOf),
    payments: paymentsOf(company.id),
  }
}

export function memberRowsOf(companyId: string): TenantMemberRow[] {
  return peopleOf(companyId).map((person) => ({
    userId: person.id,
    fullName: person.fullName,
    phone: person.phone,
    email: person.email,
    role: person.role ?? 'WORKER',
    active: person.active,
    createdAt: person.createdAt,
    lastSeenAt: person.lastSeenAt,
  }))
}

/** Süresi dolmak kaydedilmez, bitiş anından hesaplanır (backend'deki gibi). */
export function inviteViewOf(invite: OnboardingInviteRecord): OnboardingInviteView {
  const expired = invite.status === 'PENDING' && invite.expiresAt <= new Date().toISOString()
  return {
    id: invite.id,
    status: expired ? 'EXPIRED' : invite.status,
    createdAt: invite.createdAt,
    expiresAt: invite.expiresAt,
    usedAt: invite.usedAt,
    usedByName: invite.usedById ? personName(invite.usedById) : null,
    createdByName: invite.createdById ? personName(invite.createdById) : null,
  }
}
