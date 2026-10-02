// Part 5: depo sorumlusu Mehmet: malzeme özeti → Yeni Hareket → Şantiyeye gönderim (Ana Depo → Yomra Park,
// 24 kalıp paneli) → kaydedilen sevkiyatın ayrıntısı → Geri Beklenenler (dışarı verilen, iadesi beklenen).
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const SCENE = 'materials'
const browser = await openBrowser()
const mehmet = await asPerson(browser, 'mehmet')
const page = await open(mehmet, '/malzemeler')
await settle(page, 1500)
await shoot(page, SCENE, 'overview', { create: 'button:has-text("Yeni Hareket")', waiting: 'text=Geri Beklenenler', table: '.el-table' })

await page.locator('button:has-text("Yeni Hareket")').click()
await settle(page, 600)
await shoot(page, SCENE, 'chooser', { site: '.chooser__menu >> text=Şantiyeye gönder' })
await page.locator('.chooser__menu >> text=Şantiyeye gönder').first().click()
// Form sağdan açılan bir çekmecedir ("Yeni Şantiye Sevkiyatı"): kaynak Ana Depo, hedef şantiye seçilir.
const dialog = page.locator('.movement-form')
await dialog.waitFor()
await settle(page, 600)
const FORM = { form: '.movement-form', site: '.movement-form .el-select', submit: '.movement-form button:has-text("Sevkiyatı oluştur")' }
await shoot(page, SCENE, 'dialog', FORM)

await dialog.locator('.el-select').first().click()
await page.locator('.el-select-dropdown__item:visible', { hasText: 'Yomra Park Konutları' }).click()
await settle(page, 300)
const material = dialog.locator('.el-select').nth(1)
await material.click()
await page.locator('.el-select-dropdown__item:visible', { hasText: 'Kalıp paneli' }).click()
await dialog.locator('.el-input-number input').first().fill('24')
await dialog.getByPlaceholder('Teslim alan kişi veya not…').fill('3. kat kolon kalıpları için')
await dialog.locator('h2').first().click()
await settle(page, 400)
await shoot(page, SCENE, 'dialog-filled', FORM)

await page.locator(FORM.submit).click()
await settle(page, 1500)
await shoot(page, SCENE, 'saved', { drawer: '.movement-detail', first: '.el-table__row' })
await page.keyboard.press('Escape')
await settle(page, 600)
await page.locator('text=Geri Beklenenler').first().click()
await settle(page, 1000)
await shoot(page, SCENE, 'waiting', { table: '.el-table', first: '.el-table__row' })
await browser.close()
console.log('Part 5 çekimleri tamam.')
