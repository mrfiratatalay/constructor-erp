import { ref } from 'vue'
import type { MaterialView, StockRow } from '@/core/api/generated/model'
import { emptyMovementForm, returnFormOf, type MovementForm } from '@/core/materials/movementForm'
import { useAwaitingReturns } from '@/core/materials/useAwaitingReturns'
import { useStockRows } from '@/core/materials/useStockRows'

/**
 * Yeni hareket çekmecesi (boş, ya da iade için ödünçten doldurulmuş) ve beklenen iadeler paneli. İade boş formdan
 * değil ödünç çıkışından başlar: malzeme, firma ve kalan miktar oradan gelir.
 */
function useMovementPanel() {
  const loans = useAwaitingReturns()
  const movementOpen = ref(false)
  const movementInitial = ref<MovementForm | null>(null)
  const returnsOpen = ref(false)

  function createMovement(form: MovementForm | null = null) {
    movementInitial.value = form
    movementOpen.value = true
  }

  function takeReturn(loanId: string) {
    const loan = loans.loanOf(loanId)
    returnsOpen.value = false
    createMovement(loan ? returnFormOf(loan) : { ...emptyMovementForm('RETURN'), returnOfId: loanId })
  }

  return { movementOpen, movementInitial, returnsOpen, createMovement, takeReturn }
}

/** Malzeme kartı formu (hareket formunun içinden de açılır, yazılan ad taşınır) ve sayım düzeltmesi. */
function useCatalogPanels() {
  const stock = useStockRows()
  const materialFormOpen = ref(false)
  const editingMaterial = ref<MaterialView | null>(null)
  const materialName = ref('')
  const adjusting = ref<{ row: StockRow; locationId: string | null } | null>(null)

  function editMaterial(material: MaterialView | null, name = '') {
    editingMaterial.value = material
    materialName.value = name
    materialFormOpen.value = true
  }

  function adjust(materialId: string, locationId: string | null) {
    const row = stock.all.value.find((item) => item.materialId === materialId)
    if (row) adjusting.value = { row, locationId: locationId ?? row.locations[0]?.locationId ?? null }
  }

  return { materialFormOpen, editingMaterial, materialName, adjusting, editMaterial, adjust }
}

/**
 * Malzemeler sayfasının açılır pencereleri tek yerde. Açık hareket ve açık malzeme kartı adreste durur
 * (useMaterialsView); bunlar durmaz, sayfa yenilenince kapanır.
 */
export function useMaterialPanels() {
  return { ...useMovementPanel(), ...useCatalogPanels(), exportOpen: ref(false) }
}
