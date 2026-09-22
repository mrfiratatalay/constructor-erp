import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver'

/**
 * Bir kütüphanedeki bütün bileşen stil adresleri, otomatik import'un isteyeceği biçimde (uzantısız).
 * Glob kalıbı işe yaramaz: diskteki dosyayı uzantısıyla (index.mjs) bulur, Vite ikisini eşleştiremez.
 */
function styleEntries(componentsDir: string, stylePath: string): string[] {
  const root = fileURLToPath(new URL(`./node_modules/${componentsDir}`, import.meta.url))
  return readdirSync(root)
    .filter((name) => existsSync(`${root}/${name}/${stylePath}.mjs`))
    .map((name) => `${componentsDir}/${name}/${stylePath}`)
}

export default defineConfig({
  plugins: [
    vue(),
    Components({
      // Yalnızca kütüphane bileşenleri (van-*, el-*) otomatik gelir, stilleriyle birlikte.
      // Kendi bileşenlerimiz her zaman açıkça import edilir (Madde 4): `dirs` bu yüzden boş.
      dirs: [],
      resolvers: [VantResolver(), ElementPlusResolver()],
      dts: 'src/app/components.d.ts',
    }),
    // Telefona kurulabilir uygulama (PWA): ana ekran ikonu, tam ekran açılış, çevrimdışı açılış, bildirim.
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      manifest: {
        name: 'Kızılkan Şantiye',
        short_name: 'Kızılkan',
        description: 'Şantiyelerden fotoğraf, video, sesli not ve sorunlar tek yerde.',
        lang: 'tr',
        start_url: '/',
        display: 'standalone',
        background_color: '#f6f7f9',
        theme_color: '#172554',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      // Geliştirmede de bildirim denenebilsin diye service worker açık.
      devOptions: { enabled: true, type: 'module' },
    }),
  ],
  optimizeDeps: {
    // Otomatik import, kütüphane bileşenlerini ve stillerini sayfa açıldıkça ekler. Vite her yeni keşifte
    // bağımlılıkları yeniden paketleyip sayfayı yeniler; yoldaki import'lar kopar. Bu yüzden iki
    // kütüphanenin tamamı ve bütün bileşen stilleri sunucu açılırken bir kez paketlenir.
    include: [
      'vant/es',
      ...styleEntries('vant/es', 'style/index'),
      'element-plus/es',
      ...styleEntries('element-plus/es/components', 'style/css'),
    ],
  },
  // API aynı adresten (/api) çağrılır: oturum çerezi SameSite=Strict olduğu için frontend ile
  // backend aynı sitede görünmeli. Geliştirmede Vite, production'da ters vekil (reverse proxy) yapar.
  // Uçtan uca testler kendi backend'ine (8081) bağlanır; bkz. playwright.config.ts.
  server: {
    proxy: { '/api': process.env.VITE_API_TARGET ?? 'http://localhost:8080' },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
