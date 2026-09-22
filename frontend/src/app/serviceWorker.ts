import { registerSW } from 'virtual:pwa-register'

/** Service worker: uygulama dosyalarını önbelleğe alır ve bildirimleri gösterir. Yeni sürüm kendiliğinden gelir. */
export function installServiceWorker() {
  if ('serviceWorker' in navigator) registerSW({ immediate: true })
}
