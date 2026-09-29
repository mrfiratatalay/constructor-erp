import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getListShipmentsQueryKey,
  useListShipments,
} from '@/core/api/generated/shipments/shipments'
import type { ShipmentRow } from '@/core/api/generated/model'

/**
 * Sevkiyat listesi: WhatsApp'ın sohbet listesi gibi tek liste, en yeniden eskiye. Süzgeç yoktur, arama vardır.
 * Ayrıca "dışarıda" olanlar çıkarılır: geri gelmesi beklenip henüz dönmeyenler, peşine düşülecek tek şey.
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
  return () => queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey().slice(0, 1) })
}

/** Açık olan sevkiyatın kimliği adreste durur, böylece Saha kartı doğrudan buraya bağlanabilir. */
export function useOpenShipment() {
  return ref<string | null>(null)
}
