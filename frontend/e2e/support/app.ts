import { expect, type Locator, type Page } from '@playwright/test'

// Local profilde backend'in kendiliğinden oluşturduğu ilk yönetici (application-local.yml).
export const OWNER = { email: 'patron@kizilkan.local', password: 'patron123' }

export async function loginAsOwner(page: Page) {
  await page.goto('/giris')
  await page.locator('input[type="email"]').fill(OWNER.email)
  await page.locator('input[type="password"]').fill(OWNER.password)
  await page.getByRole('button', { name: 'Giriş yap' }).click()
  await expect(page).toHaveURL(/\/santiyeler$/)
}

/** Mobil kabukta alt sekme çubuğu, masaüstü kabukta sol menü vardır. */
export function shellOf(page: Page, mobile: boolean): Locator {
  return page.locator(mobile ? '.van-tabbar' : '.side-nav')
}

export async function switchView(page: Page, fromMobile: boolean) {
  if (fromMobile) {
    await page.goto('/ben')
    await page.getByText('Masaüstü görünüme geç').click()
    return
  }
  await page.getByRole('button', { name: 'Patron' }).click()
  await page.getByRole('menuitem', { name: 'Mobil görünüme geç' }).click()
}
