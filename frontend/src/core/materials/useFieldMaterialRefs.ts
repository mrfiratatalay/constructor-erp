import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListFieldMaterialRefs } from '@/core/api/generated/materials/materials'
import type { FieldMaterialRef } from '@/core/api/generated/model'

/**
 * Şantiyenin Saha akışındaki malzeme kartları: gönderi yalnızca referanstır, kart hareketin güncel durumunu buradan
 * okur (iptal edilen hareketin kartı "İptal" der). Malzemeyi görmeyen için liste boş gelir, gönderi düz yazıdır.
 */
export function useFieldMaterialRefs(siteId: MaybeRefOrGetter<string>) {
  const { data } = useListFieldMaterialRefs(() => ({ siteId: toValue(siteId) }))
  const byPost = computed(
    () => new Map<string, FieldMaterialRef>((data.value ?? []).map((ref) => [ref.postId, ref])),
  )
  return { refOf: (postId: string) => byPost.value.get(postId) }
}
