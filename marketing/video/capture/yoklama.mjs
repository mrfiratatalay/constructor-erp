/**
 * Yoklama videosunun çekimi. Sabah: şef Ahmet telefonda Cemal'i "Gelmedi" yapar, sonra Seç ile kalan herkesi
 * işaretleyip tek dokunuşla "Geldi" der. Ofis: patron bugünün sonucunu, ayın puantaj cetvelini ve Hüseyin'in beton
 * dökümü gününü açar, Excel'i indirir. Her çalıştırmada önce bugünün işaretleri silinir: çekim hep aynı sabahtan başlar.
 */
import { APP, launch, openAs } from './browser.mjs'
import { Recorder } from './recorder.mjs'
import { signIn } from '../demo-data/session.mjs'
import { OWNER } from '../demo-data/world.mjs'

const ABSENT_TODAY = 'Cemal Aksoy'
const POUR_WORKER = 'Hüseyin Çelik'
/** Telefonda kaydırırken yerinde duranlar: başlık, sekmeler, alt menü, toplu işaretleme çubuğu, bildirim. */
const PHONE_CHROME = [
  '.van-nav-bar', '.mobile-page__subbar', '.mobile-page__footer', '.van-tabbar', '.van-popup', '.van-toast', '.van-overlay',
]

const owner = await signIn(`${APP}/api`, { email: OWNER.email, password: OWNER.password })
const today = await clearToday(owner)
const pourDay = await lastPourDay(owner, today)
const recorder = new Recorder('yoklama')
recorder.setDay(today)
const browser = await launch()
await filmPhone(recorder, (await openAs(browser, 'phone', 'ahmet')).page)
await filmDesktop(recorder, (await openAs(browser, 'desktop', 'owner')).page)
recorder.save()
await browser.close()
console.log(`Yoklama çekildi: ${Object.keys(recorder.screens).length} adım (bugün ${today}, beton günü ${pourDay}).`)

/** Bugünün işaretlerini siler; "bugün"ü sunucu söyler (demo verisi başka bir gün kurulmuş olabilir). */
async function clearToday(session) {
  const local = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' })
  const { today, marks } = await session.get(`/puantaj?from=${local}&to=${local}`)
  for (const mark of marks) await session.delete(`/puantaj/days/${today}/entries/${mark.entryId}`)
  return today
}

/** Ayın son beton dökümü günü: demo verisi onu dünden geriye sayarak yerleştirir, gün her ay değişir. */
async function lastPourDay(session, day) {
  const { marks } = await session.get(`/puantaj?from=${day.slice(0, 8)}01&to=${day}`)
  const pours = marks.filter((mark) => mark.note?.startsWith('Beton dökümü')).map((mark) => mark.day)
  if (pours.length === 0) throw new Error('Bu ayda beton dökümü günü yok: npm run seed ile demo verisini kur.')
  return pours.sort().at(-1)
}

async function filmPhone(film, page) {
  const row = (name) => page.locator('.van-cell', { hasText: name })
  await page.goto('/yoklama')
  await film.shot(page, 'phone-start', 1500)
  await film.mark(page.locator('.van-tabs__wrap').first(), 'phone-header')
  await film.mark(page.locator('.van-tabbar'), 'phone-tabbar')
  await film.tap(row(ABSENT_TODAY), 'phone-tap-row')
  const sheet = page.locator('.van-action-sheet')
  await film.shot(page, 'phone-sheet')
  await film.layer(page, sheet, 'phone-sheet-layer', 0)
  await film.tap(sheet.getByRole('button', { name: 'Gelmedi' }), 'phone-tap-absent')
  await film.shot(page, 'phone-one-marked', 1200)
  await filmSelection(film, page, row)
}

/** Seç kipi: önce görünen satırlar tek tek (videoda "tık tık tık"), kalanlar kaydırarak, sonra tek dokunuşla Geldi. */
async function filmSelection(film, page, row) {
  await film.tap(page.getByRole('button', { name: 'Seç' }), 'phone-tap-select')
  await film.shot(page, 'phone-select-mode')
  // Satırın alttan açılan penceresi de bir popup'tır; toplu işaretleme çubuğu ötekidir.
  const bulkBar = page.locator('.van-popup--bottom:not(.van-action-sheet)')
  await film.mark(bulkBar, 'phone-bulkbar')
  await page.locator('.van-cell-group__title', { hasText: 'Personel' }).evaluate((title) => {
    window.scrollTo({ top: title.getBoundingClientRect().top + window.scrollY - 64, behavior: 'instant' })
  })
  await film.shot(page, 'phone-select-list', 400)
  await film.strip(page, 'phone-strip-select', PHONE_CHROME)
  const names = await pendingNames(page)
  for (const [index, name] of names.slice(0, 6).entries()) {
    await film.tap(row(name), `phone-tap-pick-${index + 1}`)
    await film.shot(page, `phone-picked-${index + 1}`, 250)
  }
  for (const name of names.slice(6)) await row(name).click()
  await film.shot(page, 'phone-picked-all', 400)
  await film.strip(page, 'phone-strip-picked', PHONE_CHROME)
  await film.tap(bulkBar.getByRole('button', { name: 'Geldi' }), 'phone-tap-present')
  // "17 satır işaretlendi" bildirimi kaybolana kadar beklenir: dar kutuda kelimeyi ortadan bölüyor.
  await film.shot(page, 'phone-marked-bottom', 2600)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await film.shot(page, 'phone-done', 1500)
  await film.mark(page.locator('.van-circle').first(), 'phone-ring')
  await film.strip(page, 'phone-strip-done', PHONE_CHROME)
}

async function pendingNames(page) {
  const cells = page.locator('.van-cell', { hasText: 'İşaretlenmedi' })
  return (await cells.locator('.van-cell__title > span').allTextContents()).map((name) => name.trim())
}

async function filmDesktop(film, page) {
  await page.goto('/yoklama')
  await film.shot(page, 'desk-today', 1500)
  await film.mark(page.locator('.el-card:visible', { hasText: 'Yoklama tamam' }).first(), 'desk-summary')
  await film.tap(page.getByRole('tab', { name: 'Puantaj' }), 'desk-tap-puantaj')
  await film.shot(page, 'desk-month', 1500)
  film.region('desk-days', await daysRegion(page))
  const pourCell = await dayCell(page, POUR_WORKER, pourDay)
  await film.tap(pourCell, 'desk-tap-cell')
  // Toplu işaretleme şeridi de bir çekmecedir ve sayfada gizli durur: açılan panel görünen tek çekmecedir.
  const drawer = page.locator('.el-drawer:visible')
  await film.shot(page, 'desk-drawer', 1200)
  await film.layer(page, drawer, 'desk-drawer-layer', 0)
  // Gün ayrıntısının başlık satırı ("24 Eylül Perşembe · Kaydedildi · 08:16 · Serkan Demir"): kamera buraya iner.
  await film.mark(drawer.getByText(/^Kaydedildi/), 'desk-day-header')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
  const excel = page.getByRole('link', { name: 'Excel indir' })
  await film.tap(excel, 'desk-tap-excel')
  await film.shot(page, 'desk-excel', 600)
}

/**
 * Cetvelin dolacak alanı: ad sütununun sağından tablonun sonuna, gövde satırları. Video "cetvel dolar" anını
 * burada oynatır: önce günler, en son toplamlar belirir.
 */
async function daysRegion(page) {
  const table = page.locator('.el-table:visible').first()
  const name = await table.locator('thead th').first().boundingBox()
  const body = await table.locator('.el-table__body-wrapper').boundingBox()
  const left = name.x + name.width
  return { x: left, y: body.y, width: body.x + body.width - left, height: body.height }
}

/**
 * Cetvelde kişinin satırıyla günün sütununun kesiştiği hücre: başlık sırasından bulunur. Yalnızca görünen tabloya
 * bakılır: Bugün sekmesinin tablosu gizli de olsa sayfada durur.
 */
async function dayCell(page, name, day) {
  const table = page.locator('.el-table:visible').first()
  const headers = await table.locator('thead th').allTextContents()
  const column = headers.findIndex((text) => text.replace(/\D/g, '') === String(Number(day.slice(8))))
  return table.locator('.el-table__row', { hasText: name }).first().locator('td').nth(column)
}

