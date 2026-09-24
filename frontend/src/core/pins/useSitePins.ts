import { useQueryClient } from '@tanstack/vue-query'
import { usePinSite, useUnpinSite } from '@/core/api/generated/sites/sites'
import type { SiteToday } from '@/core/api/generated/model'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

/** Şantiye sabitleme (uzun bas → 📌): kişiye özel, en fazla üç; sunucu fazlasını reddeder. */
export function useSitePins() {
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY })
  const pin = usePinSite({ mutation: { onSuccess } })
  const unpin = useUnpinSite({ mutation: { onSuccess } })

  return {
    togglePin: (site: SiteToday) => (site.pinnedAt ? unpin : pin).mutateAsync({ siteId: site.siteId }),
  }
}
