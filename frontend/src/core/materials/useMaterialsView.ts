import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type MaterialsTab = 'movements' | 'stock'

/**
 * Malzemeler sayfasının adresteki durumu: sekme (?sekme=stok), açık hareket (?hareket=…) ve açık malzeme kartı
 * (?kart=…). Saha kartı hareketin ayrıntısına bu adresle bağlanır; geri tuşu açılan paneli kapatır gibi davranmaz,
 * sayfadan çıkar (panel değişimi geçmişe yazılmaz).
 */
export function useMaterialsView() {
  const route = useRoute()
  const router = useRouter()
  const text = (value: unknown) => (typeof value === 'string' && value ? value : null)

  const tab = computed<MaterialsTab>(() => (route.query.sekme === 'stok' ? 'stock' : 'movements'))
  const movementId = computed(() => text(route.query.hareket))
  const materialId = computed(() => text(route.query.kart))

  const change = (patch: Record<string, string | undefined>) =>
    router.replace({ query: { ...route.query, ...patch } })

  return {
    tab,
    movementId,
    materialId,
    setTab: (next: MaterialsTab) => change({ sekme: next === 'stock' ? 'stok' : undefined }),
    openMovement: (id: string) => change({ hareket: id }),
    closeMovement: () => change({ hareket: undefined }),
    openMaterial: (id: string) => change({ kart: id }),
    closeMaterial: () => change({ kart: undefined }),
  }
}
