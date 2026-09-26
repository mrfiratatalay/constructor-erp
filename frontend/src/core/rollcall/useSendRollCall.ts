import { useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useOpenTodaysRollCall } from '@/core/api/generated/roll-calls/roll-calls'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/**
 * Sohbetteki ＋ → Yoklama: şantiyenin bugünkü yoklama mesajı atılır; bugün zaten atıldıysa aynısı döner. Akış
 * tazelendikten sonra mesajın kimliği döner: sayfa oraya gider, şef mesajın zaten atıldığını orada görür.
 */
export function useSendRollCall(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const open = useOpenTodaysRollCall({ mutation: { onSuccess: () => refreshPostViews(queryClient, toValue(siteId)) } })
  return {
    send: async () => (await open.mutateAsync({ siteId: toValue(siteId) })).id,
    isSending: open.isPending,
  }
}
