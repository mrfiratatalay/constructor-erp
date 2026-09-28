import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import {
  useAttachDocuments,
  useCreateMaterialMovement,
} from '@/core/api/generated/materials/materials'
import type { MovementDetail, PartyView } from '@/core/api/generated/model'
import { TYPE_LOOKS } from '@/core/materials/materialLabels'
import { movementFrom, movementTo } from '@/core/materials/movementEnds'
import { movementRequestOf, type MovementForm } from '@/core/materials/movementForm'
import { refreshMaterials } from '@/core/materials/refreshMaterials'
import { withUnit } from '@/core/materials/quantity'

/**
 * Yeni hareketi kaydeder, belgelerini ekler ve malzemeyi gösteren her ekranı tazeler. Kayıt geçip belge yüklemesi
 * düşerse hareket yerinde kalır; aynı formla tekrar denenince hareket yeniden açılmaz (kimlik aynı), yalnızca
 * belgeler gider.
 */
export function useMovementSave() {
  const queryClient = useQueryClient()
  const create = useCreateMaterialMovement()
  const attach = useAttachDocuments()

  async function save(form: MovementForm, parties: PartyView[]): Promise<MovementDetail> {
    const detail = await create.mutateAsync({ data: movementRequestOf(form, parties) })
    if (form.files.length > 0) {
      await attach.mutateAsync({ movementId: detail.movement.id, data: { files: form.files } })
    }
    await refreshMaterials(queryClient)
    return detail
  }

  return { save, isSaving: computed(() => create.isPending.value || attach.isPending.value) }
}

/** Kayıttan sonraki kısa özet: "Şantiyeye Gönderildi · Çimento, 300 Torba · Ana Depo → Çamburnu Plaza". */
export function savedSummary(detail: MovementDetail): string {
  const row = detail.movement
  return `${TYPE_LOOKS[row.type].label} · ${row.materialName}, ${withUnit(row.quantity, row.unit)} · ${movementFrom(row)} → ${movementTo(row)}`
}
