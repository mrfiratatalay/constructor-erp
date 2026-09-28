import type { PlatformModule } from '@/core/platform'
import DesktopShell from './templates/DesktopShell.vue'
import { routes } from './routes'
import './styles/theme.css'
// Fonksiyonla çağrılan bileşenlerin (ElMessage) stilleri otomatik gelmez; burada bir kez yüklenir.
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'

const desktop: PlatformModule = {
  shell: DesktopShell,
  routes,
}

export default desktop
