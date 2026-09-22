import { computed } from 'vue'
import { errorMessage } from '@/core/api/errors'
import { useLogin } from '@/core/api/generated/auth/auth'
import { useSignIn } from '@/core/auth/useSignIn'

export function usePasswordLogin() {
  const signIn = useSignIn()
  const mutation = useLogin({ mutation: { onSuccess: signIn } })

  return {
    login: (email: string, password: string) => mutation.mutate({ data: { email, password } }),
    isPending: mutation.isPending,
    errorText: computed(() => (mutation.error.value ? errorMessage(mutation.error.value) : null)),
  }
}
