import type { CurrentUserResponseRole, SessionContextView } from '@/core/api/generated/model'
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

/**
 * Oturumun ana sayfası: firmanın çalışma alanı açıksa rolün ana sayfası, kapalıysa kilit ekranı; firması olmayan
 * platform yöneticisi için platform özeti. Depo sorumlusunun paketinde malzeme yoksa şantiyeler açılır.
 */
export function homeOf(context: SessionContextView): RouteName {
  const workspace = context.workspace
  if (!workspace) return context.user.platformAdmin ? 'platformDashboard' : 'login'
  if (!workspace.access.open) return 'workspaceLocked'
  const home = homeRouteFor(workspace.role)
  return home === 'materials' && !workspace.features.includes('materials') ? 'sites' : home
}
