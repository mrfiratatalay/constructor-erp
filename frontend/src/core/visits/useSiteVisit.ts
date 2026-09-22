import { useQueryClient } from '@tanstack/vue-query'
import { onScopeDispose, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { useVisitSite } from '@/core/api/generated/visits/visits'
import { TODAY_QUERY_PREFIX } from '@/core/today/useToday'

/**
 * Şantiye sayfası açılınca ziyareti yazar: ana ekrandaki okunmadı rozeti söner.
 * Önceki bakış zamanı "buradan yukarısı yeni" çizgisini belirler. Sayfadan çıkarken bir kez daha yazılır:
 * sayfa açıkken gelen gönderiler de görülmüş sayılır.
 */
export function useSiteVisit(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const previousSeenAt = ref<string | null>(null)
  const { mutateAsync } = useVisitSite({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: [TODAY_QUERY_PREFIX] }) },
  })

  async function visit(id: string) {
    previousSeenAt.value = null
    const result = await mutateAsync({ siteId: id })
    previousSeenAt.value = result.previousSeenAt ?? null
  }

  watch(() => toValue(siteId), (id, previousId) => {
    if (previousId) void mutateAsync({ siteId: previousId })
    void visit(id)
  }, { immediate: true })
  onScopeDispose(() => void mutateAsync({ siteId: toValue(siteId) }))

  return { previousSeenAt }
}
