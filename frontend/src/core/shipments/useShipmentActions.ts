import { computed } from 'vue'
import { useCancelShipment, useReceiveShipmentReturn } from '@/core/api/generated/shipments/shipments'
import { useShipmentRefresh } from '@/core/shipments/useShipments'

/**
 * Sevkiyata sonradan yapılan iki şey: dışarıdakinin iadesini almak ve sevkiyatı iptal etmek. İptalin nedeni
 * zorunludur ve geçmişte kalır; kayıt silinmez.
 */
export function useShipmentActions() {
  const cancelShipment = useCancelShipment()
  const receiveReturn = useReceiveShipmentReturn()
  const refresh = useShipmentRefresh()

  async function cancel(shipmentId: string, reason: string) {
    await cancelShipment.mutateAsync({ shipmentId, data: { reason } })
    await refresh()
  }

  /** Dışarıdaki malzeme geri geldi: malzeme, firma ve dönüş yeri çıkışın kendisinden gelir, form sorulmaz. */
  async function receive(shipmentId: string) {
    await receiveReturn.mutateAsync({ shipmentId })
    await refresh()
  }

  return {
    cancel,
    receive,
    isBusy: computed(() => cancelShipment.isPending.value || receiveReturn.isPending.value),
  }
}
