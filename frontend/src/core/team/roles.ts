import type { CurrentUserResponse, MemberViewRole } from '@/core/api/generated/model'
import type { RouteMeta } from 'vue-router'

export const ROLE_LABELS: Record<MemberViewRole, string> = {
  OWNER: 'Patron',
  SITE_LEAD: 'Şef',
  WAREHOUSE: 'Depo Sorumlusu',
  WORKER: 'Çalışan',
}

/** Yoklamayı yalnızca patron ve şef alır; çalışan yoklamada sayılır, menüsünde Yoklama yerine Puantajım vardır. */
export const takesRollCall = (role: MemberViewRole | undefined) =>
  role === 'OWNER' || role === 'SITE_LEAD'

/** Adresin rol kısıtı: Yoklama patron ve şefin, Puantajım çalışanın. */
export function roleAllows(
  meta: { rollCallOnly?: boolean; workerOnly?: boolean },
  role: MemberViewRole,
): boolean {
  if (meta.rollCallOnly) return takesRollCall(role)
  if (meta.workerOnly) return role === 'WORKER'
  return true
}

/**
 * Adrese girebilir mi: rol kısıtı ve izin anahtarı (Malzemeler VIEW_MATERIALS ister). İzinler backend'den gelir;
 * arayüz rol adından iş çıkarmaz.
 */
export function routeAllows(
  meta: RouteMeta,
  user: Pick<CurrentUserResponse, 'role' | 'permissions'>,
): boolean {
  if (meta.permission && !user.permissions.includes(meta.permission)) return false
  return roleAllows(meta, user.role)
}
