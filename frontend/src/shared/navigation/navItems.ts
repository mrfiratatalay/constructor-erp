import type { Component } from 'vue'
import { HardHat, UserRound } from 'lucide-vue-next'
import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

export interface NavItem {
  route: RouteName
  label: string
  icon: Component
}

/** Herkes aynı listeyi görür (WhatsApp'ın "Sohbetler"i gibi); tek şantiyesi olan şef için de ad aynı. */
const SITES_LABEL: Record<CurrentUserResponseRole, string> = { OWNER: 'Şantiyeler', SITE_LEAD: 'Şantiyeler' }

/**
 * Günlük iş tek yerdedir: şantiyeler. Gönderme ayrı bir sekme değildir, şantiyenin içindedir. Ayrı bir Ekip
 * ekranı da yoktur: kişiler şantiyenin içinde eklenir ve yönetilir (WhatsApp'ta grubun katılımcıları gibi).
 * Masaüstünde "Ben" sol menünün altındaki kullanıcı düğmesidir, o yüzden menüde yer almaz.
 */
export function mainNavItems(role: CurrentUserResponseRole, platform: 'mobile' | 'desktop'): NavItem[] {
  const sites: NavItem = { route: 'sites', label: SITES_LABEL[role], icon: HardHat }
  const profile: NavItem = { route: 'profile', label: 'Ben', icon: UserRound }
  return platform === 'mobile' ? [sites, profile] : [sites]
}

/** Alt sayfalar kendi sekmesini yakar: şantiye sayfasındayken "Şantiyeler" seçili görünür. */
const PARENT_ROUTE: Partial<Record<RouteName, RouteName>> = { siteFeed: 'sites', siteField: 'sites', siteTasks: 'sites' }

export function navRouteOf(route: RouteName): RouteName {
  return PARENT_ROUTE[route] ?? route
}
