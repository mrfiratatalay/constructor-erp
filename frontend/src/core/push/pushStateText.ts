import type { PushState } from '@/core/push/usePush'

/** Her durumda kullanıcı ne olduğunu ve ne yapacağını anlar. */
export const PUSH_STATE_TEXT: Record<PushState, string> = {
  unsupported: 'Bu tarayıcı bildirimleri desteklemiyor.',
  installFirst: "iPhone'da bildirim için önce uygulamayı ana ekrana ekle.",
  denied: 'Bildirim izni kapalı. Tarayıcının site ayarlarından izin ver.',
  off: 'Bildirimler bu cihaza gelmiyor.',
  on: 'Bildirimler bu cihaza geliyor.',
}
