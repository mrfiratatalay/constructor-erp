import type { QueryClient } from '@tanstack/vue-query'
import type { MemberViewRole } from '@/core/api/generated/model'
import { getGetProductionBoardQueryKey } from '@/core/api/generated/production/production'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/** İmalatı patron, şef ve depo sorumlusu görür; çalışanın İmalat sekmesi yoktur (Musa'nın kararı). */
export const canSeeProduction = (role: MemberViewRole | undefined) =>
  role === 'OWNER' || role === 'SITE_LEAD' || role === 'STOREKEEPER'

/** Veriyi yalnızca şantiye şefi girer: imalat açar, düzeltir, siler ve günlük girişleri yapar. */
export const canEnterProduction = (role: MemberViewRole | undefined) => role === 'SITE_LEAD'

/** Excel raporu: düz bir bağlantıyla iner, oturum çerezle gider (puantaj Excel'i gibi). */
export const productionExportUrl = (siteId: string) => `/api/sites/${siteId}/production/export`

/** İmalatın detayları ve taşeron listesi bu önekle başlar (üretilen anahtarlar). */
const PRODUCTION_PREFIX = ['api', 'production']

/**
 * Bir değişiklikten sonra imalatı gösteren her ekran tazelenir: İmalat sekmesi, açık detay, taşeronlar. Giriş
 * Saha'ya yansıtıldıysa Saha ve sohbet de (yeni saha güncellemesi düştü).
 */
export function refreshProduction(queryClient: QueryClient, siteId: string, onField = false) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: getGetProductionBoardQueryKey(siteId) }),
    queryClient.invalidateQueries({ queryKey: PRODUCTION_PREFIX }),
    ...(onField ? [refreshPostViews(queryClient, siteId)] : []),
  ])
}
