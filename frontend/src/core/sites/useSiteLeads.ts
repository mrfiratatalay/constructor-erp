import { computed } from 'vue'
import { useCreateMember, useListMembers, useUpdateMember } from '@/core/api/generated/team/team'
import type { InviteLink, MemberView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'

export interface LeadChoice {
  /** Ekipten seçilen sorumlu; yeni kişi ekleniyorsa ya da sorumlu sonraya bırakıldıysa boş. */
  leadId: string | null
  newLead: { fullName: string; phone: string | null } | null
}

type MemberEditor = ReturnType<typeof useUpdateMember>

export interface AttachedSiteMember {
  member: Pick<MemberView, 'id' | 'fullName'>
  invite?: InviteLink
}

/** Mevcut kişiye şantiye eklenir; eski şantiyeleri korunur, çünkü sunucu sorumlulukları baştan yazar. */
function assign(editor: MemberEditor, lead: MemberView, siteId: string) {
  const { id, fullName, phone, role, active, siteIds } = lead
  return editor.mutateAsync({
    memberId: id,
    data: { fullName, phone, role, active, siteIds: [...new Set([...siteIds, siteId])] },
  })
}

/**
 * Şantiyeye sorumlu bağlama. Kişi ekipten seçilebilir ya da burada oluşturulabilir: patronu "önce Ekip'e
 * git, kişiyi ekle, sonra geri dön" yolculuğuna çıkarmamak için. Ekip listesi yalnızca patrona açıktır,
 * o yüzden sorgu şefte hiç çalışmaz.
 */
export function useSiteLeads() {
  const { data: user } = useCurrentUser()
  const isOwner = computed(() => user.value?.role === 'OWNER')
  const team = useListMembers({ query: { enabled: isOwner } })
  const addMember = useCreateMember()
  const editMember = useUpdateMember()
  const leads = computed(() => (team.data.value ?? []).filter((member) => member.active))

  async function attach(siteId: string, choice: LeadChoice): Promise<AttachedSiteMember | null> {
    if (choice.newLead) {
      const { fullName, phone } = choice.newLead
      const created = await addMember.mutateAsync({ data: { fullName, phone, role: 'SITE_LEAD', siteIds: [siteId] } })
      return { member: created.member, invite: created.invite }
    }
    const lead = leads.value.find((member) => member.id === choice.leadId)
    if (!lead) return null
    const updated = await assign(editMember, lead, siteId)
    return { member: updated }
  }

  const isAttaching = computed(() => addMember.isPending.value || editMember.isPending.value)
  return { leads, attach, isAttaching }
}
