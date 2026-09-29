import type { CreateTenantRequest, PlanAdminView } from '@/core/api/generated/model'
import { emptyPayment, paymentRequestOf, type PaymentForm } from '@/core/admin/paymentForm'
import { todayIsoDate } from '@/core/format/dates'

/** Manuel satış formu: firma, paket, dönem ve (alındıysa) ödeme. Tarihler "YYYY-MM-DD". */
export interface TenantForm {
  name: string
  phone: string
  email: string
  city: string
  planId: string
  months: number
  startsOn: string
  payment: PaymentForm
  salesRequestId: string | null
}

/** Başvurudan gelen firmada alanlar başvurudan dolar. */
export type TenantPrefill = Partial<Pick<TenantForm, 'name' | 'phone' | 'email' | 'city' | 'planId' | 'salesRequestId'>>

export function emptyTenantForm(plans: PlanAdminView[] = [], prefill: TenantPrefill = {}): TenantForm {
  const plan = plans.find((candidate) => candidate.id === prefill.planId)
    ?? plans.find((candidate) => candidate.highlighted) ?? plans[0]
  return {
    name: '', phone: '', email: '', city: '', salesRequestId: null, ...prefill,
    planId: plan?.id ?? '', months: 1, startsOn: todayIsoDate(), payment: emptyPayment(plan?.monthlyPrice ?? 0),
  }
}

/** Paket ve ay seçilince önerilen tutar: aylık fiyat × ay (teklifle satılan pakette 0, elle yazılır). */
export function suggestedAmount(plans: PlanAdminView[], planId: string, months: number): number {
  return (plans.find((plan) => plan.id === planId)?.monthlyPrice ?? 0) * months
}

const blank = (value: string) => (value.trim() ? value.trim() : null)

export function tenantRequestOf(form: TenantForm): CreateTenantRequest {
  return {
    name: form.name.trim(), phone: blank(form.phone), email: blank(form.email), city: blank(form.city),
    planId: form.planId, months: form.months, startsOn: form.startsOn || null,
    payment: paymentRequestOf(form.payment), salesRequestId: form.salesRequestId,
  }
}
