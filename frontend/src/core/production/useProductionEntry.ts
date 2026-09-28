import { useQueryClient } from '@tanstack/vue-query'
import { computed, reactive, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { ProductionItemView } from '@/core/api/generated/model'
import { useAddProductionEntry } from '@/core/api/generated/production/production'
import { newId } from '@/core/posts/newId'
import {
  emptyEntryForm,
  entryFormProblem,
  overflowQuestion,
  type EntryForm,
} from '@/core/production/entryForm'
import { preparedEntry } from '@/core/production/entryFiles'
import { refreshProduction } from '@/core/production/productionAccess'

/**
 * "Günlük İmalat Güncellemesi": bugün yapılan, çalışan sayısı, tarih, not, dosyalar, Saha'ya yansıt. Girişin
 * kimliği pencere açılırken üretilir ve kaydedilene kadar değişmez: yeniden denenen istek ikinci giriş açmaz.
 */
export function useProductionEntry(siteId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const add = useAddProductionEntry()
  const form = reactive<EntryForm>(emptyEntryForm())
  const entryId = ref(newId())
  const isPreparing = ref(false)

  function reset() {
    Object.assign(form, emptyEntryForm())
    entryId.value = newId()
  }

  async function save(item: ProductionItemView, files: File[]) {
    isPreparing.value = true
    try {
      const data = await preparedEntry(form, files, entryId.value)
      const entry = await add.mutateAsync({ itemId: item.id, data })
      await refreshProduction(queryClient, toValue(siteId), form.onField)
      return entry
    } finally {
      isPreparing.value = false
    }
  }

  return {
    form,
    reset,
    save,
    problem: computed(() => entryFormProblem(form)),
    overflow: (item: ProductionItemView) => overflowQuestion(item, form.quantity ?? 0),
    isSaving: computed(() => isPreparing.value || add.isPending.value),
  }
}
