import type { MemberViewRole } from '@/core/api/generated/model'

/** İmalatı patron, şef ve depo sorumlusu görür; çalışanın İmalat sekmesi yoktur (Musa'nın kararı). */
export const canSeeProduction = (role: MemberViewRole | undefined) =>
  role === 'OWNER' || role === 'SITE_LEAD' || role === 'STOREKEEPER'

/** Veriyi yalnızca şantiye şefi girer: imalat açar, düzeltir, siler ve günlük girişleri yapar. */
export const canEnterProduction = (role: MemberViewRole | undefined) => role === 'SITE_LEAD'
