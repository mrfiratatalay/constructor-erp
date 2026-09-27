import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type PuantajTab = 'today' | 'month'

/**
 * Yoklama'nın iki sekmesi: Bugün (şefin sabahı) ve Puantaj (ayın cetveli). Sekme adreste durur (?sekme=puantaj):
 * geri tuşu ve paylaşılan bağlantı aynı sekmeyi açar. Menüden girince Bugün açılır.
 */
export function usePuantajTab() {
  const route = useRoute()
  const router = useRouter()
  const tab = computed<PuantajTab>(() => (route.query.sekme === 'puantaj' ? 'month' : 'today'))
  const setTab = (next: PuantajTab) =>
    router.replace({ query: { ...route.query, sekme: next === 'month' ? 'puantaj' : undefined } })
  return { tab, setTab }
}
