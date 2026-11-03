import type { WorkspaceAccessView } from '@/core/api/generated/model'
import { daysBetween, today } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import type { CompanyRecord } from '@/core/demo/server/people/peopleRecords'
import type { PlanRecord, SubscriptionRecord } from './platformRecords'

/** Bugünün gözüyle abonelik (backend'deki SubscriptionState). Yalnızca ACTIVE çalışma alanını açar. */
export type SubscriptionState = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED'

const LOCK_MESSAGES: Record<string, string> = {
  COMPANY_SUSPENDED: 'Firmanızın hesabı askıya alındı. Constructor ERP ile iletişime geçin.',
  COMPANY_ARCHIVED: 'Firmanızın hesabı arşivlendi. Constructor ERP ile iletişime geçin.',
  NO_SUBSCRIPTION: 'Firmanızın etkin bir aboneliği yok. Aboneliği başlatmak için Constructor ERP ile görüşün.',
  SUBSCRIPTION_NOT_STARTED: 'Aboneliğiniz henüz başlamadı.',
  SUBSCRIPTION_EXPIRED:
    'Aboneliğinizin süresi doldu. Verileriniz duruyor; yenilendiğinde kaldığınız yerden devam edersiniz.',
  SUBSCRIPTION_SUSPENDED: 'Aboneliğiniz askıya alındı. Constructor ERP ile iletişime geçin.',
  SUBSCRIPTION_CANCELLED: 'Aboneliğiniz iptal edildi. Constructor ERP ile iletişime geçin.',
}

const LOCK_BY_STATE: Record<SubscriptionState, string | null> = {
  ACTIVE: null,
  SCHEDULED: 'SUBSCRIPTION_NOT_STARTED',
  EXPIRED: 'SUBSCRIPTION_EXPIRED',
  SUSPENDED: 'SUBSCRIPTION_SUSPENDED',
  CANCELLED: 'SUBSCRIPTION_CANCELLED',
}

export function stateOf(subscription: SubscriptionRecord, day = today()): SubscriptionState {
  if (subscription.status !== 'ACTIVE') return subscription.status
  if (day < subscription.startsOn) return 'SCHEDULED'
  return day > subscription.endsOn ? 'EXPIRED' : 'ACTIVE'
}

/** Bugünü kapsayan dönem; yoksa en son başlayan dönem. */
export function currentSubscription(companyId: string): SubscriptionRecord | undefined {
  const periods = db()
    .platform.subscriptions.filter((subscription) => subscription.companyId === companyId)
    .sort((a, b) => b.startsOn.localeCompare(a.startsOn))
  return periods.find((subscription) => stateOf(subscription) === 'ACTIVE') ?? periods[0]
}

export const planById = (planId: string): PlanRecord | undefined =>
  db().platform.plans.find((plan) => plan.id === planId)

export function planOf(companyId: string): PlanRecord | undefined {
  const subscription = currentSubscription(companyId)
  return subscription ? planById(subscription.planId) : undefined
}

function lockReasonOf(company: CompanyRecord, state: SubscriptionState | null): string | null {
  if (company.status === 'ARCHIVED') return 'COMPANY_ARCHIVED'
  if (company.status === 'SUSPENDED') return 'COMPANY_SUSPENDED'
  return state ? LOCK_BY_STATE[state] : 'NO_SUBSCRIPTION'
}

export function accessOf(company: CompanyRecord): WorkspaceAccessView {
  const subscription = currentSubscription(company.id)
  const state = subscription ? stateOf(subscription) : null
  const lockReason = lockReasonOf(company, state)
  return {
    open: lockReason === null,
    lockReason,
    lockMessage: lockReason ? LOCK_MESSAGES[lockReason] : null,
    planName: subscription ? (planById(subscription.planId)?.name ?? null) : null,
    subscriptionState: state,
    endsOn: subscription?.endsOn ?? null,
    daysLeft: subscription ? daysBetween(today(), subscription.endsOn) : null,
  }
}

/** Firmanın kullanabildiği modüller: erişim kapalıysa hiçbiri. */
export function featuresOf(company: CompanyRecord): string[] {
  if (!accessOf(company).open) return []
  return planOf(company.id)?.features ?? []
}
