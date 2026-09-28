import { computed } from 'vue'
import { useRoute, type LocationQuery } from 'vue-router'

const DAY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Kişinin panelinde açılacak gün adreste durur (?gun=2026-09-09): cetvelde bir hücreye tıklayınca panel o gün seçili
 * açılır, adına tıklayınca bugünle. Sekme ve ay sorguda yerinde kalır.
 */
export function useDayParam() {
  const route = useRoute()
  const day = computed(() => {
    const value = route.query.gun
    return typeof value === 'string' && DAY.test(value) ? value : null
  })

  function queryWith(next: string | null): LocationQuery {
    const query = { ...route.query }
    delete query.gun
    return next ? { ...query, gun: next } : query
  }

  return { day, queryWith }
}
