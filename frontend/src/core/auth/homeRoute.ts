import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

/**
 * Kullanıcının uygulamayı açınca ilk gördüğü sayfa. Her rolde şantiye listesi (WhatsApp'ın sohbet listesi
 * gibi); şef yoklamaya menüden geçer. Depo sorumlusunun günlük işi malzemedir: doğrudan Malzemeler açılır.
 */
const HOME_BY_ROLE: Record<CurrentUserResponseRole, RouteName> = {
  OWNER: 'sites',
  SITE_LEAD: 'sites',
  WAREHOUSE: 'materials',
  WORKER: 'sites',
}

export function homeRouteFor(role: CurrentUserResponseRole): RouteName {
  return HOME_BY_ROLE[role]
}
