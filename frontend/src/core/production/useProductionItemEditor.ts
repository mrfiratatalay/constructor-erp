import { useQueryClient } from '@tanstack/vue-query'
import { computed, reactive, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { ProductionItemView } from '@/core/api/generated/model'
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

/**
 * "Yeni İmalat" ve düzenleme: aynı form, açılırken boş ya da imalatın bilgileriyle gelir. Kaydedilemiyorsa nedeni
 * (problem) düğmenin yanında yazar. Silme yalnızca girişi olmayan imalatta olur (sunucu söyler).
 */
export function useProductionItemEditor(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const refresh = () => refreshProduction(queryClient, toValue(siteId))
  const create = useCreateProductionItem({ mutation: { onSuccess: refresh } })
  const update = useUpdateProductionItem({ mutation: { onSuccess: refresh } })
  const remove = useDeleteProductionItem({ mutation: { onSuccess: refresh } })
  const form = reactive<ItemForm>({ ...EMPTY_ITEM_FORM })
  const editing = ref<ProductionItemView | null>(null)

  function open(item: ProductionItemView | null) {
    editing.value = item
    Object.assign(form, item ? itemFormOf(item) : EMPTY_ITEM_FORM)
  }

  function save() {
    const data = itemRequestOf(form)
    if (editing.value) return update.mutateAsync({ itemId: editing.value.id, data })
    return create.mutateAsync({ siteId: toValue(siteId), data })
  }

  return {
    form,
    editing,
    open,
    save,
    problem: computed(() => itemFormProblem(form)),
    isSaving: computed(() => create.isPending.value || update.isPending.value),
    removeItem: (item: ProductionItemView) => remove.mutateAsync({ itemId: item.id }),
  }
}
