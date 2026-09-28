import { useQueryClient } from '@tanstack/vue-query'
import { computed, reactive, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { CrewRef, ProductionItemView } from '@/core/api/generated/model'
import {
  useCreateProductionItem,
  useDeleteProductionItem,
  useUpdateProductionItem,
} from '@/core/api/generated/production/production'
import {
  EMPTY_ITEM_FORM,
  itemFormOf,
  itemFormProblem,
  itemRequestOf,
  type ItemForm,
} from '@/core/production/itemForm'
import { refreshProduction } from '@/core/production/productionAccess'
import { useProductionCrews } from '@/core/production/useProductionCrews'

/**
 * Taşeron seçenekleri: yoklamadaki ekipler; düzenlenen imalatın ekibi listeden çıkmışsa o da (adıyla görünsün).
 */
export function crewChoices(crews: CrewRef[], editing: ProductionItemView | null): CrewRef[] {
  const own = editing?.crew
  return own && !crews.some((crew) => crew.id === own.id) ? [...crews, own] : crews
}

/** İmalat açma, düzeltme ve silme istekleri; her biri başarıyla bitince imalat ekranları tazelenir. */
function useItemMutations(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const options = { mutation: { onSuccess: () => refreshProduction(queryClient, toValue(siteId)) } }
  return {
    create: useCreateProductionItem(options),
    update: useUpdateProductionItem(options),
    remove: useDeleteProductionItem(options),
  }
}

/**
 * "Yeni İmalat" ve düzenleme: aynı form, açılırken boş ya da imalatın bilgileriyle gelir. Taşeron listede yoksa şef
 * adını yazar; kaydederken ekip olarak eklenir (yoklamaya da girer). Silme yalnızca girişi olmayan imalatta olur.
 */
export function useProductionItemEditor(
  siteId: MaybeRefOrGetter<string>,
  isOpen: MaybeRefOrGetter<boolean>,
) {
  const { create, update, remove } = useItemMutations(siteId)
  const { crews, resolve, isAdding } = useProductionCrews(isOpen)
  const form = reactive<ItemForm>({ ...EMPTY_ITEM_FORM })
  const editing = ref<ProductionItemView | null>(null)
  const choices = computed(() => crewChoices(crews.value, editing.value))

  function open(item: ProductionItemView | null) {
    editing.value = item
    Object.assign(form, item ? itemFormOf(item) : EMPTY_ITEM_FORM)
  }

  async function save() {
    const data = itemRequestOf({ ...form, crewId: await resolve(form.crewId, choices.value) })
    if (editing.value) return update.mutateAsync({ itemId: editing.value.id, data })
    return create.mutateAsync({ siteId: toValue(siteId), data })
  }

  return {
    form,
    editing,
    crews: choices,
    open,
    save,
    problem: computed(() => itemFormProblem(form)),
    isSaving: computed(() => create.isPending.value || update.isPending.value || isAdding.value),
    removeItem: (item: ProductionItemView) => remove.mutateAsync({ itemId: item.id }),
  }
}
