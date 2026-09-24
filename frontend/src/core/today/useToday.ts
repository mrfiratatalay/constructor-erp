import { getGetTodayQueryKey, useGetToday } from '@/core/api/generated/today/today'

/** Ana ekran sorgusunun anahtarı: mesaj, okunma, sabitleme değişince buradan yenilenir. */
export const TODAY_QUERY_KEY = getGetTodayQueryKey()

/** Ekran açık bırakılabilir: yeni mesajlar ve tikler için 15 saniyede bir kendiliğinden güncellenir. */
export function useToday() {
  const query = useGetToday({ query: { refetchInterval: 15_000 } })
  return { today: query.data, isLoading: query.isPending }
}
