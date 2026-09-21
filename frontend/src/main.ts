import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loadPlatform } from './app/loadPlatform'
import { createAppRouter } from './app/router'
import './shared/styles/tokens.css'
import './shared/styles/base.css'

async function bootstrap() {
  const platform = await loadPlatform()
  const app = createApp(platform.shell)

  app.use(createPinia())
  app.use(createAppRouter(platform.routes))
  platform.install?.(app)

  app.mount('#app')
}

void bootstrap()
