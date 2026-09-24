import { useQueryClient, type QueryClient } from '@tanstack/vue-query'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getGetSiteQueryKey, getListSiteEventsQueryKey, getListSitesQueryKey } from '@/core/api/generated/sites/sites'
import { getListMembersQueryKey, useIssueLoginLink } from '@/core/api/generated/team/team'
import { useSiteLeads } from '@/core/sites/useSiteLeads'
import type { IssuedLink } from '@/core/team/loginLink'
import type { MemberForm } from '@/core/team/memberForm'
import { TODAY_QUERY_KEY } from '@/core/today/useToday'

/** Katılımcı değişince şantiye, akıştaki sistem satırları, listeler ve kişi listesi birlikte yenilenir. */
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
 * Şantiye bilgisindeki katılımcılar (WhatsApp'taki grup bilgisi): patron firmadan birini ekler, bir kişiye
 * dokununca arar, giriş linki gönderir, düzeltir ya da çıkarır. Backend alanının adı hâlâ leads.
 */
export function useSiteGroup(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const leads = useSiteLeads()
  const issue = useIssueLoginLink()
  const issued = ref<IssuedLink | null>(null)
  const current = () => toValue(siteId)
  const refresh = () => refreshGroup(queryClient, current())

  const availableMembers = computed(() => leads.leads.value.filter((member) => !member.siteIds.includes(current())))
  const leavesApp = (memberId: string) => leads.isLastSite(current(), memberId)
  const addMember = (memberId: string) => leads.attach(current(), memberId).then(refresh)
  const removeMember = (memberId: string) => leads.detach(current(), memberId).then(refresh)
  const editMember = (memberId: string, form: MemberForm) => leads.edit(memberId, form).then(refresh)

  /** Kişi "giremiyorum" derse ya da telefonunu değiştirirse: WhatsApp'ta doğrudan onun sohbetine gider. */
  async function sendLoginLink(memberId: string) {
    const member = leads.find(memberId)
    if (member) issued.value = { member, link: await issue.mutateAsync({ memberId }) }
  }

  const isSaving = computed(() => leads.isSaving.value || issue.isPending.value)
  return { availableMembers, issued, findMember: leads.find, addMember, removeMember, editMember, sendLoginLink,
    leavesApp, isSaving }
}
