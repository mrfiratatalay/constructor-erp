import { Locale } from 'vant'
import trTR from 'vant/es/locale/lang/tr-TR'
import type { PlatformModule } from '@/core/platform'
import MobileShell from './templates/MobileShell.vue'
import { routes } from './routes'
import './styles/theme.css'
// Fonksiyonla çağrılan bileşenlerin (showToast vb.) stilleri otomatik gelmez; burada bir kez yüklenir.
import 'vant/es/toast/style'
import 'vant/es/image-preview/style'

const mobile: PlatformModule = {
  shell: MobileShell,
  routes,
  install: () => Locale.use('tr-TR', trTR),
}

export default mobile
