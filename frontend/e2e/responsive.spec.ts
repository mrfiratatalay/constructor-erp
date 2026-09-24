import { expect, test, type Page } from '@playwright/test'
import { loginAsOwner } from './support/app'

type Platform = 'mobile' | 'desktop'

/**
 * Kabuk ekrandan değil kayıtlı tercihten seçilir ("… görünüme geç" ile aynı anahtar): burada ölçülen şey
 * kabuğun seçimi değil, verilen genişlikteki yerleşimidir. Seçimin kendisi platformShell.spec.ts'de.
 */
async function openAs(page: Page, platform: Platform, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.addInitScript((chosen) => localStorage.setItem('santiye.platform', chosen), platform)
  await loginAsOwner(page)
}

test('hiçbir cihazda sayfa yana taşmaz', async ({ page }) => {
  await loginAsOwner(page)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('tablette mobil sayfa ekran boyu uzamaz, 640px sütunda ortalanır', async ({ page }) => {
  await openAs(page, 'mobile', 810, 1080)
  const column = await page.locator('.mobile-page').boundingBox()
  expect(column?.width).toBe(640)
  expect(column?.x).toBe((810 - 640) / 2)
})

test('dar masaüstü penceresinde sol menü ince başlar, ☰ üstüne kaydırır; geniş pencerede açıktır', async ({ page }) => {
  await openAs(page, 'desktop', 1024, 768)
  const nav = page.locator('.side-nav')
  await expect(nav).not.toHaveClass(/side-nav--open/)
  await page.getByRole('button', { name: 'Menüyü aç' }).click()
  await expect(nav).toHaveClass(/side-nav--floating/)

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(nav).toHaveClass(/side-nav--open/)
  await expect(nav).not.toHaveClass(/side-nav--floating/)
})
