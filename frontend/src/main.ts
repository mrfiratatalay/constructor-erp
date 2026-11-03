import '@fontsource-variable/plus-jakarta-sans'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { installAuthGuard, installSessionExpiry } from './app/authGuard'
import { loadPlatform } from './app/loadPlatform'
import { createAppQueryClient } from './app/queryClient'
import { createAppRouter } from './app/router'
import { installServiceWorker } from './app/serviceWorker'
import { installUploadQueue } from './app/uploadQueue'
import { isDemo } from './core/demo/demoMode'
import './shared/styles/tokens.css'
import './shared/styles/base.css'
import './shared/styles/blueprint.css'

async function bootstrap() {
  // Demo derlemesinde istekler tarayıcıdaki sahte backend'e gider; gerçek derlemede bu dal pakete hiç girmez
  // (koşul burada yazılır, bkz. core/demo/demoMode.ts).
  if (import.meta.env.MODE === 'demo') await (await import('./core/demo/installDemo')).installDemo()
  const platform = await loadPlatform()
  const app = createApp(platform.shell)
  const queryClient = createAppQueryClient()
  const router = createAppRouter(platform.routes)

  const pinia = createPinia()

  installAuthGuard(router, queryClient)
  installSessionExpiry(router, queryClient)
  app.use(pinia)
  app.use(VueQueryPlugin, { queryClient })
  app.use(router)
  platform.install?.(app)
  installUploadQueue(pinia, queryClient)

  app.mount('#app')
  // Demoda service worker yok: bildirim gönderilmiyor, önbellek de yeni sürümü bir ziyaret geciktirirdi.
  if (!isDemo) installServiceWorker()
}

void bootstrap()
