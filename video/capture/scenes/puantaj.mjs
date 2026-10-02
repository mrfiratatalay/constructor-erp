// 00:59–01:07 · Ofis aynı kayıtları görür: Bugün sekmesi, aylık Puantaj cetveli, kişinin ayı, Excel indir.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: 'kemal', hand: { x: 1100, y: 640 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/yoklama`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(1000)
  rec.mark('month')
  await hand.click(page.locator('.el-tabs__item', { hasText: 'Puantaj' }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(900)
  rec.mark('row')
  const row = page.locator('.el-table__row', { hasText: 'Ali Yılmaz' }).first()
  await hand.move(row, { dx: 0.35, dy: 0.5, duration: 700 })
  await hand.move(row, { dx: 0.8, dy: 0.5, duration: 1300 })
  await hand.wait(300)
  rec.mark('drawer')
  await hand.click(row.getByText('Ali Yılmaz').first())
  await settle(page, { quiet: 100, tl })
  await hand.wait(1800)
  await page.keyboard.press('Escape')
  await hand.wait(600)
  rec.mark('excel')
  await hand.click(page.getByRole('link', { name: /Excel indir/ }).or(page.getByRole('button', { name: /Excel indir/ })).first(), { hover: 500 })
  await hand.wait(1300)
}
