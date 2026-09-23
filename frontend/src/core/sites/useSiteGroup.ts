import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getGetSiteQueryKey, getListSitesQueryKey } from '@/core/api/generated/sites/sites'
import { getListMembersQueryKey, useIssueLoginLink } from '@/core/api/generated/team/team'
import { useSiteLeads, type LeadChoice } from '@/core/sites/useSiteLeads'
import type { IssuedLink } from '@/core/team/useTeam'
import { TODAY_QUERY_PREFIX } from '@/core/today/useToday'

/**
 * Şantiye artık WhatsApp grubu gibi düşünülür: patron grup bilgisine girer, ekipten kişi seçer ya da
 * yeni kişi ekler, linki WhatsApp'tan gönderir. Backend alanının adı hâlâ leads; ekranda katılımcıdır.
 */
export function useSiteGroup(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const { leads: members, attach, isAttaching } = useSiteLeads()
  const issue = useIssueLoginLink()
  const issued = ref<IssuedLink | null>(null)

  const currentSiteId = () => toValue(siteId)
  const availableMembers = computed(() => members.value.filter((member) => !member.siteIds.includes(currentSiteId())))

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(currentSiteId()) }),
      queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() }),
      queryClient.invalidateQueries({ queryKey: [TODAY_QUERY_PREFIX] }),
    ])

  async function addMember(choice: LeadChoice) {
    const attached = await attach(currentSiteId(), choice)
    await refresh()
    if (!attached) return
    issued.value = {
      member: attached.member,
      link: attached.invite ?? (await issue.mutateAsync({ memberId: attached.member.id })),
    }
  }

  const isSaving = computed(() => isAttaching.value || issue.isPending.value)
  return { availableMembers, issued, addMember, isSaving }
}
