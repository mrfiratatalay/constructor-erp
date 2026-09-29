import { ref } from 'vue'
import {
  useAttachShipmentDocuments,
  useCreateShipment,
} from '@/core/api/generated/shipments/shipments'
import type { ShipmentRequest } from '@/core/api/generated/model'
import { useShipmentRefresh } from '@/core/shipments/useShipments'

/**
 * Sevkiyatı kaydeder, varsa irsaliyeyi de yükler. İrsaliye ayrı bir istektir: sevkiyat kaydedilmişse fotoğraf
 * yüklenemese bile kayıt durur, kullanıcı sonra ekler — kamyon beklemez.
 */
export function useShipmentSave() {
  const create = useCreateShipment()
  const attach = useAttachShipmentDocuments()
  const refresh = useShipmentRefresh()
  const isSaving = ref(false)

  async function save(request: ShipmentRequest, documents: File[]) {
    isSaving.value = true
    try {
      const detail = await create.mutateAsync({ data: request })
      if (documents.length) {
        await attach.mutateAsync({ shipmentId: detail.row.id, data: { files: documents } })
      }
      await refresh()
      return detail
    } finally {
      isSaving.value = false
    }
  }

  return { save, isSaving }
}
