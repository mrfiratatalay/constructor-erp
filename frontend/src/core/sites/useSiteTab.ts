import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteName } from '@/core/navigation/routeTable'

/** Şantiyenin iki yüzü: Sohbet (WhatsApp grubu) ve Saha (şantiyenin günlüğü, en yenisi üstte). */
export type SiteTab = 'chat' | 'field'

export const SITE_TABS: ReadonlyArray<{ tab: SiteTab; label: string }> = [
  { tab: 'chat', label: 'Sohbet' },
  { tab: 'field', label: 'Saha' },
]

const ROUTE_OF: Record<SiteTab, RouteName> = { chat: 'siteFeed', field: 'siteField' }

/**
 * Seçili sekme adreste durur (/santiyeler/:id/saha paylaşılabilir). Sekme değişimi geçmişe yazılmaz: geri
 * tuşu şantiyeden çıkarır, sekmeler arasında dolaştırmaz.
 */
export function useSiteTab() {
  const route = useRoute()
  const router = useRouter()
  const tab = computed<SiteTab>(() => (route.name === ROUTE_OF.field ? 'field' : 'chat'))

  /** postId: sohbette o mesaja gidilir ("Sohbette göster"); mesaj kısa süre sarı yanar. */
  function open(next: SiteTab, postId?: string) {
    const query = postId ? { mesaj: postId } : {}
    return router.replace({ name: ROUTE_OF[next], params: { siteId: route.params.siteId }, query })
  }

  return { tab, open }
}
