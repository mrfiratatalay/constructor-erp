import type { MemberViewRole } from '@/core/api/generated/model'

export const ROLE_LABELS: Record<MemberViewRole, string> = {
  OWNER: 'Patron',
  SITE_LEAD: 'Şantiye sorumlusu',
}

export const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as MemberViewRole[]).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}))
