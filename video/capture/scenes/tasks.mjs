// 01:36–01:45 · Görev: "3. kat elektrik tesisatı kontrolü" → Musa, teslim tarihi; oluştur, sonra Tamamlandı.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: 'ayse', hand: { x: 1300, y: 500 } }
const TITLE = '3. kat elektrik tesisatı kontrolü'

export async function prepare({ page, tl, ids }) {
  await page.goto(`${BASE}/santiyeler/${ids.siteIds.yomra}/gorevler`)
  await settle(page, { quiet: 600, tl })
}

async function chooseDue({ page, hand, tl }, dialog) {
  await hand.click(dialog.locator('.el-date-editor input').first())
  await settle(page, { quiet: 60, tl })
  await hand.wait(350)
  await hand.click(page.locator('.el-picker-panel:visible td.available', { hasText: /^\s*24\s*$/ }).first())
}

export async function play(context) {
  const { page, hand, rec, tl } = context
  await hand.wait(900)
  rec.mark('add')
  await hand.click(page.getByRole('button', { name: 'Görev ekle' }))
  await settle(page, { quiet: 100, tl })
  const dialog = page.locator('.el-dialog', { hasText: 'Yeni görev' })
  rec.mark('title')
  await hand.fill(dialog.getByPlaceholder('Kalıp sökümü'), TITLE, { speed: 1.2 })
  rec.mark('assignee')
  await hand.click(dialog.locator('.el-select').first())
  await hand.wait(300)
  await hand.click(page.locator('.el-select-dropdown__item:visible', { hasText: 'Musa Aydın' }).first())
  rec.mark('due')
  await chooseDue(context, dialog)
  await hand.click(dialog.locator('.el-radio-button', { hasText: 'Yüksek' }).first())
  await hand.wait(300)
  rec.mark('save')
  await hand.click(dialog.getByRole('button', { name: 'Oluştur' }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(900)
  rec.mark('open')
  await hand.click(page.getByText(TITLE).first())
  await settle(page, { quiet: 100, tl })
  await hand.wait(700)
  rec.mark('done')
  await hand.click(page.locator('.el-radio-button', { hasText: 'Tamamlandı' }).first())
  await settle(page, { quiet: 100, tl })
  await hand.wait(1800)
}
