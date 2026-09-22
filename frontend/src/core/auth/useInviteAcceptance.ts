import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { errorMessage } from '@/core/api/errors'
import { useAcceptInvite } from '@/core/api/generated/auth/auth'
import { useSignIn } from '@/core/auth/useSignIn'

/** Davet linki açılır açılmaz token'ı sunucuya gönderir; kullanıcı hiçbir şeye dokunmaz. */
export function useInviteAcceptance() {
  const route = useRoute()
  const signIn = useSignIn()
  const mutation = useAcceptInvite({ mutation: { onSuccess: signIn } })

  onMounted(() => mutation.mutate({ data: { token: String(route.params.token) } }))

  return {
    isPending: computed(() => !mutation.isError.value),
    errorText: computed(() => (mutation.error.value ? errorMessage(mutation.error.value) : null)),
  }
}
