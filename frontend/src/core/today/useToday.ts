import { useGetToday } from '@/core/api/generated/today/today'

/** Patron ekranı açık bırakabilir: dakikada bir kendiliğinden güncellenir. */
export function useToday() {
  const query = useGetToday({ query: { refetchInterval: 60_000 } })
  return { today: query.data, isLoading: query.isPending }
}
