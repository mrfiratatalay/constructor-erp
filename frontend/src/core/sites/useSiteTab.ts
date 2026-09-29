import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CurrentUserResponse } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'
import { canSeeProduction } from '@/core/production/productionPermissions'

/**
 * Şantiyenin yüzleri: Sohbet (WhatsApp grubu), Saha (şantiyenin günlüğü, en yenisi üstte) ve İmalat (gerçekleşen
 * üretim; yalnızca patron, şef ve depo sorumlusu görür).
 */
export type SiteTab = 'chat' | 'field' | 'production'

export interface SiteTabItem {
  tab: SiteTab
  label: string
}

const SITE_TABS: ReadonlyArray<SiteTabItem> = [
  { tab: 'chat', label: 'Sohbet' },
  { tab: 'field', label: 'Saha' },
  { tab: 'production', label: 'İlerleme' },
]

/** Kişinin göreceği sekmeler: çalışanda Sohbet ve Saha, imalatı görenlerde İmalat da. */
export function siteTabsFor(user: Pick<CurrentUserResponse, 'permissions'> | undefined): SiteTabItem[] {
  return SITE_TABS.filter((item) => item.tab !== 'production' || canSeeProduction(user))
}

const ROUTE_OF: Record<SiteTab, RouteName> = {
  chat: 'siteFeed',
  field: 'siteField',
  production: 'siteProduction',
}
const TAB_OF: Partial<Record<RouteName, SiteTab>> = { siteField: 'field', siteProduction: 'production' }

/**
 * Seçili sekme adreste durur (/santiyeler/:id/saha paylaşılabilir). Sekme değişimi geçmişe yazılmaz: geri
 * tuşu şantiyeden çıkarır, sekmeler arasında dolaştırmaz.
 */
export function useSiteTab() {
  const route = useRoute()
  const router = useRouter()
  const tab = computed<SiteTab>(() => TAB_OF[route.name as RouteName] ?? 'chat')

  /** postId: sohbette o mesaja gidilir ("Sohbette göster"); mesaj kısa süre sarı yanar. */
  function open(next: SiteTab, postId?: string) {
    const query = postId ? { mesaj: postId } : {}
    return router.replace({ name: ROUTE_OF[next], params: { siteId: route.params.siteId }, query })
  }

  return { tab, open }
}
