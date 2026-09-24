import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useChangeSitePhoto } from '@/core/api/generated/library/library'
import type { SiteView } from '@/core/api/generated/model'
import { getListSitesQueryKey, useCreateSite } from '@/core/api/generated/sites/sites'
import { compressPhoto } from '@/core/posts/photoCompression'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

export interface NewSiteForm {
  name: string
  address: string | null
  photo: File | null
}

/**
 * Şantiye kurmak, WhatsApp'ta grup kurmak gibi, ama kişi seçilmez: firmadaki herkes her şantiyededir. Yalnızca
 * fotoğraf, ad ve adres. Kurulan şantiye döner ki sayfa doğrudan içine götürsün.
 */
export function useSiteCreation() {
  const queryClient = useQueryClient()
  const create = useCreateSite()
  const photo = useChangeSitePhoto()

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY }),
    ])

  async function createSite(form: NewSiteForm): Promise<SiteView> {
    const site = await create.mutateAsync({ data: { name: form.name, address: form.address } })
    if (form.photo) await photo.mutateAsync({ siteId: site.id, data: { file: await compressPhoto(form.photo) } })
    await refresh()
    return site
  }

  const isSaving = computed(() => create.isPending.value || photo.isPending.value)
  return { createSite, isSaving }
}
