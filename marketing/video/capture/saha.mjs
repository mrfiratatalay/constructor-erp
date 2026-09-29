import { runSql } from '../demo-data/sql.mjs'
import { ids, launch, openAs } from './browser.mjs'
import { Recorder } from './recorder.mjs'

/**
 * Saha ve sohbet çekimi. Öğleden sonra şef (Ahmet) Kartal'ın Saha sekmesinden sorun bildirir; patron masaüstünde
 * Saha'da sarı satırı görür, Sohbet'e geçip cevap yazar; şefin telefonunda cevap belirir. Her çekim o iki mesajı
 * silerek başlar; mesajların saati gönderilince öğleden sonraya taşınır (saha-time.sql).
 */
export const ISSUE = 'Beton pompası arızalandı, 4. kat döşeme dökümü yarına kaldı.'
export const REPLY = "Pompacıyla konuştum, yarın sabah 7'de sahada."
export const TIMES = { issue: '14:20', reply: '14:26' }
const SITE = `/santiyeler/${ids.sites.kartal}`
const here = (name) => new URL(name, import.meta.url)

runSql(here('saha-reset.sql'), { issue: ISSUE, reply: REPLY })
const film = new Recorder('saha')
film.setDay(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' }))
const browser = await launch()
const chief = (await openAs(browser, 'phone', 'ahmet')).page
await filmIssue(chief)
await filmDesk((await openAs(browser, 'desktop', 'owner')).page)
await filmReply(chief)
film.save()
await browser.close()
console.log(`Saha çekildi: ${Object.keys(film.screens).length} adım.`)

async function filmIssue(page) {
  await page.goto(`${SITE}/saha`)
  await page.getByText('Bugün şantiyede').waitFor()
  await film.shot(page, 'phone-saha', 1500)
  await film.tap(page.getByRole('button', { name: 'Ekle' }), 'phone-tap-plus')
  await film.layer(page, page.locator('.van-action-sheet', { hasText: 'Sorun bildir' }), 'phone-menu-layer')
  await film.tap(page.getByText('Sorun bildir', { exact: true }), 'phone-tap-issue')
  await film.shot(page, 'phone-issue', 600)
  await typeChunks(page, page.getByPlaceholder('Sorun ne?'), ISSUE, 'phone')
  await film.tap(page.locator('button[aria-label="Gönder"]:visible'), 'phone-tap-send')
  await page.waitForTimeout(1500)
  runSql(here('saha-time.sql'), { body: ISSUE, time: TIMES.issue })
  await page.reload()
  await page.getByText(ISSUE).waitFor()
  await film.shot(page, 'phone-sent', 1500)
  await film.mark(page.locator('.field-row--issue', { hasText: ISSUE }), 'phone-issue-row')
}

async function filmDesk(page) {
  await page.goto(SITE)
  await page.getByPlaceholder('Bir not yaz…').or(page.getByPlaceholder('Bir not yaz...')).waitFor()
  await film.shot(page, 'desk-start', 1800)
  await film.mark(page.locator('.list-row', { hasText: 'Kartal Konutları B Blok' }).first(), 'desk-site-row')
  await film.tap(page.locator('.el-tabs__item, [role="tab"]', { hasText: 'Saha' }).first(), 'desk-tap-saha')
  await page.getByText(ISSUE).first().waitFor()
  await film.shot(page, 'desk-saha', 1500)
  await film.mark(page.locator('.field-row--issue', { hasText: ISSUE }).first(), 'desk-issue-row')
  await film.tap(page.locator('.el-tabs__item, [role="tab"]', { hasText: 'Sohbet' }).first(), 'desk-tap-chat')
  await film.shot(page, 'desk-chat', 1500)
  const box = page.getByPlaceholder('Bir not yaz…').or(page.getByPlaceholder('Bir not yaz...'))
  await typeChunks(page, box, REPLY, 'desk')
  await box.press('Enter')
  await page.waitForTimeout(1500)
  runSql(here('saha-time.sql'), { body: REPLY, time: TIMES.reply })
  await page.reload()
  await page.getByText(REPLY).last().waitFor()
  await film.shot(page, 'desk-replied', 1800)
  await film.mark(page.getByText(REPLY).last(), 'desk-reply')
}

async function filmReply(page) {
  await page.goto(SITE)
  await page.getByText(REPLY).last().waitFor()
  await film.shot(page, 'phone-chat', 1800)
  await film.mark(page.getByText(REPLY).last(), 'phone-reply')
}

/** Yazı kelime öbekleri hâlinde girilir; her öbekten sonra ekran çekilir (videoda harf harf akar gibi). */
async function typeChunks(page, field, text, device) {
  await film.tap(field, `${device}-tap-text`)
  const words = text.split(' ')
  const size = Math.ceil(words.length / 5)
  for (let index = 0; index * size < words.length; index++) {
    const chunk = words.slice(index * size, (index + 1) * size).join(' ')
    await field.pressSequentially(index === 0 ? chunk : ` ${chunk}`)
    await film.shot(page, `${device}-typed-${index + 1}`, 150)
  }
}
