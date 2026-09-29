import type { PaymentRequest, PaymentRequestMethod } from '@/core/api/generated/model'
import { todayIsoDate } from '@/core/format/dates'

/**
 * Alınan ödemenin formu (firma açarken, dönem uzatırken ve tek başına): POS yok, para elden ya da havaleyle alınır.
 * paid kapalıysa ödeme kaydedilmez (ör. önce dönem açılır, ödeme sonra gelir).
 */
export interface PaymentForm {
  paid: boolean
  amount: number
  method: PaymentRequestMethod
  paidOn: string
  description: string
}

export function emptyPayment(amount = 0, paid = true): PaymentForm {
  return { paid, amount, method: 'CASH', paidOn: todayIsoDate(), description: '' }
}

export function paymentRequestOf(form: PaymentForm, subscriptionId?: string): PaymentRequest | undefined {
  if (!form.paid || form.amount <= 0) return undefined
  const description = form.description.trim() || null
  return { amount: form.amount, method: form.method, paidOn: form.paidOn, description, subscriptionId }
}
