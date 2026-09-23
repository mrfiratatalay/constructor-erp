import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import {
  getListMembersQueryKey,
  useCreateMember,
  useIssueLoginLink,
  useListMembers,
  useUpdateMember,
} from '@/core/api/generated/team/team'
import type { CreateMemberRequest, InviteLink, MemberView } from '@/core/api/generated/model'

/** Ekleme ve düzenleme formunun ortak alanları. */
export type MemberForm = CreateMemberRequest

/** Linki gösteren pencerenin ihtiyacı kadarı: şantiye sayfasından davet edilen sorumlu da buraya girer. */
export interface IssuedLink {
  member: Pick<MemberView, 'id' | 'fullName'>
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

/** Ekip ekranının bütün işleri; kabuklar yalnızca görüntüler. Değişiklikten sonra liste yenilenir. */
export function useTeam() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() })
  const links = useLoginLinks()
  const list = useListMembers()
  const create = useCreateMember({ mutation: { onSuccess: refresh } })
  const update = useUpdateMember({ mutation: { onSuccess: refresh } })

  /** Yeni kişiye giriş linki hemen üretilir; düzenlemede yalnızca bilgiler güncellenir. */
  async function saveMember(existing: MemberView | null, form: MemberForm) {
    if (existing) {
      await update.mutateAsync({ memberId: existing.id, data: { ...form, active: existing.active } })
      return
    }
    const created = await create.mutateAsync({ data: form })
    links.issuedLink.value = { member: created.member, link: created.invite }
  }

  async function setActive(member: MemberView, active: boolean) {
    const { id, fullName, phone, role, siteIds } = member
    await update.mutateAsync({ memberId: id, data: { fullName, phone, role, siteIds, active } })
  }

  const isSaving = computed(() => create.isPending.value || update.isPending.value)
  return { members: list.data, isLoading: list.isPending, ...links, saveMember, setActive, isSaving }
}
