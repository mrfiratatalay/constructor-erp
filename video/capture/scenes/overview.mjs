// 01:47 ve kapanış · Ofis bilgisayardan bütünü takip eder: patronun şantiye listesi, Yomra Park'ın Saha'sı.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: 'kemal', hand: { x: 1250, y: 760 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/santiyeler`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(1500)
  rec.mark('open')
  await hand.click(page.locator('.site-list__row', { hasText: 'Yomra Park Konutları' }).first())
  await settle(page, { quiet: 100, tl })
  await hand.click(page.locator('.site-tabs').getByText('Saha', { exact: true }))
  await settle(page, { quiet: 100, tl })
  rec.mark('field')
  await hand.move([1500, 520], { duration: 900 })
  await hand.wait(2600)
}
