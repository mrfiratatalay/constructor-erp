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

/** Adresin rol kısıtı: Yoklama patron ve şefin, Puantajım çalışanın, Firma patronun. */
export function roleAllows(
  meta: { rollCallOnly?: boolean; workerOnly?: boolean; ownerOnly?: boolean },
  role: MemberViewRole,
): boolean {
  if (meta.rollCallOnly) return takesRollCall(role)
  if (meta.workerOnly) return role === 'WORKER'
  if (meta.ownerOnly) return role === 'OWNER'
  return true
}

/** Çalışma alanındaki kişi: rolü, izinleri ve (biliniyorsa) firmanın paketinde açık modüller. */
export type WorkspaceViewer = Pick<CurrentUserResponse, 'role' | 'permissions'> & { features?: readonly string[] }

/**
 * Adrese girebilir mi: modül firmanın paketinde mi, izin anahtarı (Malzemeler VIEW_MATERIALS ister) ve rol kısıtı.
 * İzinler ve modüller backend'den gelir; arayüz rol adından iş çıkarmaz.
 */
export function routeAllows(meta: RouteMeta, user: WorkspaceViewer): boolean {
  if (meta.feature && user.features && !user.features.includes(meta.feature)) return false
  if (meta.permission && !user.permissions.includes(meta.permission)) return false
  return roleAllows(meta, user.role)
}
