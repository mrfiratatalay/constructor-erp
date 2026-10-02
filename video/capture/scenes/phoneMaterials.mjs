// 01:46 · Depo hareketi kaydeder: depo sorumlusunun telefonunda malzeme hareketleri.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'phone', person: 'mehmet', hand: { x: 200, y: 600 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/malzemeler`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(900)
  rec.mark('list')
  await hand.scroll(260, { at: [200, 620], duration: 1000 })
  await hand.wait(500)
  rec.mark('open')
  await hand.click(page.locator('.van-cell', { hasText: 'Kalıp paneli' }).first(), { duration: 260 })
  await settle(page, { quiet: 100, tl })
  await hand.wait(2400)
}
