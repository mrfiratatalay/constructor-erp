import type { QueryClient } from '@tanstack/vue-query'

/** Yoklamanın bütün sorguları bu önekle başlar (üretilen anahtarlar): kart, günün listesi, kişinin takvimi. */
const ROLL_CALL_QUERY_PREFIX = ['api', 'roll-calls']

/**
 * Biri katılınca ya da patron işaretleyince yoklamayı gösteren her ekran birlikte tazelenir: sohbetteki kartın
 * sayısı, patronun listesi ve kişinin takvimi aynı şeyi söyler.
 */
export function refreshRollCalls(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ROLL_CALL_QUERY_PREFIX })
}

/** Ayın Excel dosyası; tarayıcı düz bağlantıyla indirir, oturum çerezi gider ("yoklama-2026-09.xlsx"). */
export function rollCallExportUrl(month: string): string {
  return `/api/roll-calls/export?month=${month}`
}
