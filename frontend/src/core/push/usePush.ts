import { onMounted, ref } from 'vue'
import { getPushKey, subscribePush, unsubscribePush } from '@/core/api/generated/notifications/notifications'
import { isInstalled, isIos, keyToBytes, pushSupported } from '@/core/push/pushSupport'

/**
 * unsupported: tarayıcı desteklemiyor. installFirst: iPhone'da önce ana ekrana eklenmeli (Apple kuralı).
 * denied: izin reddedilmiş (ayarlardan açılır). off / on: kapalı / açık.
 */
export type PushState = 'unsupported' | 'installFirst' | 'denied' | 'off' | 'on'

async function currentSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

async function readState(): Promise<PushState> {
  if (isIos() && !isInstalled()) return 'installFirst'
  if (!pushSupported()) return 'unsupported'
  if (Notification.permission === 'denied') return 'denied'
  return (await currentSubscription()) ? 'on' : 'off'
}

/** Bu cihazda bildirimleri açar ya da kapatır; durum ekranda anında güncellenir. */
export function usePush() {
  const state = ref<PushState>('unsupported')
  const busy = ref(false)
  const refresh = async () => (state.value = await readState())

  async function enable() {
    busy.value = true
    try {
      if ((await Notification.requestPermission()) !== 'granted') return
      const registration = await navigator.serviceWorker.ready
      const { publicKey } = await getPushKey()
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) })
      await subscribePush({ endpoint: subscription.endpoint })
    } finally {
      busy.value = false
      await refresh()
    }
  }

  async function disable() {
    busy.value = true
    try {
      const subscription = await currentSubscription()
      if (subscription) await unsubscribePush({ endpoint: subscription.endpoint }).finally(() => subscription.unsubscribe())
    } finally {
      busy.value = false
      await refresh()
    }
  }

  onMounted(refresh)
  return { state, busy, enable, disable }
}
