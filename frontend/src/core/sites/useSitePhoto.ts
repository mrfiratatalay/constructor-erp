import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useChangeSitePhoto, useClearSitePhoto } from '@/core/api/generated/library/library'
import { getGetSiteQueryKey, getListSitesQueryKey } from '@/core/api/generated/sites/sites'
import { compressPhoto } from '@/core/posts/photoCompression'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

/**
 * Şantiye fotoğrafı (WhatsApp'taki grup fotoğrafı): patron koyar, değiştirir, kaldırır. Fotoğraf önce
 * telefonda küçültülür; değişince listede, başlıkta ve bilgi ekranında birlikte yenilenir.
 */
export function useSitePhoto(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(toValue(siteId)) }),
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY }),
    ])
  const change = useChangeSitePhoto({ mutation: { onSuccess: refresh } })
  const clear = useClearSitePhoto({ mutation: { onSuccess: refresh } })

  return {
    changePhoto: async (file: File) =>
      change.mutateAsync({ siteId: toValue(siteId), data: { file: await compressPhoto(file) } }),
    clearPhoto: () => clear.mutateAsync({ siteId: toValue(siteId) }),
    isSaving: computed(() => change.isPending.value || clear.isPending.value),
  }
}
