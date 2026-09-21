import { Locale } from 'vant'
import trTR from 'vant/es/locale/lang/tr-TR'
import type { PlatformModule } from '@/core/platform'
import MobileShell from './templates/MobileShell.vue'
import { routes } from './routes'
import './styles/theme.css'

const mobile: PlatformModule = {
  shell: MobileShell,
  routes,
  install: () => Locale.use('tr-TR', trTR),
}

export default mobile
