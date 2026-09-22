/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute, type PrecacheEntry } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<string | PrecacheEntry> }

const ICON = '/icons/icon-192.png'
const BADGE = '/icons/badge-96.png'

// Yeni sürüm hemen devreye girer: sahadakiler eski ekranla kalmaz.
void self.skipWaiting()
clientsClaim()

// Uygulama dosyaları önbellekten: zayıf internette bile anında açılır. API ve medya asla önbellekten verilmez.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
if (import.meta.env.PROD) {
  registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { denylist: [/^\/api\//] }))
}

interface LatestNotification {
  id: string
  title: string
  body: string
  url: string
}

/** Sunucu içeriksiz "dürtme" gönderir; içerik buradan, oturum çereziyle okunur. */
async function showLatestNotification() {
  try {
    const response = await fetch('/api/notifications/latest', { credentials: 'include' })
    if (response.status === 200) {
      const latest = (await response.json()) as LatestNotification
      await self.registration.showNotification(latest.title, {
        body: latest.body,
        tag: latest.id,
        icon: ICON,
        badge: BADGE,
        data: { url: latest.url },
      })
      return
    }
  } catch {
    // Ağ yoksa bile bir bildirim gösterilmeli (iOS her dürtmede bildirim bekler).
  }
  await self.registration.showNotification('Kızılkan Şantiye', { body: 'Yeni bir bildirimin var.', icon: ICON, badge: BADGE, data: { url: '/' } })
}

/** Uygulama açıksa o pencere öne gelir ve ilgili sayfaya gider; kapalıysa açılır. */
async function openApp(url: string) {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const existing = windows[0]
  if (existing) {
    await existing.navigate(url)
    await existing.focus()
    return
  }
  await self.clients.openWindow(url)
}

self.addEventListener('push', (event) => event.waitUntil(showLatestNotification()))

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(openApp((event.notification.data as { url?: string } | undefined)?.url ?? '/'))
})
