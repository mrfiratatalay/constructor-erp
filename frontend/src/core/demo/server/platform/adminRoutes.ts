import type {
  FollowSalesRequest,
  MonthlyAmount,
  PlanAdminView,
  PlatformDashboardView,
  SalesRequestView,
  UpdatePlanRequest,
} from '@/core/api/generated/model'
import { today } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, notFound } from '@/core/demo/server/demoError'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { get, patch, put } from '@/core/demo/server/demoRouter'
import { companyById, requirePlatformAdmin } from '@/core/demo/server/demoSession'
import { FEATURES } from './features'
import { recentAudit, recordAudit } from './platformAudit'
import type { PlanRecord, SalesRequestRecord } from './platformRecords'
import { accessOf, currentSubscription, planById, stateOf } from './subscriptions'
import { tenantRowOf } from './tenantViews'

const EXPIRING_DAYS = 14
const MONTHS = 6

function planAdminViewOf(plan: PlanRecord): PlanAdminView {
  const activeTenants = db().companies.filter((company) => accessOf(company).open && currentSubscription(company.id)?.planId === plan.id).length
  return { ...plan, activeTenants }
}

const listPlans = (): PlanAdminView[] => db().platform.plans.map(planAdminViewOf)

/** Paketin modülleri değişince o paketteki bütün firmaların menüsü ve uçları da değişir. */
function updatePlan({ params, body }: DemoRequest): PlanAdminView[] {
  const admin = requirePlatformAdmin()
  const plan = planById(params.planId!)
  if (!plan) throw notFound('Paket')
  const form = body as UpdatePlanRequest
  if (!form.name.trim()) throw badRequest('Paketin adını yaz.')
  Object.assign(plan, { ...form, name: form.name.trim(), tagline: form.tagline ?? null })
  recordAudit('PLAN_UPDATED', null, `${plan.name} paketi güncellendi`, admin.id)
  return listPlans()
}

function salesViewOf(request: SalesRequestRecord): SalesRequestView {
  return {
    ...request,
    planName: request.planId ? (planById(request.planId)?.name ?? null) : null,
    convertedCompanyName: companyById(request.companyId)?.name ?? null,
  }
}

function followSalesRequest({ params, body }: DemoRequest): SalesRequestView {
  const admin = requirePlatformAdmin()
  const request = db().platform.salesRequests.find((item) => item.id === params.requestId)
  if (!request) throw notFound('Başvuru')
  const form = body as FollowSalesRequest
  Object.assign(request, { status: form.status, notes: form.notes ?? null })
  recordAudit('SALES_REQUEST_UPDATED', null, `${request.companyName} başvurusu: ${form.status}`, admin.id)
  return salesViewOf(request)
}

/** Son altı ayın tahsilatı; ödeme olmayan ay sıfırdır, grafikte boşluk kalmaz. */
function collections(): MonthlyAmount[] {
  const months = Array.from({ length: MONTHS }, (_, index) => {
    const date = new Date(Date.parse(`${today().slice(0, 7)}-15T12:00:00Z`))
    date.setUTCMonth(date.getUTCMonth() - (MONTHS - 1 - index))
    return date.toISOString().slice(0, 7)
  })
  return months.map((month) => ({
    month,
    amount: db().platform.payments.filter((payment) => payment.paidOn.startsWith(month)).reduce((sum, payment) => sum + payment.amount, 0),
  }))
}

/** Aylık tekrarlayan gelir: bugün açık olan dönemlerin aylık fiyatlarının toplamı. */
function monthlyRecurring(): number {
  return db()
    .companies.map((company) => currentSubscription(company.id))
    .filter((subscription) => subscription && stateOf(subscription) === 'ACTIVE')
    .reduce((sum, subscription) => sum + (subscription?.priceSnapshot ?? 0), 0)
}

function dashboard(): PlatformDashboardView {
  requirePlatformAdmin()
  const tenants = db().companies.map(tenantRowOf)
  const amounts = collections()
  const thisMonth = today().slice(0, 7)
  return {
    openTenants: tenants.filter((row) => row.open).length,
    lockedTenants: tenants.filter((row) => row.status === 'ACTIVE' && !row.open).length,
    suspendedTenants: tenants.filter((row) => row.status !== 'ACTIVE').length,
    newTenantsThisMonth: tenants.filter((row) => row.createdAt.startsWith(thisMonth)).length,
    pendingSetup: tenants.filter((row) => !row.setupCompleted).length,
    totalUsers: tenants.reduce((sum, row) => sum + row.userCount, 0),
    collectedThisMonth: amounts.at(-1)?.amount ?? 0,
    monthlyRecurring: monthlyRecurring(),
    newSalesRequests: db().platform.salesRequests.filter((request) => request.status === 'NEW').length,
    collections: amounts,
    expiringSoon: tenants
      .filter((row) => row.open && row.daysLeft != null && row.daysLeft <= EXPIRING_DAYS)
      .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0)),
    recentActivity: recentAudit(8),
  }
}

/** Platform okumaları yalnızca süper yöneticiye açık. */
function asAdmin<T>(read: (request: DemoRequest) => T) {
  return (request: DemoRequest): T => {
    requirePlatformAdmin()
    return read(request)
  }
}

const salesRequests = () =>
  [...db().platform.salesRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(salesViewOf)

export const adminRoutes = [
  get('/api/platform/dashboard', dashboard),
  get('/api/platform/plans', asAdmin(listPlans)),
  put('/api/platform/plans/:planId', updatePlan),
  get('/api/platform/features', asAdmin(() => FEATURES)),
  get('/api/platform/sales-requests', asAdmin(salesRequests)),
  patch('/api/platform/sales-requests/:requestId', followSalesRequest),
  get('/api/platform/audit', asAdmin(({ query }) => recentAudit(Number(query.get('limit') ?? 100)))),
]
