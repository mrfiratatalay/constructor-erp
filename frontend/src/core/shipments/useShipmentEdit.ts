import { useEditShipment } from '@/core/api/generated/shipments/shipments'
import type { ShipmentEditRequest } from '@/core/api/generated/model'
import { useShipmentRefresh } from '@/core/shipments/useShipments'

/** Tarih ve not güncellemesi kaydı silmez; sunucu değişikliği hareket geçmişine yazar. */
export function useShipmentEdit() {
  const mutation = useEditShipment()
  const refresh = useShipmentRefresh()
  async function edit(shipmentId: string, data: ShipmentEditRequest) {
    await mutation.mutateAsync({ shipmentId, data })
    await refresh()
  }
  return { edit, isSaving: mutation.isPending }
}
