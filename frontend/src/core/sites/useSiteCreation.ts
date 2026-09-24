import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useChangeSitePhoto } from '@/core/api/generated/library/library'
import type { SiteView } from '@/core/api/generated/model'
import { getListSitesQueryKey, useCreateSite } from '@/core/api/generated/sites/sites'
import { getListMembersQueryKey, useCreateMember, useListMembers } from '@/core/api/generated/team/team'
import { useCurrentUser } from '@/core/auth/currentUser'
import { compressPhoto } from '@/core/posts/photoCompression'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

/** Kurarken eklenen, ekipte henüz olmayan kişi; davet linki şantiyenin içinden, WhatsApp'ta bu numaraya gider. */
export interface NewPerson {
  fullName: string
  phone: string
}

export interface NewSiteForm {
  memberIds: string[]
  newPeople: NewPerson[]
  name: string
  address: string | null
  photo: File | null
}

/**
 * Şantiye kurmak, WhatsApp'ta grup kurmanın aynısıdır: önce katılımcılar (ekipten seç ya da yeni kişi ekle),
 * sonra fotoğraf ve ad. Kurulan şantiye döner ki sayfa doğrudan içine götürsün; akışın başında "Patron
 * şantiyeyi kurdu", "Patron, Musa'yı ekledi" satırları ve davet düğmeleri hazır durur.
 */
export function useSiteCreation() {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  // Ekip listesi yalnızca patrona açıktır; şefte sorgu hiç çalışmaz (şantiye de yalnızca patron kurar).
  const team = useListMembers({ query: { enabled: computed(() => user.value?.role === 'OWNER') } })
  const createMember = useCreateMember()
  const create = useCreateSite()
  const photo = useChangeSitePhoto()

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() }),
      queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY }),
    ])

  async function addPeople(people: NewPerson[]): Promise<string[]> {
    const created = await Promise.all(people.map(({ fullName, phone }) =>
      createMember.mutateAsync({ data: { fullName, phone, role: 'SITE_LEAD', siteIds: [] } })))
    return created.map((response) => response.member.id)
  }

  async function createSite(form: NewSiteForm): Promise<SiteView> {
    const memberIds = [...form.memberIds, ...(await addPeople(form.newPeople))]
    const site = await create.mutateAsync({ data: { name: form.name, address: form.address, memberIds } })
    if (form.photo) await photo.mutateAsync({ siteId: site.id, data: { file: await compressPhoto(form.photo) } })
    await refresh()
    return site
  }

  /** Katılımcı olabilecekler: firmanın aktif kişileri, patronlar hariç (patron her şantiyenin içindedir). */
  const people = computed(() => (team.data.value ?? []).filter((member) => member.active && member.role !== 'OWNER'))
  const isSaving = computed(() => createMember.isPending.value || create.isPending.value || photo.isPending.value)
  return { people, createSite, isSaving }
}
