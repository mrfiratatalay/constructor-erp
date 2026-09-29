/**
 * Ekip videosunun çekimi. Patron telefonda ＋ → Kişi ekle → firmanın tek bağlantısını kopyalar. Yeni usta Ali
 * bağlantıyı ilk kez açar (hiç girmemiş bir telefon), adını ve numarasını yazıp katılır, bütün şantiyeleri görür.
 * Ofiste patron şantiyenin akışında "katıldı" satırını, yoklamada Ali'nin kendiliğinden eklendiğini görür.
 * Her çekimden önce Ali ve bıraktığı izler silinir: çekim hep aynı sabahtan başlar.
 */
import { APP, ids, launch, openAs } from './browser.mjs'
import { Recorder } from './recorder.mjs'
import { signIn } from '../demo-data/session.mjs'
import { runSql } from '../demo-data/sql.mjs'
import { NEW_WORKER, OWNER, SITES } from '../demo-data/world.mjs'

const SITE = SITES.find((site) => site.key === 'kartal')
/** Numara parça parça yazılır: her parça bir ekran (harf harf çekmek gereksiz yere çok resim olurdu). */
const PHONE_PARTS = NEW_WORKER.phone.split(/(?= )/)

runSql(new URL('ekip-reset.sql', import.meta.url), { phone: NEW_WORKER.phone })
const owner = await signIn(`${APP}/api`, { email: OWNER.email, password: OWNER.password })
const link = (await owner.get('/company/join-link')).url
const film = new Recorder('ekip')
film.setDay(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }))
film.setLink(link)
const browser = await launch()
await filmBoss((await openAs(browser, 'phone', 'owner')).page)
await filmWorker((await openAs(browser, 'phone', null)).page, link.slice(link.lastIndexOf('/') + 1))
await filmDesk((await openAs(browser, 'desktop', 'owner')).page)
film.save()
await browser.close()
console.log(`Ekip çekildi: ${Object.keys(film.screens).length} adım (bağlantı ${link}).`)

async function filmBoss(page) {
  await page.goto('/santiyeler')
  await film.shot(page, 'boss-start', 1500)
  await film.tap(page.getByRole('button', { name: 'Ekle' }), 'boss-tap-add')
  const menu = page.locator('.van-action-sheet:visible')
  await film.layer(page, menu, 'boss-menu-layer')
  await film.tap(menu.getByText('Kişi ekle', { exact: true }), 'boss-tap-people')
  const sheet = page.locator('.van-popup:visible').filter({ hasText: 'Bu bağlantıyı' })
  await film.layer(page, sheet, 'boss-link-layer', 900)
  await film.mark(sheet.locator('.join-link__url'), 'boss-link-url')
  // Kopyalayınca çıkan "Bağlantı kopyalandı" bildirimi dar kutuda kelimeyi bölüyor: çekilmez, videoda bağlantının
  // ustanın telefonuna uçuşu kopyalamanın sonucunu anlatır.
  await film.tap(sheet.getByRole('button', { name: 'Kopyala' }), 'boss-tap-copy')
}

/** Yeni usta: bağlantı açılır, ad harf harf, numara parça parça, Katıl; sonra şantiyeler ve Kartal'ın akışı. */
async function filmWorker(page, token) {
  await page.goto(`/katil/${token}`)
  await film.shot(page, 'worker-join', 1500)
  const name = page.getByPlaceholder('Ahmet Yılmaz')
  await film.tap(name, 'worker-tap-name')
  for (const [index, char] of [...NEW_WORKER.name].entries()) {
    await name.pressSequentially(char)
    await film.shot(page, `worker-name-${index + 1}`, 120)
  }
  const phone = page.getByPlaceholder('0532 123 45 67')
  await film.tap(phone, 'worker-tap-phone')
  for (const [index, part] of PHONE_PARTS.entries()) {
    await phone.pressSequentially(part)
    await film.shot(page, `worker-phone-${index + 1}`, 150)
  }
  await film.tap(page.getByRole('button', { name: 'Katıl' }), 'worker-tap-join')
  await page.waitForURL(/\/santiyeler$/)
  await film.shot(page, 'worker-sites', 1500)
  await film.tap(page.locator('.van-cell', { hasText: SITE.name }).first(), 'worker-tap-site')
  await film.shot(page, 'worker-feed', 1500)
}

async function filmDesk(page) {
  await page.goto(`/santiyeler/${ids.sites.kartal}`)
  const joined = page.getByText(`${NEW_WORKER.name} davet bağlantısıyla katıldı`).last()
  // Akış açılışta yalnızca mesajlara göre dibe iner; sonradan gelen sistem satırları altta kalır (PLAN.md,
  // bulgular). Patronun yapacağı gibi en alta kaydırılır.
  await joined.evaluate((line) => (line.closest('.el-scrollbar__wrap').scrollTop = 1e6))
  await film.shot(page, 'desk-feed', 1800)
  await film.mark(joined, 'desk-joined-line')
  await film.tap(page.locator('.side-nav').getByText('Yoklama', { exact: true }), 'desk-tap-roll')
  await film.shot(page, 'desk-roll', 1800)
  await film.mark(page.locator('.el-table__row:visible', { hasText: NEW_WORKER.name }).first(), 'desk-new-row')
}
