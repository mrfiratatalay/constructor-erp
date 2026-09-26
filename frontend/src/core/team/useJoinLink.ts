import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getGetJoinLinkQueryKey, useGetJoinLink, useResetJoinLink } from '@/core/api/generated/join/join'
import { useCurrentUser } from '@/core/auth/currentUser'

/** WhatsApp kişi ya da grup seçtirerek açılır: bağlantı şantiyenin WhatsApp grubuna atılır. */
export function joinShareUrl(companyName: string, url: string): string {
  const message = `Merhaba, ${companyName} şantiyelerine katılmak için bu bağlantıya dokun, adını ve numaranı yaz: ${url}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

/**
 * Firmaya katılma bağlantısı (WhatsApp'taki grup bağlantısı): tek ve süresiz; tıklayan adını ve numarasını yazıp
 * katılır, bütün şantiyeleri görür. Firmadaki herkes görür ve paylaşır: çalışan da yeni gelen arkadaşını getirir.
 * Sıfırlamak yalnızca patronda: herkesin elindeki bağlantıyı öldürür. Pencere açılınca yüklenir: tarayıcı, bir
 * isteği bekledikten sonra açılan pencereyi engeller; düğme hazır bir bağlantıyla WhatsApp'ı tek dokunuşta açar.
 */
export function useJoinLink(open: MaybeRefOrGetter<boolean>) {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const link = useGetJoinLink({ query: { enabled: computed(() => toValue(open)) } })
  const reset = useResetJoinLink({
    mutation: { onSuccess: (fresh) => queryClient.setQueryData(getGetJoinLinkQueryKey(), fresh) },
  })

  const url = computed(() => link.data.value?.url ?? null)
  const shareUrl = computed(() => (url.value && user.value ? joinShareUrl(user.value.companyName, url.value) : null))
  return {
    url,
    shareUrl,
    canReset: computed(() => user.value?.role === 'OWNER'),
    reset: () => reset.mutateAsync(),
    isResetting: reset.isPending,
  }
}
