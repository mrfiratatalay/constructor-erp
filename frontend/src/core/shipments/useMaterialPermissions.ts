import { computed } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'

/** Düğmeler rol adına göre değil izne göre görünür; rol → izin eşlemesi backend'de tek yerdedir. */
export function useMaterialPermissions() {
  const { data: user } = useCurrentUser()
  const has = (permission: string) => computed(() => (user.value?.permissions ?? []).includes(permission as never))
  return {
    canCreate: has('CREATE_MATERIAL_MOVEMENT'),
    canCancel: has('CANCEL_MATERIAL_MOVEMENT'),
    canExport: has('EXPORT_MATERIALS'),
  }
}
