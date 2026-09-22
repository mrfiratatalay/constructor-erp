import type { Component } from 'vue'
import { CirclePlus, HardHat, LayoutDashboard, Newspaper, TriangleAlert, UserRound, Users } from 'lucide-vue-next'
import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

export interface NavItem {
  route: RouteName
  label: string
  icon: Component
  /** Ana eylem: mobilde ortada büyük düğme, masaüstünde menünün üstünde düğme. */
  primary?: boolean
}

const ITEMS: Partial<Record<RouteName, Omit<NavItem, 'route'>>> = {
  today: { label: 'Bugün', icon: LayoutDashboard },
  feed: { label: 'Akış', icon: Newspaper },
  compose: { label: 'Gönder', icon: CirclePlus, primary: true },
  issues: { label: 'Sorunlar', icon: TriangleAlert },
  sites: { label: 'Şantiyeler', icon: HardHat },
  team: { label: 'Ekip', icon: Users },
  profile: { label: 'Ben', icon: UserRound },
}

/**
 * Mobilde en fazla beş sekme (başparmakla rahat kullanım): patron Şantiyeler ve Ekip'e "Ben"den ulaşır.
 * Masaüstünde yer bol; hepsi sol menüde. Yetki yine adres korumasıyla denetlenir, burası yalnızca görünüm.
 */
const MENUS: Record<'mobile' | 'desktop', Record<CurrentUserResponseRole, RouteName[]>> = {
  mobile: {
    OWNER: ['today', 'feed', 'compose', 'issues', 'profile'],
    SITE_LEAD: ['feed', 'sites', 'compose', 'issues', 'profile'],
  },
  desktop: {
    OWNER: ['compose', 'today', 'feed', 'issues', 'sites', 'team'],
    SITE_LEAD: ['compose', 'feed', 'issues', 'sites'],
  },
}

export function navItemsFor(role: CurrentUserResponseRole, platform: 'mobile' | 'desktop'): NavItem[] {
  return MENUS[platform][role].map((route) => ({ route, ...ITEMS[route]! }))
}
