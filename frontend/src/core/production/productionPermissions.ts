import type { CurrentUserResponse } from '@/core/api/generated/model'

type Viewer = Pick<CurrentUserResponse, 'permissions'> | undefined

/**
 * İlerlemeyi patron, şef ve depo sorumlusu görür; çalışanın sekmesi yoktur (Musa'nın kararı). Kim neyi görür
 * backend'in izinlerindedir (Permission), arayüz rol adından iş çıkarmaz.
 */
export const canSeeProduction = (user: Viewer) => user?.permissions.includes('VIEW_PRODUCTION') ?? false

/** Veriyi yalnızca şantiye şefi girer: iş kalemi açar, düzeltir, siler ve günlük girişleri yapar. */
export const canEnterProduction = (user: Viewer) => user?.permissions.includes('MANAGE_PRODUCTION') ?? false
