import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListFieldShipmentRefs } from '@/core/api/generated/shipments/shipments'
import type { FieldShipmentRef } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'

/**
 * Şantiyenin Saha akışındaki malzeme kartları: gönderi yalnızca referanstır, kart sevkiyatın güncel durumunu
 * buradan okur (iptal edilenin kartı "İptal" der). Malzemeyi görmeyen (izni ya da paketinde modülü yok) için liste
 * hiç istenmez, gönderi düz yazıdır.
 */
export function useFieldShipmentRefs(siteId: MaybeRefOrGetter<string>) {
  const { data: user } = useCurrentUser()
  const canSee = computed(() => user.value?.permissions.includes('VIEW_MATERIALS') ?? false)
  const { data } = useListFieldShipmentRefs(() => ({ siteId: toValue(siteId) }), { query: { enabled: canSee } })
  const byPost = computed(
    () => new Map<string, FieldShipmentRef>((data.value ?? []).map((ref) => [ref.postId, ref])),
  )
  return { refOf: (postId: string) => byPost.value.get(postId) }
}
