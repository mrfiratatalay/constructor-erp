// 01:45 · Saha telefondan günceller: şef, Saha sekmesinde fotoğraflı güncelleme gönderir.
import { fileURLToPath } from 'node:url'
import { BASE, settle } from '../lib/stage.mjs'

const PHOTO = fileURLToPath(new URL('../../out/photos/santiye-yomra.jpg', import.meta.url))
export const stage = { device: 'phone', person: 'ayse', hand: { x: 200, y: 700 } }

export async function prepare({ page, tl, ids }) {
  await page.goto(`${BASE}/santiyeler/${ids.siteIds.yomra}/saha`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(800)
  rec.mark('type')
  await hand.click(page.getByPlaceholder('Bugün şantiyede ne oldu?'), { duration: 250 })
  await hand.type('İskele 3. kata taşındı.', { speed: 1.2 })
  await page.locator('input[type=file][accept*="image"]').first().setInputFiles(PHOTO)
  await settle(page, { quiet: 200, tl })
  await hand.wait(700)
  rec.mark('send')
  const composer = page.locator('.van-field, form, footer').last()
  await hand.click(page.locator('button[aria-label="Gönder"]').or(composer.locator('button').last()).first(), { duration: 250 })
  await settle(page, { quiet: 100, tl })
  await hand.wait(2200)
}
