import type { MovementStatus } from '@/core/materials/materialLabels'
import type { MaterialPermission } from '@/core/materials/useMaterialPermissions'

/** Hareketin yapılabilecek adımları; her biri hem izne hem hareketin durumuna bağlıdır. */
export interface MovementActionSet {
  deliver: boolean
  takeReturn: boolean
  edit: boolean
  cancel: boolean
}

/**
 * Teslim alma yalnızca yoldaki ya da kontrol bekleyen harekette, iade alma yalnızca iadesi beklenen ödünçte olur.
 * İptal edilmiş hareket düzeltilmez, yeniden iptal edilmez. Düğmeler rol adına değil izne göre görünür. Tablonun ⋯
 * menüsü ve ayrıntı paneli aynı kuralı kullanır.
 */
export function movementActions(status: MovementStatus, can: (permission: MaterialPermission) => boolean) {
  const open = status !== 'CANCELLED'
  return {
    deliver: can('CONFIRM_DELIVERY') && (status === 'IN_TRANSIT' || status === 'PENDING_CHECK'),
    takeReturn: can('CREATE_MATERIAL_MOVEMENT') && (status === 'AWAITING_RETURN' || status === 'PARTIALLY_RETURNED'),
    edit: can('UPDATE_MATERIAL_MOVEMENT') && open,
    cancel: can('CANCEL_MATERIAL_MOVEMENT') && open,
  } satisfies MovementActionSet
}

/** Teslim düğmesinin yazısı: gelen malzemede kontrol, sevkiyatta teslim. */
export const deliverLabel = (status: MovementStatus) =>
  status === 'PENDING_CHECK' ? 'Kontrol edildi' : 'Teslim alındı'
