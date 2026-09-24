import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import {
  getListMembersQueryKey,
  useCreateMember,
  useIssueLoginLink,
  useListMembers,
  useUpdateMember,
} from '@/core/api/generated/team/team'
import type { InviteLink, MemberView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'

/** Formda yalnızca ad ve telefon var: eklenen herkes şeftir, şantiyeye ekleme şantiyenin içinde yapılır. */
export interface MemberForm {
  fullName: string
  phone: string
}

/** Linki gösteren pencerenin ihtiyacı kadarı: şantiye sayfasından davet edilen kişi de buraya girer. */
export interface IssuedLink {
  member: Pick<MemberView, 'id' | 'fullName' | 'phone'>
  link: InviteLink
}

/** Giriş linki üretir ve ekranda gösterilecek son linki tutar. */
function useLoginLinks() {
  const issuedLink = ref<IssuedLink | null>(null)
  const issue = useIssueLoginLink()

  async function sendNewLink(member: MemberView) {
    issuedLink.value = { member, link: await issue.mutateAsync({ memberId: member.id }) }
  }

  return { issuedLink, sendNewLink }
}

/** Ekipten çıkarılanlar ve bakan patronun kendisi listede yoktur; sıra Türkçe alfabeyle. */
function visibleMembers(all: MemberView[], viewerId: string | undefined): MemberView[] {
  return all
    .filter((member) => member.active && member.id !== viewerId)
    .sort((first, second) => first.fullName.localeCompare(second.fullName, 'tr'))
}

/** Ekip: firmanın adamlarının listesi (WhatsApp'taki Kişiler). Değişiklikten sonra liste yenilenir. */
export function useTeam() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() })
  const { data: user } = useCurrentUser()
  const links = useLoginLinks()
  const list = useListMembers()
  const create = useCreateMember({ mutation: { onSuccess: refresh } })
  const update = useUpdateMember({ mutation: { onSuccess: refresh } })

  const members = computed(() => visibleMembers(list.data.value ?? [], user.value?.id))
  const findMember = (memberId: string) =>
    list.data.value?.find((member) => member.id === memberId && member.active) ?? null

  /** Yeni kişinin giriş linki hemen üretilir ve WhatsApp'a gönderilmeye hazır bekler. */
  async function saveMember(existing: MemberView | null, form: MemberForm): Promise<MemberView> {
    if (existing) {
      const { role, active, siteIds } = existing
      return update.mutateAsync({ memberId: existing.id, data: { ...form, role, active, siteIds } })
    }
    const created = await create.mutateAsync({ data: { ...form, role: 'SITE_LEAD', siteIds: [] } })
    links.issuedLink.value = { member: created.member, link: created.invite }
    return created.member
  }

  /** Ekipten çıkar: uygulamaya giremez, bütün şantiyelerden çıkar; yazdıkları şantiyelerde kalır. */
  async function removeMember(member: MemberView) {
    const { id, fullName, phone, role } = member
    await update.mutateAsync({ memberId: id, data: { fullName, phone, role, active: false, siteIds: [] } })
  }

  const isSaving = computed(() => create.isPending.value || update.isPending.value)
  return { members, findMember, isLoading: list.isPending, ...links, saveMember, removeMember, isSaving }
}
