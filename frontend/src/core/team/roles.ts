import type { MemberViewRole } from '@/core/api/generated/model'
import { canSeeProduction } from '@/core/production/productionRoles'

export const ROLE_LABELS: Record<MemberViewRole, string> = {
  OWNER: 'Patron',
  SITE_LEAD: 'Şef',
  WORKER: 'Çalışan',
  STOREKEEPER: 'Depo sorumlusu',
}

/**
 * Yoklamayı yalnızca patron ve şef alır; çalışan ve depo sorumlusu yoklamada sayılır, menülerinde Yoklama yerine
 * Puantajım vardır.
 */
export const takesRollCall = (role: MemberViewRole | undefined) => role === 'OWNER' || role === 'SITE_LEAD'

/** Yoklamada sayılanlar: çalışan ve depo sorumlusu (backend'deki UserRole.isCountedInPuantaj ile aynı). */
export const isCountedInPuantaj = (role: MemberViewRole | undefined) =>
  role === 'WORKER' || role === 'STOREKEEPER'

type RoleMeta = { rollCallOnly?: boolean; workerOnly?: boolean; productionOnly?: boolean }

/** Adresin rol kısıtı: Yoklama patron ve şefin, Puantajım yoklamada sayılanların, İmalat onu görenlerin. */
export function roleAllows(meta: RoleMeta, role: MemberViewRole): boolean {
  if (meta.rollCallOnly) return takesRollCall(role)
  if (meta.workerOnly) return isCountedInPuantaj(role)
  if (meta.productionOnly) return canSeeProduction(role)
  return true
}
