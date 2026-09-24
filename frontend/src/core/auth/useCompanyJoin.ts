import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { errorMessage } from '@/core/api/errors'
import { useAcceptJoinInvite, useGetJoinInvite } from '@/core/api/generated/join/join'
import type { JoinRequest } from '@/core/api/generated/model'

/**
 * Firmanın bağlantısını açan kişi: adını ve numarasını yazıp katılır, doğrudan şantiyeler listesine düşer ve
 * bütün şantiyeleri görür. Bu telefonda zaten içerideyse beklemeden listeye gider.
 */
export function useCompanyJoin() {
  const route = useRoute()
  const router = useRouter()
  const queryClient = useQueryClient()
  const token = String(route.params.token)
  const invite = useGetJoinInvite(token, { query: { retry: false } })
  const accept = useAcceptJoinInvite()

  const openSites = () => router.replace({ name: 'sites' })

  async function join(form: JoinRequest) {
    await accept.mutateAsync({ token, data: form })
    // Yeni kişiye oturum açıldı: önbellekteki her şey başkasına (ya da hiç kimseye) aitti.
    await queryClient.resetQueries()
    await openSites()
  }

  return {
    invite: invite.data,
    isLoading: invite.isPending,
    loadError: computed(() => (invite.error.value ? errorMessage(invite.error.value) : null)),
    join,
    openSites,
    isJoining: accept.isPending,
  }
}
