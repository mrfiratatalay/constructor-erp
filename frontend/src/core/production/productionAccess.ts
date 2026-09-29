import type { QueryClient } from '@tanstack/vue-query'
import { getGetProductionBoardQueryKey } from '@/core/api/generated/production/production'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

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
