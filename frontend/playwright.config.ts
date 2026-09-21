import { defineConfig, devices } from '@playwright/test'

// Aynı testler iki ekranda koşar: telefonda mobil kabuk, bilgisayarda masaüstü kabuk beklenir.
export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
})
