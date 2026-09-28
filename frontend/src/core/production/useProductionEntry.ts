import { useQueryClient } from '@tanstack/vue-query'
import { computed, reactive, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
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
import { parseQuantity } from '@/core/production/quantityInput'
import { refreshProduction } from '@/core/production/productionAccess'

/** İş sürerken bayrak kalkar, bitince (başarılı olsun olmasın) iner: fotoğraf küçültülürken de düğme bekler. */
async function whileBusy<T>(flag: Ref<boolean>, work: () => Promise<T>): Promise<T> {
  flag.value = true
  try {
    return await work()
  } finally {
    flag.value = false
  }
}

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
  /** Yazıdan okunan miktar: toplamı aşma sorusu ve "+3,5 ton" bildirimi bunu kullanır. */
  const quantity = computed(() => parseQuantity(form.quantity) ?? 0)

  function reset() {
    Object.assign(form, emptyEntryForm())
    entryId.value = newId()
  }

  const save = (item: ProductionItemView, files: File[]) =>
    whileBusy(isPreparing, async () => {
      const data = await preparedEntry(form, files, entryId.value)
      const entry = await add.mutateAsync({ itemId: item.id, data })
      await refreshProduction(queryClient, toValue(siteId), form.onField)
      return entry
    })

  return {
    form,
    reset,
    save,
    problem: computed(() => entryFormProblem(form)),
    overflow: (item: ProductionItemView) => overflowQuestion(item, quantity.value),
    quantity,
    isSaving: computed(() => isPreparing.value || add.isPending.value),
  }
}
