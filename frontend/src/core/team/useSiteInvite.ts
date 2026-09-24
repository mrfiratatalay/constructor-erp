import { ref } from 'vue'
import { useIssueLoginLink } from '@/core/api/generated/team/team'
import type { SiteLead } from '@/core/api/generated/model'
import type { IssuedLink } from '@/core/team/useTeam'

/**
 * Şantiyenin kendi sayfasından sorumluya davet: yeni kurulan şantiyede şef henüz göndermemişken patronun
 * oradaki tek işi budur. Link tek kullanımlıktır, WhatsApp'tan gider, şef şifresiz girer.
 */
export function useSiteInvite() {
  const issued = ref<IssuedLink | null>(null)
  const issue = useIssueLoginLink()

  async function inviteLead(lead: SiteLead) {
    const link = await issue.mutateAsync({ memberId: lead.id })
    issued.value = { member: { id: lead.id, fullName: lead.fullName, phone: lead.phone ?? null }, link }
  }

  return { issued, inviteLead, isInviting: issue.isPending }
}
