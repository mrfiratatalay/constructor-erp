import { computed } from 'vue'
import { useListMembers, useUpdateMember } from '@/core/api/generated/team/team'
import type { MemberView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import type { MemberForm } from '@/core/team/memberForm'

type MemberChange = Partial<Pick<MemberView, 'fullName' | 'phone' | 'active' | 'siteIds'>>

/**
 * Şantiyenin katılımcıları, WhatsApp'ta grubun katılımcıları gibi: firmadan biri seçilip eklenir, düzeltilir,
 * çıkarılır. Yeni biri davet bağlantısıyla kendisi katılır (useSiteInviteLink). Firmanın kişi listesi yalnızca
 * patrona açıktır, o yüzden sorgu şefte hiç çalışmaz.
 */
export function useSiteLeads() {
  const { data: user } = useCurrentUser()
  const team = useListMembers({ query: { enabled: computed(() => user.value?.role === 'OWNER') } })
  const editor = useUpdateMember()
  const leads = computed(() => (team.data.value ?? []).filter((member) => member.active && member.role !== 'OWNER'))
  const find = (memberId: string) => leads.value.find((member) => member.id === memberId) ?? null

  /** Sunucu kişinin bütün alanlarını baştan yazar; değişmeyenler olduğu gibi gönderilir. */
  async function save(memberId: string, change: MemberChange) {
    const member = find(memberId)
    if (!member) return
    const { id, fullName, phone, role, active, siteIds } = { ...member, ...change }
    await editor.mutateAsync({ memberId: id, data: { fullName, phone, role, active, siteIds } })
  }

  const attach = (siteId: string, memberId: string) =>
    save(memberId, { siteIds: [...new Set([...(find(memberId)?.siteIds ?? []), siteId])] })

  /** Başka şantiyesi yoksa çıkarmak uygulamadan da çıkarmaktır: hiçbir şey göremeyecek biri içeride kalmaz. */
  const isLastSite = (siteId: string, memberId: string) =>
    (find(memberId)?.siteIds ?? []).every((id) => id === siteId)

  function detach(siteId: string, memberId: string) {
    const siteIds = (find(memberId)?.siteIds ?? []).filter((id) => id !== siteId)
    return save(memberId, { siteIds, active: siteIds.length > 0 })
  }

  const edit = (memberId: string, form: MemberForm) => save(memberId, form)
  return { leads, find, attach, detach, edit, isLastSite, isSaving: editor.isPending }
}
