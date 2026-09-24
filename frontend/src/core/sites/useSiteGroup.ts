import { useQueryClient, type QueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getGetSiteQueryKey, getListSiteEventsQueryKey, getListSitesQueryKey } from '@/core/api/generated/sites/sites'
import { getListMembersQueryKey, useIssueLoginLink } from '@/core/api/generated/team/team'
import { useSiteLeads, type LeadChoice } from '@/core/sites/useSiteLeads'
import type { IssuedLink } from '@/core/team/useTeam'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

/** Katılımcı değişince şantiye, akıştaki sistem satırları, listeler ve ekip birlikte yenilenir. */
function refreshGroup(queryClient: QueryClient, siteId: string) {
  const keys = [
    getGetSiteQueryKey(siteId),
    getListSiteEventsQueryKey(siteId),
    getListSitesQueryKey(),
    getListMembersQueryKey(),
    TODAY_QUERY_KEY,
  ]
  return Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey: [...queryKey] })))
}

/**
 * Şantiye artık WhatsApp grubu gibi düşünülür: patron grup bilgisine girer, ekipten kişi seçer ya da
 * yeni kişi ekler, linki WhatsApp'tan gönderir. Backend alanının adı hâlâ leads; ekranda katılımcıdır.
 */
export function useSiteGroup(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const { leads: members, attach, detach, isAttaching } = useSiteLeads()
  const issue = useIssueLoginLink()
  const issued = ref<IssuedLink | null>(null)

  const currentSiteId = () => toValue(siteId)
  const availableMembers = computed(() => members.value.filter((member) => !member.siteIds.includes(currentSiteId())))

  const refresh = () => refreshGroup(queryClient, currentSiteId())

  async function addMember(choice: LeadChoice) {
    const attached = await attach(currentSiteId(), choice)
    await refresh()
    if (!attached) return
    issued.value = {
      member: attached.member,
      link: attached.invite ?? (await issue.mutateAsync({ memberId: attached.member.id })),
    }
  }

  async function removeMember(memberId: string) {
    await detach(currentSiteId(), memberId)
    await refresh()
  }

  const isSaving = computed(() => isAttaching.value || issue.isPending.value)
  return { availableMembers, issued, addMember, removeMember, isSaving }
}
