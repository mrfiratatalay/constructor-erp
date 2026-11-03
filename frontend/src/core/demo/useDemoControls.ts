import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { http } from '@/core/api/http'
import { detectPlatform, switchPlatform } from '@/core/platform'
import { SOURCE_URL } from './demoMode'

/** Telefon ve bilgisayar arayüzü ayrı kabuklardır; inceleyen kişi ikisini de görebilsin. */
function viewSwitch() {
  const otherView = detectPlatform() === 'mobile' ? 'desktop' : 'mobile'
  return {
    otherViewLabel: otherView === 'mobile' ? 'Telefon görünümü' : 'Bilgisayar görünümü',
    switchView: () => switchPlatform(otherView),
  }
}

/**
 * Demo menüsünün işleri: rol değiştirmek, sıfırlamak, görünüm değiştirmek. Rol değiştirmek de sıfırlamak da rol
 * kartlarına döner; önbellekte önceki kişinin verisi kalmaz.
 */
export function useDemoControls() {
  const queryClient = useQueryClient()
  const router = useRouter()

  async function chooseRole() {
    await http.post('/api/auth/logout')
    queryClient.clear()
    await router.push({ name: 'demo' })
  }

  async function reset() {
    await http.post('/api/demo/reset')
    queryClient.clear()
    await router.replace({ name: 'demo' })
  }

  return { chooseRole, reset, ...viewSwitch(), sourceUrl: SOURCE_URL }
}
