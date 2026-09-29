import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { useSwitchWorkspace } from '@/core/api/generated/auth/auth'
import type { SessionContextView } from '@/core/api/generated/model'
import { homeOf } from '@/core/auth/homeRoute'
import { rememberSessionContext } from '@/core/auth/sessionContext'

/**
 * Başka bir firmanın çalışma alanına geçiş (kişi birden çok firmada üyeyse). Sunucu üyeliği doğrular; geçişte önceki
 * firmanın bütün önbelleği silinir: bir firmanın verisi diğerinin ekranına düşmez.
 */
export function useWorkspaceSwitch() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const mutation = useSwitchWorkspace({
    mutation: {
      onSuccess: async (context: SessionContextView) => {
        queryClient.clear()
        rememberSessionContext(queryClient, context)
        await router.replace({ name: homeOf(context) })
      },
    },
  })
  return {
    switchTo: (companyId: string) => mutation.mutate({ data: { companyId } }),
    isSwitching: mutation.isPending,
  }
}
