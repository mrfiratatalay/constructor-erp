import { resetDb } from '@/core/demo/server/demoDb'
import { DemoError } from '@/core/demo/server/demoError'
import { del, get, post } from '@/core/demo/server/demoRouter'

const NO_PUSH = () => {
  throw new DemoError(404, 'Demoda bildirim gönderilmiyor.')
}

/**
 * Demoya özel uç: "Demoyu sıfırla". Bildirim uçları bilerek kapalı: tarayıcının bildirim servisine kayıt açmak
 * demoda bir işe yaramaz, karşılığında kişiden boş yere izin istenirdi.
 */
export const demoRoutes = [
  post('/api/demo/reset', () => resetDb()),
  get('/api/notifications/push-key', NO_PUSH),
  get('/api/notifications/latest', NO_PUSH),
  post('/api/notifications/subscriptions', () => undefined),
  del('/api/notifications/subscriptions', () => undefined),
]
