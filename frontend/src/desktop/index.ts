import type { PlatformModule } from '@/core/platform'
import DesktopShell from './templates/DesktopShell.vue'
import { routes } from './routes'
import './styles/theme.css'

const desktop: PlatformModule = {
  shell: DesktopShell,
  routes,
}

export default desktop
