import { ref } from 'vue'
import { usePasswordLogin } from '@/core/auth/usePasswordLogin'
import { DEMO_PASSWORD } from './demoMode'
import { DEMO_ROLES, DEMO_SETUP_PATH, type DemoRole } from './demoRoles'
import { useDemoControls } from './useDemoControls'

/**
 * Demo sayfası: rolle şifresiz giriş ve menünün işleri. Giriş, gerçek giriş ekranının kullandığı uçtan geçer; demo
 * için ayrı bir oturum yolu yoktur.
 */
export function useDemoEntry() {
  const { login, isPending, errorText } = usePasswordLogin()
  const entering = ref<DemoRole['key'] | null>(null)

  function enter(role: DemoRole) {
    entering.value = role.key
    login(role.email, DEMO_PASSWORD)
  }

  return {
    roles: DEMO_ROLES,
    enter,
    entering,
    isPending,
    errorText,
    ...useDemoControls(),
    setupPath: DEMO_SETUP_PATH,
  }
}
