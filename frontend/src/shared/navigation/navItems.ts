import type { Component } from 'vue'
import { HardHat, TriangleAlert, UserRound, Users } from 'lucide-vue-next'
import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

export interface NavItem {
  route: RouteName
  label: string
  icon: Component
}

/** Patronun birden çok şantiyesi var; şantiye sorumlusu çoğunlukla tek şantiyeye bakar. */
const SITES_LABEL: Record<CurrentUserResponseRole, string> = { OWNER: 'Şantiyeler', SITE_LEAD: 'Şantiyem' }

const ITEMS: Record<'issues' | 'profile' | 'team', Omit<NavItem, 'route'>> = {
  issues: { label: 'Sorunlar', icon: TriangleAlert },
  profile: { label: 'Ben', icon: UserRound },
  team: { label: 'Ekip', icon: Users },
}

const item = (route: keyof typeof ITEMS): NavItem => ({ route, ...ITEMS[route] })

/** Günlük iş: iki rolde de aynı üç sekme. Gönderme ayrı bir sekme değildir, şantiyenin içindedir. */
export function mainNavItems(role: CurrentUserResponseRole, platform: 'mobile' | 'desktop'): NavItem[] {
  const sites: NavItem = { route: 'sites', label: SITES_LABEL[role], icon: HardHat }
  // Masaüstünde "Ben" sol menünün altındaki kullanıcı düğmesindedir.
  return platform === 'mobile' ? [sites, item('issues'), item('profile')] : [sites, item('issues')]
}

/**
 * Ayda bir yapılan işler günlük sekmeleri işgal etmez: mobilde "Ben" altında, masaüstünde ayrı grupta.
 * Şantiye ayarları burada değil, şantiyenin kendisinde (ekle: listede ＋, düzenle: ⓘ).
 */
export function manageNavItems(role: CurrentUserResponseRole): NavItem[] {
  return role === 'OWNER' ? [item('team')] : []
}

/** Alt sayfalar kendi sekmesini yakar: şantiye sayfasındayken "Şantiyeler" seçili görünür. */
const PARENT_ROUTE: Partial<Record<RouteName, RouteName>> = { siteFeed: 'sites', resolvedIssues: 'issues' }

export function navRouteOf(route: RouteName): RouteName {
  return PARENT_ROUTE[route] ?? route
}
