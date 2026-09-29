import { DELAY_NOTE, PROGRESS_SITE, TODAY_ENTRY } from '../demo-data/progress.mjs'
import { runSql } from '../demo-data/sql.mjs'
import { ids, launch, openAs } from './browser.mjs'
import { Recorder } from './recorder.mjs'

/**
 * İlerleme çekimi. Akşam şef (Ahmet) telefonda Kartal'ın İlerleme sekmesini açar, Demir İşleri'ne bugünün girişini
 * yapar: 3,5 ton, 12 çalışan. Patron masaüstünde panoyu görür, Geciken'e süzer, Bodrum Tesisatı'nın detayında şefin
 * notunu okur. Her çekim bugünün girişini silerek başlar; tekrar tekrar çalıştırılabilir.
 */
const SITE = ids.sites[PROGRESS_SITE]
/** Şefin kaydettiği an: telefonun saati ve girişin saati bu olur (ilerleme-evening.sql). */
export const ENTRY_TIME = '17:38'
const here = (name) => new URL(name, import.meta.url)

runSql(here('ilerleme-reset.sql'))
const film = new Recorder('ilerleme')
film.setDay(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }))
const browser = await launch()
await filmChief((await openAs(browser, 'phone', 'ahmet')).page)
await filmDesk((await openAs(browser, 'desktop', 'owner')).page)
film.save()
await browser.close()
console.log(`İlerleme çekildi: ${Object.keys(film.screens).length} adım.`)

async function filmChief(page) {
  await page.goto(`/santiyeler/${SITE}`)
  await film.shot(page, 'phone-feed', 1500)
  await film.tap(page.locator('.van-tab', { hasText: 'İlerleme' }), 'phone-tap-tab')
  await film.shot(page, 'phone-board', 1500)
  const card = page.locator('[data-testid="production-item"]', { hasText: 'Demir İşleri' }).first()
  await film.mark(card, 'phone-demir-card')
  await film.tap(card.getByRole('button', { name: 'Güncelle' }), 'phone-tap-update')
  const sheet = page.locator('.van-action-sheet', { hasText: 'Günlük İlerleme' })
  await film.layer(page, sheet, 'phone-sheet-layer')
  await film.shot(page, 'phone-sheet', 0)
  await film.mark(sheet.locator('.van-action-sheet__content'), 'phone-sheet-content')
  await typeInto(page, sheet.getByPlaceholder('3,5'), TODAY_ENTRY.quantity, 'quantity')
  await typeInto(page, sheet.getByPlaceholder('12'), TODAY_ENTRY.workers, 'workers')
  await saveEntry(page, sheet)
}

async function typeInto(page, field, text, name) {
  await film.tap(field, `phone-tap-${name}`)
  for (const [index, key] of [...text].entries()) {
    await field.pressSequentially(key)
    await film.shot(page, `phone-${name}-${index + 1}`, 200)
  }
}

/**
 * Kaydet pencerenin dibindedir: önce pencerenin içi kayar. Kaydedince üstte "İlerleme kaydedildi" bildirimi çıkar;
 * o ayrı katman olarak alınır, sonra girişin saati akşama taşınıp ekran yenilenir: kartta "Bugün 17:38" yazsın.
 */
async function saveEntry(page, sheet) {
  const save = sheet.getByRole('button', { name: 'Güncellemeyi kaydet' })
  await save.scrollIntoViewIfNeeded()
  await film.shot(page, 'phone-sheet-bottom', 500, '.van-action-sheet__content')
  await film.layer(page, sheet, 'phone-sheet-bottom-layer', 0)
  await film.tap(save, 'phone-tap-save')
  await film.layer(page, page.locator('.van-notify'), 'phone-notify-layer', 600)
  runSql(here('ilerleme-evening.sql'), { time: ENTRY_TIME })
  await page.reload()
  await film.shot(page, 'phone-saved', 1800)
  const card = page.locator('[data-testid="production-item"]', { hasText: 'Demir İşleri' }).first()
  await film.mark(card, 'phone-saved-card')
}

async function filmDesk(page) {
  await page.goto(`/santiyeler/${SITE}/ilerleme`)
  await page.getByText('İlerleme Takibi').waitFor()
  await film.shot(page, 'desk-board', 1500)
  await film.mark(rowOf(page, 'Demir İşleri'), 'desk-demir-row')
  await film.tap(page.locator('.el-segmented__item', { hasText: 'Geciken' }), 'desk-tap-delayed')
  await film.shot(page, 'desk-delayed', 900)
  await film.mark(rowOf(page, 'Bodrum Tesisatı'), 'desk-bodrum-row')
  await film.tap(rowOf(page, 'Bodrum Tesisatı').getByRole('button', { name: 'Detay' }), 'desk-tap-detail')
  const drawer = page.locator('.el-drawer:visible')
  await film.layer(page, drawer, 'desk-detail-layer', 1200)
  await film.shot(page, 'desk-detail', 0)
  await film.mark(drawer.getByText(DELAY_NOTE), 'desk-delay-note')
}

function rowOf(page, name) {
  return page.locator('[data-testid="production-item"]:visible', { hasText: name }).first()
}
