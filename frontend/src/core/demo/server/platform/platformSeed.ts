import { addDays, at, daysBetween, today } from '@/core/demo/server/demoClock'
import type { DemoDatabase } from '@/core/demo/server/demoDb'
import type { CompanyRecord, PersonRecord } from '@/core/demo/server/people/peopleRecords'
import { fixedId, ID_GROUP, type Seed, type SeedContext } from '@/core/demo/server/seed/seedContext'
import { STATUS_NAMES, trDate } from './platformAudit'
import type { PlatformState } from './platformRecords'
import { OTHER_TENANTS, PLANS, SALES_REQUESTS, type OtherTenant } from './platformSeedData'
import { seedAudit } from './platformSeedAudit'

const G = ID_GROUP.platform

export const emptyPlatform = (): PlatformState => ({
  plans: [],
  subscriptions: [],
  payments: [],
  onboardingInvites: [],
  salesRequests: [],
  audit: [],
})

/** Demo sayfasındaki "Yeni firma kurulumunu dene" bu bekleyen kurulum linkini açar. */
export const DEMO_SETUP_TOKEN = 'demo-kurulum'

const planId = (code: string) => fixedId(G, PLANS.findIndex((plan) => plan.code === code) + 1)

interface Period {
  companyId: string
  plan: string
  days: [number, number]
  price: number | null
}

function addPeriod(draft: DemoDatabase, period: Period): string {
  const id = fixedId(G + 1, draft.platform.subscriptions.length + 1)
  const [start, end] = period.days
  draft.platform.subscriptions.push({
    id,
    companyId: period.companyId,
    planId: planId(period.plan),
    status: 'ACTIVE',
    startsOn: addDays(today(), start),
    endsOn: addDays(today(), end),
    priceSnapshot: period.price,
    currency: 'TRY',
    note: null,
    createdAt: at(start, '10:00'),
  })
  return id
}

interface Payment {
  companyId: string
  subscriptionId: string
  amount: number
  daysAgo: number
  description: string | null
}

function addPayment(draft: DemoDatabase, payment: Payment, adminId: string): void {
  const paidOn = addDays(today(), -payment.daysAgo)
  draft.platform.payments.push({
    id: fixedId(G + 2, draft.platform.payments.length + 1),
    ...payment,
    currency: 'TRY',
    method: 'BANK_TRANSFER',
    paidOn,
    createdById: adminId,
    createdAt: at(-payment.daysAgo, '10:05'),
  })
}

/** Atalay Yapı: üç aylık deneme döneminden sonra yıllık Professional. */
function seedOwnCompany(draft: DemoDatabase, context: SeedContext): void {
  const companyId = context.company.id
  const admin = context.people.admin.id
  const trial = addPeriod(draft, { companyId, plan: 'professional', days: [-120, -31], price: 4990 })
  const yearly = addPeriod(draft, { companyId, plan: 'professional', days: [-30, 334], price: 4990 })
  addPayment(draft, { companyId, subscriptionId: trial, amount: 14970, daysAgo: 120, description: 'Üç aylık başlangıç' }, admin)
  const description = `Yıllık ödeme, iki ay hediye (${STATUS_NAMES.BANK_TRANSFER})`
  addPayment(draft, { companyId, subscriptionId: yearly, amount: 49900, daysAgo: 30, description }, admin)
}

function companyOf(tenant: OtherTenant, index: number): CompanyRecord {
  const slug = tenant.name.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[^a-z0-9]+/g, '-')
  return {
    id: fixedId(ID_GROUP.otherCompany, index + 1),
    name: tenant.name,
    slug,
    phone: `0462 000 0${index} 00`,
    email: null,
    city: tenant.city,
    logoUrl: null,
    status: tenant.status,
    lockReason: tenant.lockReason,
    joinToken: `katilim-${index + 1}`,
    setupCompleted: tenant.setupCompleted,
    createdAt: at(-tenant.createdDaysAgo, '11:00'),
    figures: { users: tenant.people.length, sites: tenant.sites, lastActivityAt: tenant.sites ? at(-index, '17:20') : null },
  }
}

function peopleOf(tenant: OtherTenant, company: CompanyRecord, offset: number): PersonRecord[] {
  return tenant.people.map((fullName, index) => ({
    id: fixedId(ID_GROUP.otherCompany + 1, offset + index + 1),
    companyId: company.id,
    fullName,
    phone: `0500 000 3${offset % 10} ${String(10 + index)}`,
    email: null,
    role: index === 0 ? 'OWNER' : 'SITE_LEAD',
    platformAdmin: false,
    active: true,
    createdAt: company.createdAt,
    lastSeenAt: at(-1, '18:10'),
    loginToken: null,
    password: null,
  }))
}

function nextMonth(month: string): string {
  const date = new Date(Date.parse(`${month}-15T12:00:00Z`))
  date.setUTCMonth(date.getUTCMonth() + 1)
  return date.toISOString().slice(0, 7)
}

/** Aylık ödeyen firma her ayın başında öder (ilk ay dönemin başladığı gün); askıdaki yalnızca ilk ayı ödemiş. */
function paymentDays(tenant: OtherTenant): string[] {
  const start = addDays(today(), tenant.period[0])
  const end = addDays(today(), Math.min(tenant.period[1], 0)).slice(0, 7)
  const days: string[] = []
  for (let month = start.slice(0, 7); month <= end; month = nextMonth(month)) {
    days.push(month === start.slice(0, 7) ? start : `${month}-01`)
  }
  return tenant.status === 'SUSPENDED' ? days.slice(0, 1) : days.slice(-6)
}

/** Diğer firmalar: biri yakında bitiyor, biri süresi dolmuş, biri askıda, biri kurulum bekliyor. */
function seedOtherTenants(draft: DemoDatabase, context: SeedContext): void {
  OTHER_TENANTS.forEach((tenant, index) => {
    const company = companyOf(tenant, index)
    draft.companies.push(company)
    draft.people.push(...peopleOf(tenant, company, index * 5))
    const subscriptionId = addPeriod(draft, { companyId: company.id, plan: tenant.plan, days: tenant.period, price: tenant.price })
    if (!tenant.price || !tenant.setupCompleted) return
    for (const day of paymentDays(tenant)) {
      const payment = { companyId: company.id, subscriptionId, amount: tenant.price, description: 'Aylık ödeme' }
      addPayment(draft, { ...payment, daysAgo: daysBetween(day, today()) }, context.people.admin.id)
    }
  })
}

function seedInvite(draft: DemoDatabase, context: SeedContext): void {
  const pending = draft.companies.find((company) => !company.setupCompleted)
  if (!pending) return
  draft.platform.onboardingInvites.push({
    id: fixedId(G + 3, 1),
    companyId: pending.id,
    token: DEMO_SETUP_TOKEN,
    status: 'PENDING',
    createdAt: at(-2, '14:05'),
    expiresAt: at(12, '14:05'),
    usedAt: null,
    usedById: null,
    createdById: context.people.admin.id,
  })
}

function seedSalesRequests(draft: DemoDatabase): void {
  SALES_REQUESTS.forEach(({ plan, daysAgo, ...request }, index) => {
    const converted = request.status === 'WON' ? draft.companies.find((company) => company.name === request.companyName) : undefined
    const record = { ...request, planId: planId(plan), companyId: converted?.id ?? null, createdAt: at(-daysAgo, '15:30') }
    draft.platform.salesRequests.push({ id: fixedId(G + 4, index + 1), ...record })
  })
}

export const seedPlatform: Seed = (draft, context) => {
  draft.platform.plans = PLANS.map((plan, index) => ({ ...plan, id: fixedId(G, index + 1) }))
  seedOwnCompany(draft, context)
  seedOtherTenants(draft, context)
  seedInvite(draft, context)
  seedSalesRequests(draft)
  seedAudit(draft, context, trDate)
}
