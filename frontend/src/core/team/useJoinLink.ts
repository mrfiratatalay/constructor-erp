import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getGetJoinLinkQueryKey, useGetJoinLink, useResetJoinLink } from '@/core/api/generated/join/join'
import { useCurrentUser } from '@/core/auth/currentUser'

/** WhatsApp kişi ya da grup seçtirerek açılır: patron bağlantıyı şantiyenin WhatsApp grubuna atar. */
export function joinShareUrl(companyName: string, url: string): string {
  const message = `Merhaba, ${companyName} şantiyelerine katılmak için bu bağlantıya dokun, adını ve numaranı yaz: ${url}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

/**
 * Firmaya katılma bağlantısı (WhatsApp'taki grup bağlantısı): tek ve süresiz; tıklayan adını ve numarasını yazıp
 * katılır, bütün şantiyeleri görür. Yalnızca patron görür. Pencere açılınca yüklenir: tarayıcı, bir isteği
 * bekledikten sonra açılan pencereyi engeller; düğme hazır bir bağlantıyla WhatsApp'ı tek dokunuşta açar.
 * Sıfırlanınca eski bağlantı çalışmaz; yenisi yerine yazılır.
 */
export function useJoinLink(open: MaybeRefOrGetter<boolean>) {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const enabled = computed(() => toValue(open) && user.value?.role === 'OWNER')
  const link = useGetJoinLink({ query: { enabled } })
  const reset = useResetJoinLink({
    mutation: { onSuccess: (fresh) => queryClient.setQueryData(getGetJoinLinkQueryKey(), fresh) },
  })

  const url = computed(() => link.data.value?.url ?? null)
  const shareUrl = computed(() => (url.value && user.value ? joinShareUrl(user.value.companyName, url.value) : null))
  return { url, shareUrl, reset: () => reset.mutateAsync(), isResetting: reset.isPending }
}
