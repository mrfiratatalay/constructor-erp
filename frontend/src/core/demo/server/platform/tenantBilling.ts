import type {
  ChangePlanRequest,
  ChangeSubscriptionStatusRequest,
  ExtendSubscriptionRequest,
  PaymentRequest,
  TenantDetail,
} from '@/core/api/generated/model'
import { addDays, nowIso, today } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { post } from '@/core/demo/server/demoRouter'
import { requirePlatformAdmin } from '@/core/demo/server/demoSession'
import { recordAudit, STATUS_NAMES, trDate } from './platformAudit'
import type { SubscriptionRecord } from './platformRecords'
import { currentSubscription, planById } from './subscriptions'
import { requireCompany, tenantDetailOf } from './tenantViews'

/** '2026-11-03' + 12 ay → '2027-11-02': dönem başladığı günün bir gün öncesinde biter. */
export function periodEnd(startsOn: string, months: number): string {
  const end = new Date(Date.parse(`${startsOn}T12:00:00Z`))
  end.setUTCMonth(end.getUTCMonth() + months)
  return addDays(end.toISOString().slice(0, 10), -1)
}

/** Uzatma, sürmekte olan dönemin bittiği günün ertesinde başlar; dönem yoksa bugün. */
function nextStart(companyId: string): string {
  const current = currentSubscription(companyId)
  return current && current.endsOn >= today() ? addDays(current.endsOn, 1) : today()
}

export interface NewPeriod {
  companyId: string
  planId: string
  months: number
  startsOn?: string | null
  note?: string | null
}

/** Yeni abonelik dönemi; o dönemin aylık fiyatı paketin bugünkü fiyatıyla donar. */
export function openPeriod(period: NewPeriod, actorId: string): SubscriptionRecord {
  const plan = planById(period.planId)
  if (!plan) throw notFound('Paket')
  if (period.months < 1) throw badRequest('Süre en az bir ay olmalı.')
  const startsOn = period.startsOn || nextStart(period.companyId)
  const endsOn = periodEnd(startsOn, period.months)
  const base = { id: newId(), companyId: period.companyId, planId: plan.id, status: 'ACTIVE' as const, startsOn, endsOn }
  const record = { ...base, priceSnapshot: plan.monthlyPrice, currency: plan.currency, note: period.note ?? null, createdAt: nowIso() }
  db().platform.subscriptions.push(record)
  const summary = `Abonelik: ${plan.name}, ${period.months} ay (${trDate(startsOn)} – ${trDate(endsOn)})`
  recordAudit('SUBSCRIPTION_EXTENDED', period.companyId, summary, actorId)
  return record
}

/** Ödeme elden ya da havaleyle gelir; POS yok. Kaydı platform ekibi girer. */
export function recordPaymentOf(companyId: string, payment: PaymentRequest, actorId: string): void {
  if (!(payment.amount > 0)) throw badRequest('Tutar sıfırdan büyük olmalı.')
  const base = { id: newId(), companyId, subscriptionId: payment.subscriptionId ?? currentSubscription(companyId)?.id ?? null }
  const details = { amount: payment.amount, currency: 'TRY', method: payment.method, paidOn: payment.paidOn }
  db().platform.payments.push({ ...base, ...details, description: payment.description ?? null, createdById: actorId, createdAt: nowIso() })
  const summary = `Ödeme alındı: ${payment.amount} TL (${STATUS_NAMES[payment.method]}, ${trDate(payment.paidOn)})`
  recordAudit('PAYMENT_RECORDED', companyId, summary, actorId)
}

function requireSubscription(companyId: string, subscriptionId: string): SubscriptionRecord {
  const found = db().platform.subscriptions.find((item) => item.id === subscriptionId && item.companyId === companyId)
  if (!found) throw notFound('Abonelik')
  return found
}

function extend({ params, body }: DemoRequest): TenantDetail {
  const admin = requirePlatformAdmin()
  const company = requireCompany(params.companyId!)
  const form = body as ExtendSubscriptionRequest
  openPeriod({ companyId: company.id, ...form }, admin.id)
  if (form.payment) recordPaymentOf(company.id, form.payment, admin.id)
  return tenantDetailOf(company)
}

function changePlan({ params, body }: DemoRequest): TenantDetail {
  const admin = requirePlatformAdmin()
  const company = requireCompany(params.companyId!)
  const subscription = requireSubscription(company.id, params.subscriptionId!)
  const plan = planById((body as ChangePlanRequest).planId)
  if (!plan) throw notFound('Paket')
  Object.assign(subscription, { planId: plan.id, priceSnapshot: plan.monthlyPrice })
  recordAudit('SUBSCRIPTION_PLAN_CHANGED', company.id, `Paket değişti: ${plan.name}`, admin.id)
  return tenantDetailOf(company)
}

function changeSubscriptionStatus({ params, body }: DemoRequest): TenantDetail {
  const admin = requirePlatformAdmin()
  const company = requireCompany(params.companyId!)
  const subscription = requireSubscription(company.id, params.subscriptionId!)
  subscription.status = (body as ChangeSubscriptionStatusRequest).status
  recordAudit('SUBSCRIPTION_STATUS_CHANGED', company.id, `Abonelik ${STATUS_NAMES[subscription.status]}`, admin.id)
  return tenantDetailOf(company)
}

function payment({ params, body }: DemoRequest): TenantDetail {
  const admin = requirePlatformAdmin()
  const company = requireCompany(params.companyId!)
  recordPaymentOf(company.id, body as PaymentRequest, admin.id)
  return tenantDetailOf(company)
}

export const billingRoutes = [
  post('/api/platform/tenants/:companyId/subscriptions', extend),
  post('/api/platform/tenants/:companyId/subscriptions/:subscriptionId/plan', changePlan),
  post('/api/platform/tenants/:companyId/subscriptions/:subscriptionId/status', changeSubscriptionStatus),
  post('/api/platform/tenants/:companyId/payments', payment),
]
