// Part 6: şef Ayşe: İlerleme panosu → Alçı (3. kat iç cephe) günlük giriş → ilerleme güncellenir;
// Görevler → yeni görev (Musa, teslim tarihi) → listede → tamamlandı.
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open, siteIdOf } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const browser = await openBrowser()
const ayse = await asPerson(browser, 'ayse')
const yomra = await siteIdOf(ayse, 'Yomra Park Konutları')
const card = '.el-card:has-text("3. kat iç cephe"), .production-item:has-text("3. kat iç cephe")'

const board = await open(ayse, `/santiyeler/${yomra}/ilerleme`)
await settle(board, 1500)
// Kart sayfanın altında: önce ve sonra aynı konumda görünsün diye ekranın ortasına kaydırılır (çubuğun uzaması).
const centerCard = async () => {
  await board.locator(card).first().evaluate((element) => element.scrollIntoView({ block: 'center' }))
  await settle(board, 500)
}
await centerCard()
await shoot(board, 'production', 'board', { card, update: `:is(${card}) button:has-text("Güncelle")`, stats: 'text=Aktif' })
await board.locator(`:is(${card}) button:has-text("Güncelle")`).first().click()
await settle(board, 900)
await shoot(board, 'production', 'entry', { drawer: '.el-drawer:visible' })
const drawer = board.locator('.el-drawer:visible')
const field = (label) => drawer.locator('.el-form-item', { hasText: label }).locator('input').first()
await field('Bugün yapılan').fill('34')
await field('Çalışan sayısı').fill('4')
await drawer.locator('textarea').first().fill('3. kat koridor ve iki daire tamamlandı.')
await drawer.locator('.el-drawer__header, h2').first().click()
await settle(board, 400)
await shoot(board, 'production', 'entry-filled', { drawer: '.el-drawer:visible', save: '.el-drawer:visible .el-button--primary' })
await drawer.locator('.el-button--primary').last().click()
await settle(board, 1500)
await centerCard()
await shoot(board, 'production', 'board-after', { card, update: `:is(${card}) button:has-text("Güncelle")` })

const tasks = await open(ayse, `/santiyeler/${yomra}/gorevler`)
await settle(tasks, 1200)
await shoot(tasks, 'tasks', 'list', { add: 'button:has-text("Görev ekle")' })
await tasks.locator('button:has-text("Görev ekle")').click()
await settle(tasks, 800)
const form = tasks.locator('.el-dialog:visible')
await shoot(tasks, 'tasks', 'form', { dialog: '.el-dialog:visible' })
await form.getByPlaceholder('Kalıp sökümü').fill('3. kat elektrik tesisatı kontrolü')
await form.locator('.el-form-item', { hasText: 'Kim yapacak' }).locator('.el-select').click()
await tasks.locator('.el-select-dropdown__item:visible', { hasText: 'Musa Çetin' }).click()
const due = form.locator('.el-form-item', { hasText: 'Termin' }).locator('input')
await due.click()
await due.fill('6 Ekim 2026')
await due.press('Enter')
await form.getByText('Yüksek', { exact: true }).click()
await form.locator('.el-dialog__title, .el-dialog__header').first().click()
await settle(tasks, 400)
await shoot(tasks, 'tasks', 'form-filled', { dialog: '.el-dialog:visible', create: '.el-dialog:visible button:has-text("Oluştur")' })
await form.locator('button:has-text("Oluştur")').click()
await settle(tasks, 1200)
const row = 'text=3. kat elektrik tesisatı kontrolü'
await shoot(tasks, 'tasks', 'list-after', { row })
await tasks.locator(row).first().click()
await settle(tasks, 900)
await shoot(tasks, 'tasks', 'drawer', { drawer: '.el-drawer:visible', done: '.el-drawer:visible >> text=Tamamlandı' })
await tasks.locator('.el-drawer:visible >> text=Tamamlandı').first().click()
await settle(tasks, 1000)
await shoot(tasks, 'tasks', 'done', { drawer: '.el-drawer:visible', done: '.el-drawer:visible >> text=Tamamlandı' })
await browser.close()
console.log('Part 6 çekimleri tamam.')
