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
  return form.phone.replace(/\D/g, '').length >= 10 ? null : 'Size ulaşabileceğimiz bir telefon numarası yazın.'
}

/**
 * Tanıtım sitesindeki başvuru. POS olmadığı için satış buradan başlar: ekip arar, ödeme alınır, firma açılır.
 * Fiyat sayfasından gelen ?paket=kod seçili paketi doldurur.
 */
export function useSalesRequest(plans: () => PublicPlanView[]) {
  const route = useRoute()
  const form = reactive<SalesRequestForm>({
    companyName: '', contactName: '', phone: '', email: '', city: '', siteCount: null, planId: undefined, message: '', website: '',
  })
  watch(plans, (list) => {
    if (form.planId) return
    form.planId = list.find((plan) => plan.code === route.query.paket)?.id
  }, { immediate: true })

  const problem = ref<string | null>(null)
  const mutation = useSubmitSalesRequest()
  const submit = () => {
    problem.value = problemOf(form)
    if (problem.value) return
    mutation.mutate({ data: {
      ...form, email: blankToNull(form.email), city: blankToNull(form.city), message: blankToNull(form.message),
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
