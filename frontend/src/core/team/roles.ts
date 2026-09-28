import type { MemberViewRole } from '@/core/api/generated/model'

export const ROLE_LABELS: Record<MemberViewRole, string> = {
  OWNER: 'Patron',
  SITE_LEAD: 'Şef',
  WORKER: 'Çalışan',
}

/** Yoklamayı yalnızca patron ve şef alır; çalışan yoklamada sayılır, menüsünde Yoklama yerine Puantajım vardır. */
export const takesRollCall = (role: MemberViewRole | undefined) => role === 'OWNER' || role === 'SITE_LEAD'

/** Adresin rol kısıtı: Yoklama patron ve şefin, Puantajım çalışanın. */
export function roleAllows(meta: { rollCallOnly?: boolean; workerOnly?: boolean }, role: MemberViewRole): boolean {
  if (meta.rollCallOnly) return takesRollCall(role)
  if (meta.workerOnly) return role === 'WORKER'
  return true
}
