import { expect, test } from '@playwright/test'
import { OWNER } from './support/app'

test('yanlış şifre anlaşılır bir mesajla reddedilir', async ({ page }) => {
  await page.goto('/giris')
  await page.locator('input[type="email"]').fill(OWNER.email)
  await page.locator('input[type="password"]').fill('yanlis-sifre')
  await page.getByRole('button', { name: 'Giriş yap' }).click()

  await expect(page.getByText('E-posta ya da şifre hatalı.')).toBeVisible()
})

test('oturum yokken korunan sayfa girişe, girişten sonra geri gönderir', async ({ page }) => {
  await page.goto('/ben')
  await expect(page).toHaveURL(/\/giris\?next=(%2F|\/)ben$/)
})

test('geçersiz davet linki ne yapılacağını söyler', async ({ page }) => {
  await page.goto('/davet/uydurma-link')
  await expect(page.getByText('Yöneticinden yeni bir link iste.')).toBeVisible()
})

test('geçersiz şantiye davet bağlantısı ne yapılacağını söyler', async ({ page }) => {
  await page.goto('/katil/uydurma-baglanti')
  await expect(page.getByText('Patronundan yeni bir bağlantı iste.')).toBeVisible()
})
