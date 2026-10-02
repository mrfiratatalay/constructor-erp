// Patron: kurulum bağlantısı → Firma (logo dahil) → Hesabınız → İlk şantiye → Hazır → çalışma alanı.
import { settle, shoot } from '../lib/shoot.mjs'
import { secrets } from '../lib/stack.mjs'

const SCENE = 'onboarding'
const NEXT = '.setup-page__actions .el-button--primary'

const fill = async (page, label, value) => {
  await page.locator('.el-form-item', { hasText: label }).locator('input').first().fill(value)
}

const companyStep = async (page, logo) => {
  await shoot(page, SCENE, 'setup-company', { steps: '.setup-page__steps', next: NEXT })
  await page.locator('.el-upload input[type=file]').setInputFiles(logo)
  await page.locator('button', { hasText: 'Logoyu değiştir' }).waitFor({ timeout: 15_000 })
  await fill(page, 'Telefon', '0462 000 00 00')
  await fill(page, 'Şehir', 'Trabzon')
  await fill(page, 'Firma e-postası', 'iletisim@atalayyapi.local')
  await settle(page, 400)
  await shoot(page, SCENE, 'setup-company-filled', { steps: '.setup-page__steps', next: NEXT })
}

const ownerStep = async (page, patron) => {
  await fill(page, 'Adınız soyadınız', patron.name)
  await fill(page, 'Giriş e-postası', patron.email)
  const passwords = page.locator('input[type=password]')
  await passwords.nth(0).fill(patron.password)
  await passwords.nth(1).fill(patron.password)
  await page.locator('h1, h2').first().click()
  await settle(page, 300)
  await shoot(page, SCENE, 'setup-owner', { steps: '.setup-page__steps', next: NEXT })
}

const siteStep = async (page) => {
  await fill(page, 'Şantiye adı', 'Yomra Park Konutları')
  await page.locator('.el-form-item', { hasText: 'Adres' }).locator('input, textarea').first().fill('Kaşüstü Mah., Yomra / Trabzon')
  await settle(page, 300)
  await shoot(page, SCENE, 'setup-site', { steps: '.setup-page__steps', next: NEXT })
}

export const setupFlow = async (context, link, logo) => {
  const page = await context.newPage()
  await page.goto(link.replace('https://iskeleerp.vercel.app', secrets().web))
  await settle(page, 600)
  await companyStep(page, logo)
  await page.locator(NEXT).click()
  await settle(page, 400)
  await ownerStep(page, secrets().patron)
  await page.locator(NEXT).click()
  await settle(page, 400)
  await siteStep(page)
  await page.locator(NEXT).click()
  await settle(page, 400)
  await shoot(page, SCENE, 'setup-summary', { steps: '.setup-page__steps', finish: NEXT })
  await page.locator(NEXT).click()
  await page.waitForURL(/\/santiyeler/, { timeout: 20_000 })
  await settle(page, 1200)
  await shoot(page, SCENE, 'setup-done')
  await page.close()
}
