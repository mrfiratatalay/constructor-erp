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
  return page.locator(mobile ? '.van-tabbar' : '.el-menu')
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

/** Giriş linki, WhatsApp butonunun hazır mesajının içinden okunur: paylaşılan mesaj da doğrulanmış olur. */
export async function readLoginLinkFromWhatsappButton(page: Page): Promise<string> {
  const href = await page.getByRole('link', { name: "WhatsApp'ta gönder" }).getAttribute('href')
  const message = new URL(href ?? 'https://wa.me/').searchParams.get('text') ?? ''
  const link = message.match(/https?:\/\/\S+\/davet\/\S+/)?.[0]
  expect(link, `WhatsApp mesajında giriş linki yok: ${message}`).toBeTruthy()
  return link as string
}

/** Ekip listesinde tek bir kişinin satırı: mobilde hücre, masaüstünde liste satırı. */
export function memberRow(page: Page, fullName: string): Locator {
  return page.locator('.van-cell, .list-row').filter({ hasText: fullName })
}

export async function createSite(page: Page, name: string) {
  await page.goto('/santiyeler')
  await page.getByRole('button', { name: 'Şantiye ekle' }).click()
  await page.getByPlaceholder('Çamlıca Konutları').fill(name)
  await page.getByRole('button', { name: 'Kaydet' }).click()
  await expect(page.getByText(name).first()).toBeVisible()
}

/** Patron ekibe kişi ekler (ad + telefon; şantiyeye ekleme şantiyenin içindedir) ve giriş linkini döner. */
export async function addMember(page: Page, fullName: string) {
  await page.goto('/ekip')
  await page.getByRole('button', { name: 'Kişi ekle' }).click()
  await page.getByPlaceholder('Ahmet Yılmaz').fill(fullName)
  await page.getByPlaceholder('0532 123 45 67').fill(`05${String(Date.now()).slice(-9)}`)
  await page.getByRole('button', { name: 'Ekle', exact: true }).click()
  return readLoginLinkFromWhatsappButton(page)
}
