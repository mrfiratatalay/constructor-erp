import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

/**
 * Kullanıcının uygulamayı açınca ilk gördüğü sayfa. İki rolde de şantiye listesi (WhatsApp'ın sohbet
 * listesi gibi); tek şantiyesi olan şef de önce listeyi görür.
 */
const HOME_BY_ROLE: Record<CurrentUserResponseRole, RouteName> = {
  OWNER: 'sites',
  SITE_LEAD: 'sites',
}

export function homeRouteFor(role: CurrentUserResponseRole): RouteName {
  return HOME_BY_ROLE[role]
}
