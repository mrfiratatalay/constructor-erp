import { ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getListOnboardingInvitesQueryKey,
  getListTenantAuditQueryKey,
  useIssueOnboardingInvite,
  useListOnboardingInvites,
  useRevokeOnboardingInvite,
} from '@/core/api/generated/platform/platform'
import type { OnboardingLink } from '@/core/api/generated/model'

/**
 * Firmanın kurulum linkleri: geçmiş, yeni link (bekleyen eskisi iptal olur) ve iptal. Yeni link yalnızca üretildiği
 * an görünür: sunucuda açık hâli yoktur.
 */
export function useTenantInvites(companyId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const list = useListOnboardingInvites(() => toValue(companyId))
  const fresh = ref<OnboardingLink | null>(null)
  const refresh = () =>
    Promise.all([getListOnboardingInvitesQueryKey(toValue(companyId)), getListTenantAuditQueryKey(toValue(companyId))]
      .map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  const issue = useIssueOnboardingInvite({ mutation: { onSuccess: refresh } })
  const revoke = useRevokeOnboardingInvite({ mutation: { onSuccess: refresh } })

  return {
    invites: list.data,
    fresh,
    issue: async () => (fresh.value = await issue.mutateAsync({ companyId: toValue(companyId) })),
    isIssuing: issue.isPending,
    revoke: (inviteId: string) => revoke.mutateAsync({ companyId: toValue(companyId), inviteId }),
  }
}
