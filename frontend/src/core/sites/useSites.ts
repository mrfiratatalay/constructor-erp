import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import {
  getListSitesQueryKey,
  useCreateSite,
  useListSites,
  useUpdateSite,
} from '@/core/api/generated/sites/sites'
import type { SiteView, UpdateSiteRequest } from '@/core/api/generated/model'

export type SiteForm = UpdateSiteRequest

/** Şantiye listesi ve patronun ekleme/düzenleme işleri; değişiklikten sonra liste yenilenir. */
export function useSites() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() })

  const list = useListSites()
  const create = useCreateSite({ mutation: { onSuccess: refresh } })
  const update = useUpdateSite({ mutation: { onSuccess: refresh } })

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
