import { useGetToday } from '@/core/api/generated/today/today'

/** Ana ekran sorgusunun öneki: gönderi ve okunma değişince buradan yenilenir. */
export const TODAY_QUERY_PREFIX = '/api/today'

/** Ekran açık bırakılabilir: dakikada bir kendiliğinden güncellenir. */
export function useToday() {
  const query = useGetToday({ query: { refetchInterval: 60_000 } })
  return { today: query.data, isLoading: query.isPending }
}
