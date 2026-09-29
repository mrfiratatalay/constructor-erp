/**
 * Malzeme videosunun çekimi. Depo: depocu Mehmet telefonda Kartal'a 50 torba çimento ve 2 ton demir çıkarır,
 * irsaliyeyi çeker, gönderir. Ofis: patron yeni sevkiyatı defterin başında görür, "kalıp" arar, 40 gündür dönmeyen
 * çelik kalıpların satırını açar, iade gelince "İade geldi" der, Excel'i indirir. Her çekimden önce bugün girilen
 * sevkiyatlar geri alınır: çekim hep aynı sabahtan başlar.
 */
import { APP, launch, openAs } from './browser.mjs'
import { Recorder } from './recorder.mjs'
import { TODAY_SHIPMENT } from '../demo-data/depot.mjs'
import { TODAY_IRSALIYE } from '../demo-data/seedDepot.mjs'
import { runSql } from '../demo-data/sql.mjs'
import { SITES } from '../demo-data/world.mjs'

const SITE = SITES.find((site) => site.key === TODAY_SHIPMENT.to).name
const LINES = [
  { name: 'Çimento', quantity: '50' },
  { name: 'İnşaat demiri Ø12', quantity: '2' },
]
const SEARCH = 'kalıp'
const LENT_TO = 'Aydın İnşaat'

runSql(new URL('malzeme-reset.sql', import.meta.url))
const film = new Recorder('malzeme')
film.setDay(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }))
const browser = await launch()
await filmPhone((await openAs(browser, 'phone', 'mehmet')).page)
await filmDesktop((await openAs(browser, 'desktop', 'owner')).page)
film.save()
await browser.close()
console.log(`Malzeme çekildi: ${Object.keys(film.screens).length} adım (${APP}).`)

async function filmPhone(page) {
  await page.goto('/malzemeler')
  await film.shot(page, 'phone-start', 1500)
  await film.tap(page.getByRole('button', { name: 'Sevkiyat çıkar' }), 'phone-tap-new')
  const form = page.locator('.van-popup').filter({ hasText: 'Sevkiyat çıkar' })
  await film.layer(page, form, 'phone-form-layer')
  await film.mark(form.locator('.van-nav-bar'), 'phone-form-bar')
  await film.tap(form.getByText(SITE, { exact: true }), 'phone-tap-site')
  await film.shot(page, 'phone-target')
  for (const [index, line] of LINES.entries()) await fillLine(page, form, index, line)
  await filmPhoto(page, form)
  await film.tap(form.getByRole('button', { name: 'Gönder' }), 'phone-tap-send')
  // "Sevkiyat kaydedildi" bildirimi kaybolana kadar beklenir: dar kutuda kelimeyi ortadan bölüyor.
  await film.shot(page, 'phone-saved', 2600)
  const detail = page.locator('.van-popup:visible').filter({ hasText: 'Geçmiş' })
  await film.layer(page, detail, 'phone-detail-layer', 0)
  await film.mark(detail.locator('.van-nav-bar__title'), 'phone-detail-title')
}

/** Bir kalem: "Malzeme seç" → tam ekran seçici → malzeme → miktar rakam rakam. */
async function fillLine(page, form, index, line) {
  const prefix = `phone-line-${index + 1}`
  await film.tap(form.getByText('Malzeme seç').first(), `${prefix}-tap-pick`)
  const picker = page.locator('.van-popup').filter({ has: page.getByPlaceholder('Malzeme adı yaz ya da ara') })
  if (index === 0) await film.layer(page, picker, 'phone-picker-layer')
  await film.tap(picker.locator('.van-cell', { hasText: line.name }).first(), `${prefix}-tap-material`)
  await film.shot(page, `${prefix}-picked`, 900, '.van-popup .form')
  const quantity = form.locator('.van-field', { hasText: 'Miktar' }).nth(index).locator('input')
  await film.tap(quantity, `${prefix}-tap-quantity`)
  for (const [digit, char] of [...line.quantity].entries()) {
    await quantity.pressSequentially(char)
    await film.shot(page, `${prefix}-typed-${digit + 1}`, 250, '.van-popup .form')
  }
  if (index === 0) {
    await film.tap(form.getByRole('button', { name: 'Bir şey daha ekle' }), 'phone-tap-add')
    await film.shot(page, 'phone-added', 600, '.van-popup .form')
  }
}

/** İrsaliye: form aşağı kayar, fotoğraf kutusuna dokunulur, kamera yerine hazır irsaliye fotoğrafı yüklenir. */
async function filmPhoto(page, form) {
  await page.locator('.van-popup .form').evaluate((element) => element.scrollTo({ top: element.scrollHeight }))
  await film.shot(page, 'phone-form-bottom', 500, '.van-popup .form')
  const uploader = form.locator('.van-uploader__upload')
  await film.mark(uploader, 'phone-tap-photo')
  await form.locator('input[type="file"]').setInputFiles(TODAY_IRSALIYE)
  await film.shot(page, 'phone-photo', 1000, '.van-popup .form')
}

async function filmDesktop(page) {
  await page.goto('/malzemeler')
  await film.shot(page, 'desk-start', 1500)
  await film.mark(page.locator('.el-table__row').first(), 'desk-new-row')
  await film.mark(page.locator('.el-alert'), 'desk-alert')
  const search = page.getByPlaceholder('Malzeme, firma ya da açıklama ara')
  await film.tap(search, 'desk-tap-search')
  for (const [index, char] of [...SEARCH].entries()) {
    await search.pressSequentially(char)
    await film.shot(page, `desk-search-${index + 1}`, index === SEARCH.length - 1 ? 1200 : 300)
  }
  await film.tap(page.locator('.el-table__row', { hasText: LENT_TO }).first(), 'desk-tap-row')
  const drawer = page.locator('.el-drawer:visible')
  await film.shot(page, 'desk-drawer', 1200)
  await film.layer(page, drawer, 'desk-drawer-layer', 0)
  await film.tap(drawer.getByRole('button', { name: 'İade geldi' }), 'desk-tap-return')
  await film.shot(page, 'desk-returned', 1200)
  await film.layer(page, drawer, 'desk-drawer-after-layer', 0)
  await page.keyboard.press('Escape')
  await film.shot(page, 'desk-after', 900)
  await film.tap(page.getByRole('link', { name: 'Excel' }), 'desk-tap-excel')
}
