import type { Component } from 'vue'
import { ClipboardCheck, HardHat, UserRound } from 'lucide-vue-next'
import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'
import { takesRollCall } from '@/core/team/roles'

export interface NavItem {
  route: RouteName
  label: string
  icon: Component
}

/**
 * Günlük iş tek yerdedir: şantiyeler (herkes aynı listeyi görür, WhatsApp'ın "Sohbetler"i gibi). Gönderme ayrı
 * bir sekme değildir, şantiyenin içindedir. Ayrı bir Ekip ekranı da yoktur: kişiler şantiyenin içinde eklenir ve
 * yönetilir (WhatsApp'ta grubun katılımcıları gibi). Yoklama firmanın puantajıdır: patron ve şef görür, çalışan
 * yoklamada sayılır ama menüsünde Yoklama yoktur (TASARIM.md "Yoklama"). Masaüstünde "Ben" sol menünün altındaki
 * kullanıcı düğmesidir, o yüzden menüde yer almaz.
 */
export function mainNavItems(role: CurrentUserResponseRole, platform: 'mobile' | 'desktop'): NavItem[] {
  const sites: NavItem = { route: 'sites', label: 'Şantiyeler', icon: HardHat }
  const profile: NavItem = { route: 'profile', label: 'Ben', icon: UserRound }
  const attendance: NavItem = { route: 'attendance', label: 'Yoklama', icon: ClipboardCheck }
  const items = takesRollCall(role) ? [sites, attendance] : [sites]
  return platform === 'mobile' ? [...items, profile] : items
}

/** Alt sayfalar kendi sekmesini yakar: şantiye sayfasındayken "Şantiyeler" seçili görünür. */
const PARENT_ROUTE: Partial<Record<RouteName, RouteName>> = {
  siteFeed: 'sites',
  siteField: 'sites',
  siteTasks: 'sites',
  memberAttendance: 'attendance',
}

export function navRouteOf(route: RouteName): RouteName {
  return PARENT_ROUTE[route] ?? route
}
