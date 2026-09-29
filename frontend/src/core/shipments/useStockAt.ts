import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListStockAt } from '@/core/api/generated/shipments/shipments'

/**
 * Bir yerdeki kalan malzeme. Ayrı bir stok ekranı yoktur: bu sayı yalnızca malzeme seçilirken altında tek satır
 * olarak görünür ("Depoda: 300 Torba"), çünkü depo sorumlusunun onu merak ettiği an gönderirken olan andır.
 */
export function useStockAt(placeId: MaybeRefOrGetter<string | null>) {
  const { data } = useListStockAt(() => ({ placeId: toValue(placeId) ?? '' }), {
    query: { enabled: computed(() => !!toValue(placeId)) },
  })
  const byMaterial = computed(() => new Map((data.value ?? []).map((level) => [level.materialId, level.quantity])))
  return { quantityOf: (materialId: string) => byMaterial.value.get(materialId) ?? 0 }
}
