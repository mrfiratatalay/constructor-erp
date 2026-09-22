import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useLogout as useLogoutMutation } from '@/core/api/generated/auth/auth'

/** Çıkışta önbellek tamamen temizlenir: bir sonraki kullanıcı öncekinin verisini göremez. */
export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useLogoutMutation({
    mutation: {
      onSettled: async () => {
        queryClient.clear()
        await router.replace({ name: 'login' })
      },
    },
  })
  return { logout: () => mutation.mutate(), isPending: mutation.isPending }
}
