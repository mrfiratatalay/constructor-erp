import type { MemberViewRole } from '@/core/api/generated/model'

export type RoleAction = 'makeOwner' | 'makeLead' | 'makeWorker'

/** Onay penceresinin yazıları: rolün ne getirdiğini kişinin adıyla söyler. */
export interface RoleChangeCopy {
  title: string
  message: string
  confirm: string
  done: string
}

export const ROLE_OF_ACTION: Record<RoleAction, MemberViewRole> = {
  makeOwner: 'OWNER',
  makeLead: 'SITE_LEAD',
  makeWorker: 'WORKER',
}

const COPY: Record<MemberViewRole, Omit<RoleChangeCopy, 'title'> & { noun: string }> = {
  OWNER: {
    noun: 'patron',
    message: 'Kişileri düzeltir, rollerini değiştirir, firmadan çıkarır; geçmiş yoklamayı düzeltir ve puantajı indirir.',
    confirm: 'Patron yap',
    done: 'Patron yapıldı',
  },
  SITE_LEAD: {
    noun: 'şef',
    message: 'Her sabah yoklamayı alır; kendisi yoklamada sayılmaz. Kişileri yönetemez.',
    confirm: 'Şef yap',
    done: 'Şef yapıldı',
  },
  WORKER: {
    noun: 'çalışan',
    message: 'Görmeye ve yazmaya devam eder; yoklamada sayılır, yoklama alamaz.',
    confirm: 'Çalışan yap',
    done: 'Çalışan yapıldı',
  },
}

export function roleChangeCopy(fullName: string, role: MemberViewRole): RoleChangeCopy {
  const { noun, ...copy } = COPY[role]
  return { title: `${fullName} ${noun} olsun mu?`, ...copy }
}

/** Kişinin menüsünde sahip olmadığı iki rol: "Patron yap", "Şef yap", "Çalışan yap" (bu sırayla). */
export function roleActions(current: MemberViewRole): { action: RoleAction; label: string }[] {
  return (Object.keys(ROLE_OF_ACTION) as RoleAction[])
    .filter((action) => ROLE_OF_ACTION[action] !== current)
    .map((action) => ({ action, label: COPY[ROLE_OF_ACTION[action]].confirm }))
}
