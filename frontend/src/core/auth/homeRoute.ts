import type { CurrentUserResponseRole } from '@/core/api/generated/model'
import type { RouteName } from '@/core/navigation/routeTable'

/** Kullanıcının uygulamayı açınca ilk gördüğü sayfa. Modüller eklendikçe bu tablo güncellenir. */
const HOME_BY_ROLE: Record<CurrentUserResponseRole, RouteName> = {
  OWNER: 'today',
  SITE_LEAD: 'feed',
}

export function homeRouteFor(role: CurrentUserResponseRole): RouteName {
  return HOME_BY_ROLE[role]
}
