import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      // Yalnızca kütüphane bileşenleri (van-*, el-*) otomatik gelir, stilleriyle birlikte.
      // Kendi bileşenlerimiz her zaman açıkça import edilir (Madde 4): `dirs` bu yüzden boş.
      dirs: [],
      resolvers: [VantResolver(), ElementPlusResolver()],
      dts: 'src/app/components.d.ts',
    }),
  ],
  optimizeDeps: {
    // Otomatik import kütüphaneleri sonradan ekler; Vite onları geç fark edince sayfayı yeniden
    // yükler ve yoldaki import'lar kopar. Ana paketleri baştan paketlemek yeter: sonradan
    // keşfedilen bileşen stilleri yalnızca CSS olduğu için yeniden yükleme tetiklemez.
    include: [
      'vant/es',
      'element-plus/es',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
