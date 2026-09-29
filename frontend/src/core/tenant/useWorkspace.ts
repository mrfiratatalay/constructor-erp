import { computed } from 'vue'
import { workspaceUserOf } from '@/core/auth/currentUser'
import { useSessionContext } from '@/core/auth/sessionContext'
import type { WorkspaceViewer } from '@/core/team/roles'
import type { FeatureKey } from '@/core/tenant/features'

/**
 * Şu anki firmanın çalışma alanı: markası (ad, logo), açık modülleri, abonelik durumu. Firmaya özel hiçbir şey
 * kodda yazmaz; aynı bileşen başka firmada kendiliğinden o firmanın markasını gösterir.
 */
export function useWorkspace() {
  const { data: context } = useSessionContext()
  const workspace = computed(() => context.value?.workspace)
  const hasFeature = (key: FeatureKey) => workspace.value?.features.includes(key) ?? false

  /** Menü ve adres kuralları için: rol, izinler ve paketin modülleri birlikte. */
  const viewer = computed<WorkspaceViewer | undefined>(() => {
    const user = workspaceUserOf(context.value)
    return user && { ...user, features: workspace.value?.features ?? [] }
  })

  return {
    context,
    workspace,
    viewer,
    access: computed(() => workspace.value?.access),
    isPlatformAdmin: computed(() => context.value?.user.platformAdmin ?? false),
    otherWorkspaces: computed(() =>
      (context.value?.workspaces ?? []).filter((option) => option.companyId !== workspace.value?.companyId),
    ),
    hasFeature,
  }
}
