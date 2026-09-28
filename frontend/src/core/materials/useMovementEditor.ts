import { computed, ref, watch, type Ref } from 'vue'
import type { MovementDetail } from '@/core/api/generated/model'
import { movementFields } from '@/core/materials/movementFields'
import { emptyMovementForm, movementFormError, type MovementForm } from '@/core/materials/movementForm'
import { useAwaitingReturns } from '@/core/materials/useAwaitingReturns'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMovementSave } from '@/core/materials/useMovementSave'
import { useStockRows } from '@/core/materials/useStockRows'

/** Formun çevresinden okunanlar: seçili malzeme, ödünç çıkışı, kaynaktaki kullanılabilir stok, şantiyeye dokunuyor mu. */
function useFormContext(form: Ref<MovementForm>) {
  const options = useMaterialOptions()
  const stock = useStockRows()
  const loans = useAwaitingReturns()
  const fields = computed(() => movementFields(form.value.type, form.value.purpose))
  const loan = computed(() => (form.value.type === 'RETURN' ? loans.loanOf(form.value.returnOfId) : null))
  const available = computed(() =>
    fields.value.source ? stock.availableAt(form.value.materialId, form.value.sourceId) : null,
  )
  const touchesSite = computed(() =>
    [form.value.sourceId, form.value.destinationId].some((id) => options.locationOf(id)?.kind === 'SITE'),
  )
  const material = computed(() => options.materialOf(form.value.materialId))
  return { options, loans, fields, loan, available, touchesSite, material }
}

/**
 * Yeni hareket formunun beyni, iki kabukta ortak (masaüstünde çekmece, telefonda tam ekran): açılınca form sıfırlanır
 * ya da verilen başlangıçla (iade için ödünçten) dolar; ödünç seçilince malzeme, kalan miktar ve dönüş lokasyonu
 * gelir; Saha anahtarı yalnızca şantiyeye dokunan harekette geçerlidir. Görünüm yalnızca alanları çizer.
 */
export function useMovementEditor(open: Ref<boolean>, initial: () => MovementForm | null) {
  const form = ref<MovementForm>(emptyMovementForm())
  const context = useFormContext(form)
  const { save, isSaving } = useMovementSave()

  watch(open, (isOpen) => isOpen && (form.value = { ...(initial() ?? emptyMovementForm()) }))
  watch(context.loan, (picked) => {
    if (!picked) return
    Object.assign(form.value, { materialId: picked.materialId, quantity: picked.remaining })
    form.value.destinationId ??= picked.sourceId
  })

  const problem = () =>
    movementFormError(form.value, {
      available: context.available.value,
      unit: context.material.value?.unit ?? '',
      loan: context.loan.value,
    })
  const submit = (): Promise<MovementDetail> =>
    save(
      { ...form.value, reflectToField: context.touchesSite.value && form.value.reflectToField },
      context.options.parties.value,
    )
  const pickMaterial = (materialId: string) => (form.value.materialId = materialId)

  return { form, ...context, isSaving, problem, submit, pickMaterial }
}
