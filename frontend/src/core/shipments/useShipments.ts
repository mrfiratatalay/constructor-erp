import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getListShipmentsQueryKey,
  useListShipments,
} from '@/core/api/generated/shipments/shipments'
import type { ShipmentRow } from '@/core/api/generated/model'

/**
 * Firmanın hareket defteri en yeniden eskiye gelir. Mobil liste ve masaüstü çalışma alanı aynı kayıtları kullanır.
 */
export function useShipments(search: MaybeRefOrGetter<string>) {
  const { data, isLoading, isError, refetch } = useListShipments(() => ({
    search: toValue(search) || undefined,
  }))
  const all = computed<ShipmentRow[]>(() => data.value ?? [])
  return {
    shipments: all,
    /** Geri gelmesi beklenen ve henüz dönmemişler: "40 gündür dönmedi". */
    outside: computed(() => all.value.filter((row) => row.awaitingReturn)),
    isLoading,
    isError,
    refetch,
  }
}

/** Kaydettikten sonra liste ve ayrıntı yeniden okunur; ekranda eski hali kalmaz. */
export function useShipmentRefresh() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() })
}

/** Açık olan sevkiyatın kimliği adreste durur, böylece Saha kartı doğrudan buraya bağlanabilir. */
export function useOpenShipment() {
  return ref<string | null>(null)
}
