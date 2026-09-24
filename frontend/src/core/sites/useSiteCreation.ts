import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useChangeSitePhoto } from '@/core/api/generated/library/library'
import type { SiteView } from '@/core/api/generated/model'
import { getListSitesQueryKey, useCreateSite } from '@/core/api/generated/sites/sites'
import { getListMembersQueryKey, useListMembers } from '@/core/api/generated/team/team'
import { useCurrentUser } from '@/core/auth/currentUser'
import { compressPhoto } from '@/core/posts/photoCompression'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

export interface NewSiteForm {
  memberIds: string[]
  name: string
  address: string | null
  photo: File | null
}

/**
 * Şantiye kurmak, WhatsApp'ta grup kurmanın aynısıdır: önce katılımcılar (firmadan seç), sonra fotoğraf ve ad.
 * Firmada olmayan yeni kişi burada yazılmaz: kurulduktan sonra şantiyenin içinden WhatsApp'la davet edilir.
 * Kurulan şantiye döner ki sayfa doğrudan içine götürsün.
 */
export function useSiteCreation() {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  // Firmanın kişi listesi yalnızca patrona açıktır; şefte sorgu hiç çalışmaz (şantiye de yalnızca patron kurar).
  const team = useListMembers({ query: { enabled: computed(() => user.value?.role === 'OWNER') } })
  const create = useCreateSite()
  const photo = useChangeSitePhoto()

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() }),
      queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY }),
    ])

  async function createSite(form: NewSiteForm): Promise<SiteView> {
    const site = await create.mutateAsync({ data: { name: form.name, address: form.address, memberIds: form.memberIds } })
    if (form.photo) await photo.mutateAsync({ siteId: site.id, data: { file: await compressPhoto(form.photo) } })
    await refresh()
    return site
  }

  /** Katılımcı olabilecekler: firmanın aktif kişileri, patronlar hariç (patron her şantiyenin içindedir). */
  const people = computed(() => (team.data.value ?? []).filter((member) => member.active && member.role !== 'OWNER'))
  const isSaving = computed(() => create.isPending.value || photo.isPending.value)
  return { people, createSite, isSaving }
}
