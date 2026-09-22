import { defineConfig, devices } from '@playwright/test'

// Aynı testler dört cihazda koşar: Android ve iPhone (Safari motoru) telefonlar, iPad ve bilgisayar.
export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
    { name: 'ipad', use: { ...devices['iPad (gen 7)'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  // Testler geliştirme sunucularına değil, kendi ayrı ortamlarına bağlanır: frontend 5174,
  // backend 8081 ve her açılışta sıfırlanan santiye_e2e veritabanı. Senin verin hiç kirlenmez.
  webServer: [
    {
      command: 'npx vite --port 5174 --strictPort',
      url: 'http://localhost:5174',
      env: { VITE_API_TARGET: 'http://localhost:8081' },
      reuseExistingServer: true,
    },
    {
      command: 'cd ../backend && ./mvnw -q spring-boot:run -Dspring-boot.run.profiles=local,e2e',
      url: 'http://localhost:8081/actuator/health',
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
})
