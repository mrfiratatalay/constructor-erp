import type { Component } from 'vue'
import { Boxes, CalendarCheck, ClipboardCheck, HardHat, UserRound } from 'lucide-vue-next'
import type { CurrentUserResponse } from '@/core/api/generated/model'
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
 * yönetilir (WhatsApp'ta grubun katılımcıları gibi). Yoklama firmanın puantajıdır: patron ve şef alır ve görür;
 * çalışan yoklamada sayılır, onun menüsünde yerine Puantajım (kendi ayı) vardır (TASARIM.md "Yoklama"). Malzemeler
 * firmanın stoğudur; menüde rol adına göre değil, malzemeyi görme iznine göre durur.
 * Masaüstünde "Ben" sol menünün altındaki kullanıcı düğmesidir, o yüzden menüde yer almaz.
 */
export function mainNavItems(
  user: Pick<CurrentUserResponse, 'role' | 'permissions'>,
  platform: 'mobile' | 'desktop',
): NavItem[] {
  const items: NavItem[] = [{ route: 'sites', label: 'Şantiyeler', icon: HardHat }]
  if (takesRollCall(user.role))
    items.push({ route: 'attendance', label: 'Yoklama', icon: ClipboardCheck })
  if (user.role === 'WORKER')
    items.push({ route: 'myPuantaj', label: 'Puantajım', icon: CalendarCheck })
  if (user.permissions.includes('VIEW_MATERIALS'))
    items.push({ route: 'materials', label: 'Malzemeler', icon: Boxes })
  if (platform === 'mobile') items.push({ route: 'profile', label: 'Ben', icon: UserRound })
  return items
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
