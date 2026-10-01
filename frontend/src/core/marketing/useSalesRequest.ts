import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { errorMessage } from '@/core/api/errors'
import { useSubmitSalesRequest } from '@/core/api/generated/public/public'
import type { PublicPlanView } from '@/core/api/generated/model'

export interface SalesRequestForm {
  companyName: string
  contactName: string
  phone: string
  email: string
  city: string
  siteCount: number | null
  planId: string | undefined
  message: string
  /** Bal küpü: insan görmez, bot doldurur. Dolu gelen başvuruyu sunucu sessizce yutar. */
  website: string
}

const blankToNull = (value: string) => (value.trim() ? value.trim() : null)

function problemOf(form: SalesRequestForm): string | null {
  if (!form.companyName.trim()) return 'Firmanızın adını yazın.'
  if (!form.contactName.trim()) return 'Adınızı yazın.'
  const phoneLength = form.phone.replace(/\D/g, '').length
  if (phoneLength < 10 || phoneLength > 15) return 'Size ulaşabileceğimiz bir telefon numarası yazın.'
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Geçerli bir e-posta adresi yazın.'
  return null
}

function useRequestForm(plans: () => PublicPlanView[]) {
  const route = useRoute()
  const form = reactive<SalesRequestForm>({
    companyName: '', contactName: '', phone: '', email: '', city: '', siteCount: null, planId: undefined, message: '', website: '',
  })
  watch(plans, (list) => {
    if (form.planId) return
    form.planId = list.find((plan) => plan.code === route.query.paket)?.id
  }, { immediate: true })
  return form
}

/** Başvuru, gerçek satış kuyruğuna gönderilir; paket seçimi fiyat sayfasındaki bağlantıdan gelir. */
export function useSalesRequest(plans: () => PublicPlanView[]) {
  const form = useRequestForm(plans)
  const problem = ref<string | null>(null)
  const mutation = useSubmitSalesRequest()
  // Uyarı açıkken alan düzeltilince uyarı yeniden değerlendirilir: sıradaki eksiği söyler ya da kalkar.
  watch(form, () => {
    if (problem.value) problem.value = problemOf(form)
    if (mutation.isError.value) mutation.reset()
  })
  const submit = () => {
    if (mutation.isPending.value || mutation.isSuccess.value) return
    problem.value = problemOf(form)
    if (problem.value) return
    mutation.mutate({ data: {
      ...form, companyName: form.companyName.trim(), contactName: form.contactName.trim(), phone: form.phone.trim(),
      email: blankToNull(form.email), city: blankToNull(form.city), message: blankToNull(form.message),
    } })
  }
  return {
    form,
    submit,
    isSending: mutation.isPending,
    isSent: mutation.isSuccess,
    problem: computed(() => problem.value ?? (mutation.error.value ? errorMessage(mutation.error.value) : null)),
  }
}
