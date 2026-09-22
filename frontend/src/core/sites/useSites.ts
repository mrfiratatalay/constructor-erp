import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import {
  getGetSiteQueryKey,
  getListSitesQueryKey,
  useCreateSite,
  useListSites,
  useUpdateSite,
} from '@/core/api/generated/sites/sites'
import type { SiteView, UpdateSiteRequest } from '@/core/api/generated/model'
import { TODAY_QUERY_PREFIX } from '@/core/today/useToday'

export type SiteForm = UpdateSiteRequest

/**
 * Şantiye listesi ve patronun ekleme/düzenleme işleri. Düzenleme şantiyenin kendi sayfasından yapılır:
 * kaydedince liste, açık olan şantiye ve ana ekran birlikte yenilenir.
 */
export function useSites() {
  const queryClient = useQueryClient()
  const refreshLists = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: [TODAY_QUERY_PREFIX] }),
    ])
  const refreshSite = (site: SiteView) =>
    Promise.all([refreshLists(), queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(site.id) })])

  const list = useListSites()
  const create = useCreateSite({ mutation: { onSuccess: refreshLists } })
  const update = useUpdateSite({ mutation: { onSuccess: refreshSite } })

  async function saveSite(existing: SiteView | null, form: SiteForm) {
    if (existing) await update.mutateAsync({ siteId: existing.id, data: form })
    else await create.mutateAsync({ data: { name: form.name, address: form.address } })
  }

  return {
    sites: list.data,
    isLoading: list.isPending,
    saveSite,
    isSaving: computed(() => create.isPending.value || update.isPending.value),
  }
}
