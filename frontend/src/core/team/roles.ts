import type { MemberViewRole } from '@/core/api/generated/model'

export const ROLE_LABELS: Record<MemberViewRole, string> = {
  OWNER: 'Patron',
  SITE_LEAD: 'Şef',
  WORKER: 'Çalışan',
}

/** Yoklamayı yalnızca patron ve şef alır; çalışan yoklamada sayılır, menüsünde Yoklama yoktur. */
export const takesRollCall = (role: MemberViewRole | undefined) => role === 'OWNER' || role === 'SITE_LEAD'
