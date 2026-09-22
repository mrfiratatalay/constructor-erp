import { expect, test } from '@playwright/test'
import { loginAsOwner, shellOf, switchView } from './support/app'

test('cihaza uygun kabuk açılır', async ({ page, isMobile }) => {
  await loginAsOwner(page)
  await expect(shellOf(page, isMobile)).toBeVisible()
})

test('kullanıcı diğer görünüme geçebilir ve tercihi hatırlanır', async ({ page, isMobile }) => {
  await loginAsOwner(page)
  await switchView(page, isMobile)
  await expect(shellOf(page, !isMobile)).toBeVisible()

  await page.reload()
  await expect(shellOf(page, !isMobile)).toBeVisible()
})
