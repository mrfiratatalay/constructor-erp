import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

/**
 * Kullanıcının uygulamayı açınca ilk gördüğü sayfa. Her rolde şantiye listesi (WhatsApp'ın sohbet listesi
 * gibi); şef yoklamaya menüden geçer.
 */
const HOME_BY_ROLE: Record<CurrentUserResponseRole, RouteName> = {
  OWNER: 'sites',
  SITE_LEAD: 'sites',
  WORKER: 'sites',
}

export function homeRouteFor(role: CurrentUserResponseRole): RouteName {
  return HOME_BY_ROLE[role]
}
