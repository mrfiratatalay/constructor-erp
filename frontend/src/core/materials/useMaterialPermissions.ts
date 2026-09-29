import { computed } from 'vue'
import type { CurrentUserResponsePermissionsItem } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'

export type MaterialPermission = CurrentUserResponsePermissionsItem

/**
 * Malzeme ekranlarının düğmeleri rol adına değil izne göre görünür (backend'in verdiği anahtarlar). Rol matrisi
 * değişince arayüz değişmez.
 */
export function useMaterialPermissions() {
  const { data: user } = useCurrentUser()
  const permissions = computed(() => new Set(user.value?.permissions ?? []))
  const can = (permission: MaterialPermission) => permissions.value.has(permission)
  return { can, user }
}
