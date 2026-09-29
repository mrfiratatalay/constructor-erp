import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListFieldShipmentRefs } from '@/core/api/generated/shipments/shipments'
import type { FieldShipmentRef } from '@/core/api/generated/model'

/**
 * Şantiyenin Saha akışındaki malzeme kartları: gönderi yalnızca referanstır, kart sevkiyatın güncel durumunu
 * buradan okur (iptal edilenin kartı "İptal" der). Malzemeyi görmeyen için liste boş gelir, gönderi düz yazıdır.
 */
export function useFieldShipmentRefs(siteId: MaybeRefOrGetter<string>) {
  const { data } = useListFieldShipmentRefs(() => ({ siteId: toValue(siteId) }))
  const byPost = computed(
    () => new Map<string, FieldShipmentRef>((data.value ?? []).map((ref) => [ref.postId, ref])),
  )
  return { refOf: (postId: string) => byPost.value.get(postId) }
}
