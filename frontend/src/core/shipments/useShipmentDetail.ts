import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useGetShipment } from '@/core/api/generated/shipments/shipments'

/** Açık sevkiyatın ayrıntısı: künyesi, kalemleri, irsaliyeleri ve değişmez geçmişi. */
export function useShipmentDetail(shipmentId: MaybeRefOrGetter<string | null>) {
  const enabled = computed(() => !!toValue(shipmentId))
  const { data, isLoading } = useGetShipment(() => toValue(shipmentId) ?? '', { query: { enabled } })
  return { detail: computed(() => (enabled.value ? (data.value ?? null) : null)), isLoading }
}
