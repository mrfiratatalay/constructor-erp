import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { homeOf } from '@/core/auth/homeRoute'
import { sessionContextQuery } from '@/core/auth/sessionContext'
import { fullDate } from '@/core/format/dates'
import { useWorkspace } from '@/core/tenant/useWorkspace'

const TITLES: Record<string, string> = {
  SUBSCRIPTION_EXPIRED: 'Aboneliğinizin süresi doldu',
  SUBSCRIPTION_SUSPENDED: 'Aboneliğiniz askıya alındı',
  SUBSCRIPTION_CANCELLED: 'Aboneliğiniz iptal edildi',
  SUBSCRIPTION_NOT_STARTED: 'Aboneliğiniz henüz başlamadı',
  NO_SUBSCRIPTION: 'Etkin bir abonelik yok',
  COMPANY_SUSPENDED: 'Firmanızın hesabı askıya alındı',
  COMPANY_ARCHIVED: 'Firmanızın hesabı arşivlendi',
}

const CONTACT = 'Hesabınızı yeniden açmak için Constructor ERP ekibiyle iletişime geçin.'

/** Başlık nedeni söyler; bu satır ne yapılacağını. */
const HINTS: Record<string, string> = {
  SUBSCRIPTION_EXPIRED: 'Abonelik yenilendiğinde kaldığınız yerden devam edersiniz.',
  SUBSCRIPTION_SUSPENDED: CONTACT,
  SUBSCRIPTION_CANCELLED: CONTACT,
  SUBSCRIPTION_NOT_STARTED: 'Dönem başladığında çalışma alanınız kendiliğinden açılır.',
  NO_SUBSCRIPTION: 'Aboneliği başlatmak için Constructor ERP ekibiyle görüşün.',
  COMPANY_SUSPENDED: CONTACT,
  COMPANY_ARCHIVED: CONTACT,
}

/**
 * Kilit ekranının beyni: neden kapalı, hangi paket ne zaman bitti, ne yapılabilir. Veri silinmez; "Tekrar dene"
 * bağlamı yeniler, abonelik uzatıldıysa kişi kaldığı yerden devam eder.
 */
export function useLockedWorkspace() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const workspaceState = useWorkspace()
  const access = workspaceState.access

  const title = computed(() => TITLES[access.value?.lockReason ?? ''] ?? 'Çalışma alanı şu an kapalı')
  const hint = computed(() => HINTS[access.value?.lockReason ?? ''] ?? access.value?.lockMessage ?? CONTACT)
  const detail = computed(() => {
    const value = access.value
    if (!value?.planName || !value.endsOn) return null
    return `${value.planName} paketi · dönem sonu ${fullDate(value.endsOn)}`
  })

  async function retry() {
    const context = await queryClient.fetchQuery({ ...sessionContextQuery, staleTime: 0 })
    await router.replace({ name: homeOf(context) })
  }

  return { ...workspaceState, title, hint, detail, retry }
}
