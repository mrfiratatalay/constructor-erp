import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { getListSitesQueryKey, useCreateSite } from '@/core/api/generated/sites/sites'
import { getListMembersQueryKey } from '@/core/api/generated/team/team'
import type { SiteView } from '@/core/api/generated/model'
import { useSiteLeads, type LeadChoice } from '@/core/sites/useSiteLeads'
import { TODAY_QUERY_PREFIX } from '@/core/today/useToday'

export interface NewSiteForm extends LeadChoice {
  name: string
  address: string | null
}

/**
 * Şantiye kurmak, WhatsApp'ta grup kurmanın karşılığıdır: ad ver, sorumluyu ata, içine düş. Kurulan
 * şantiye geri döndürülür ki sayfa doğrudan onun akışına götürsün; davet linki de orada, akışın
 * başındaki boşlukta gönderilir (bkz. useSiteInvite).
 */
export function useSiteCreation() {
  const queryClient = useQueryClient()
  const site = useCreateSite()
  const { leads, attach, isAttaching } = useSiteLeads()

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() }),
      queryClient.invalidateQueries({ queryKey: [TODAY_QUERY_PREFIX] }),
    ])

  async function createSite(form: NewSiteForm): Promise<SiteView> {
    const created = await site.mutateAsync({ data: { name: form.name, address: form.address } })
    await attach(created.id, form)
    await refresh()
    return created
  }

  const isSaving = computed(() => site.isPending.value || isAttaching.value)
  return { leads, createSite, isSaving }
}
