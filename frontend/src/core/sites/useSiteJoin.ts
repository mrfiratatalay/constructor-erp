import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { errorMessage } from '@/core/api/errors'
import { useAcceptSiteInvite, useGetSiteInvite } from '@/core/api/generated/site-invites/site-invites'
import type { JoinSiteRequest } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'

/**
 * Davet bağlantısını açan kişi: oturumu açıksa tek dokunuşla, değilse adını ve numarasını yazıp katılır ve
 * doğrudan şantiyenin içine düşer. Zaten içerideyse beklemeden şantiyeye gider.
 */
export function useSiteJoin() {
  const route = useRoute()
  const router = useRouter()
  const queryClient = useQueryClient()
  const token = String(route.params.token)
  const invite = useGetSiteInvite(token, { query: { retry: false } })
  const accept = useAcceptSiteInvite()
  const { data: user } = useCurrentUser()

  const openSite = (siteId: string) => router.replace({ name: 'siteFeed', params: { siteId } })

  async function join(form: JoinSiteRequest) {
    const { siteId } = await accept.mutateAsync({ token, data: user.value ? {} : form })
    // Yeni kişiye oturum açıldı ya da şefin şantiyeleri değişti: önbellekteki her şey eskidi.
    await queryClient.resetQueries()
    await openSite(siteId)
  }

  return {
    invite: invite.data,
    isLoading: invite.isPending,
    loadError: computed(() => (invite.error.value ? errorMessage(invite.error.value) : null)),
    signedIn: computed(() => !!user.value),
    join,
    openSite,
    isJoining: accept.isPending,
  }
}
