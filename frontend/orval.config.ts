import { defineConfig } from 'orval'

// API tipleri ve Vue Query fonksiyonları backend'in OpenAPI dokümanından üretilir: `npm run api`.
// Üretilen dosyalar elle düzenlenmez; backend değişince komut yeniden çalıştırılır.
export default defineConfig({
  santiye: {
    input: 'http://localhost:8080/v3/api-docs',
    output: {
      mode: 'tags-split',
      target: 'src/core/api/generated',
      schemas: 'src/core/api/generated/model',
      client: 'vue-query',
      httpClient: 'axios',
      clean: true,
      formatter: 'prettier',
      override: {
        mutator: { path: 'src/core/api/http.ts', name: 'apiRequest' },
      },
    },
  },
})
