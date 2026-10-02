// 00:53–00:59 · Şef yoklamayı sahada, telefondan alır: Ali ve Murat Geldi, Emre İzinli, Hasan Yarım gün.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'phone', person: 'ayse', hand: { x: 200, y: 600 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/yoklama`)
  await settle(page, { quiet: 600, tl })
}

async function mark({ page, hand, tl }, name, status) {
  await hand.click(page.locator('.van-cell', { hasText: name }).first(), { duration: 260, after: 120 })
  await settle(page, { quiet: 80, tl })
  await hand.wait(420)
  const sheet = page.locator('.van-action-sheet')
  await hand.click(sheet.locator('.van-button', { hasText: new RegExp(`^\\s*${status}`) }).first(), { duration: 240, after: 120 })
  await hand.wait(480)
}

export async function play(context) {
  const { hand, rec } = context
  await hand.wait(900)
  rec.mark('ali')
  await mark(context, 'Ali Yılmaz', 'Geldi')
  rec.mark('emre')
  await mark(context, 'Emre Kaya', 'İzinli')
  rec.mark('hasan')
  await mark(context, 'Hasan Koç', 'Yarım')
  rec.mark('murat')
  await hand.scroll(330, { at: [200, 640], duration: 700 })
  await mark(context, 'Murat Demir', 'Geldi')
  rec.mark('done')
  await hand.scroll(-900, { duration: 800 })
  await hand.wait(1500)
}
