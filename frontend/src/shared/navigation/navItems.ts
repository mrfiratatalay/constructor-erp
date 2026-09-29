import type { Component } from 'vue'
import {
  Boxes,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  FileClock,
  HardHat,
  Inbox,
  LayoutDashboard,
  Package,
  UserRound,
} from 'lucide-vue-next'
import { ROUTES, type RouteName } from '@/core/navigation/routeTable'
import { routeAllows, type WorkspaceViewer } from '@/core/team/roles'

export interface NavItem {
  route: RouteName
  label: string
  icon: Component
  /** Yalnızca bu kabukta görünür (masaüstünde Hesabım paneldir, telefonda Firma Hesabım'ın içindedir). */
  only?: 'mobile' | 'desktop'
}

/**
 * Firmanın menüsü, tek yerde. Görünürlük öğenin adresinden okunur (rol, izin, paketteki modül; routeTable): menü
 * ile adres kuralı ayrışamaz, yeni modül yalnızca buraya bir satır ekler. Günlük iş şantiyelerdedir (WhatsApp'ın
 * "Sohbetler"i gibi); Yoklama patron ve şefin, Puantajım çalışanın, Malzemeler malzemeyi görenin, Firma patronun.
 */
const WORKSPACE_ITEMS: readonly NavItem[] = [
  { route: 'sites', label: 'Şantiyeler', icon: HardHat },
  { route: 'attendance', label: 'Yoklama', icon: ClipboardCheck },
  { route: 'myPuantaj', label: 'Puantajım', icon: CalendarCheck },
  { route: 'materials', label: 'Malzemeler', icon: Boxes },
  { route: 'company', label: 'Firma', icon: Building2, only: 'desktop' },
  { route: 'profile', label: 'Ben', icon: UserRound, only: 'mobile' },
]

export function mainNavItems(user: WorkspaceViewer, platform: 'mobile' | 'desktop'): NavItem[] {
  return WORKSPACE_ITEMS.filter((item) => !item.only || item.only === platform).filter((item) =>
    routeAllows(ROUTES[item.route].meta, user),
  )
}

/** Platform yönetiminin menüsü (yalnızca süper yönetici). */
export const PLATFORM_ITEMS: readonly NavItem[] = [
  { route: 'platformDashboard', label: 'Özet', icon: LayoutDashboard },
  { route: 'platformTenants', label: 'Firmalar', icon: Building2 },
  { route: 'platformLeads', label: 'Başvurular', icon: Inbox },
  { route: 'platformPlans', label: 'Paketler', icon: Package, only: 'desktop' },
  { route: 'platformAudit', label: 'İşlem geçmişi', icon: FileClock, only: 'desktop' },
]

export function platformNavItems(platform: 'mobile' | 'desktop'): NavItem[] {
  return PLATFORM_ITEMS.filter((item) => !item.only || item.only === platform)
}

/** Alt sayfalar kendi sekmesini yakar: şantiye sayfasındayken "Şantiyeler" seçili görünür. */
const PARENT_ROUTE: Partial<Record<RouteName, RouteName>> = {
  siteFeed: 'sites',
  siteField: 'sites',
  siteProduction: 'sites',
  siteTasks: 'sites',
  memberAttendance: 'attendance',
  platformTenant: 'platformTenants',
}

export function navRouteOf(route: RouteName): RouteName {
  return PARENT_ROUTE[route] ?? route
}
