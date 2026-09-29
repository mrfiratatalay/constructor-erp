import { computed } from 'vue'
import type { QueryClient } from '@tanstack/vue-query'
import type { CurrentUserResponse, SessionContextView } from '@/core/api/generated/model'
import { loadSessionContext, useSessionContext } from '@/core/auth/sessionContext'

/**
 * Çalışma alanındaki kişi, oturum bağlamından: rolü, izinleri (paketin açtığı modüllerle kesişmiş) ve firmanın adı.
 * Firmasız hesapta (platform yöneticisi) boştur. Ekranlar rol ve izni hep buradan okur.
 */
export function workspaceUserOf(context: SessionContextView | null | undefined): CurrentUserResponse | undefined {
  const workspace = context?.workspace
  if (!context || !workspace) return undefined
  return {
    id: context.user.id,
    fullName: context.user.fullName,
    role: workspace.role,
    companyName: workspace.name,
    permissions: workspace.permissions,
  }
}

export async function loadCurrentUser(queryClient: QueryClient): Promise<CurrentUserResponse | null> {
  return workspaceUserOf(await loadSessionContext(queryClient)) ?? null
}

/** Bileşenler için: guard bağlamı zaten yüklediği için çoğunlukla önbellekten anında gelir. */
export function useCurrentUser() {
  const { data } = useSessionContext()
  return { data: computed(() => workspaceUserOf(data.value)) }
}
