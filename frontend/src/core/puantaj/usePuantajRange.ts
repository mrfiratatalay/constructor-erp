import { keepPreviousData, type QueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useGetPuantaj } from '@/core/api/generated/puantaj/puantaj'
import { bookOf } from '@/core/puantaj/puantajBook'

/** Puantajın bütün sorguları bu önekle başlar (üretilen anahtarlar): bugünün ekranı, ayın cetveli, kişinin ayı. */
const PUANTAJ_QUERY_PREFIX = ['api', 'puantaj']

/** Bir işaret değişince puantajı gösteren her ekran birlikte tazelenir: hepsi aynı defteri okur. */
export function refreshPuantaj(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: PUANTAJ_QUERY_PREFIX })
}

/** Ayın Excel dosyası; tarayıcı düz bağlantıyla indirir, oturum çerezi gider ("puantaj-2026-09.xlsx"). */
export const puantajExportUrl = (month: string) => `/api/puantaj/export?month=${month}`

/**
 * İstenen günlerin puantajı, ekranın okuyacağı biçimde: personel ve ekip satırları. Ay değişirken önceki ay
 * ekranda kalır, yenisi gelince yer değiştirir (tablo boşalıp dolmaz).
 */
export function usePuantajRange(range: MaybeRefOrGetter<{ from: string; to: string }>) {
  const { data, isPending, error } = useGetPuantaj(() => toValue(range), {
    query: { placeholderData: keepPreviousData },
  })
  return {
    book: computed(() => bookOf(data.value)),
    today: computed(() => data.value?.today),
    isEmpty: computed(() => data.value?.entries.length === 0),
    isPending,
    error,
  }
}
