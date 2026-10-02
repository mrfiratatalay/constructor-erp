// 01:07–01:23 · Malzeme: Ana depo → Yomra Park, 24 adet kalıp paneli (canlı); Geri Beklenenler; hareket geçmişi.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: 'mehmet', hand: { x: 1200, y: 600 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/malzemeler`)
  await settle(page, { quiet: 600, tl })
}

async function pick({ page, hand, tl }, trigger, option) {
  await hand.click(trigger)
  await settle(page, { quiet: 60, tl })
  await hand.wait(300)
  await hand.click(page.locator('.el-select-dropdown__item:visible', { hasText: option }).first())
}

export async function play(context) {
  const { page, hand, rec, tl } = context
  await hand.wait(1100)
  rec.mark('new')
  await hand.click(page.getByRole('button', { name: /Yeni Hareket/ }))
  await hand.wait(300)
  await hand.click(page.locator('.el-dropdown-menu__item:visible', { hasText: 'Şantiyeye gönder' }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(500)
  rec.mark('site')
  const form = page.locator('.movement-form')
  await pick(context, form.locator('.el-select', { hasText: 'Şantiye seçin' }).first(), 'Yomra Park Konutları')
  rec.mark('material')
  await pick(context, form.locator('.el-select', { hasText: 'Malzeme seçin' }).first(), 'Kalıp paneli')
  await hand.fill(form.locator('.el-input-number input').first(), '24', { speed: 0.8 })
  await hand.wait(400)
  rec.mark('save')
  await hand.click(form.locator('.el-drawer__footer .el-button--primary'))
  await settle(page, { quiet: 100, tl })
  rec.mark('detail')
  await hand.wait(2200)
  await page.keyboard.press('Escape')
  await hand.wait(700)
  rec.mark('returns')
  await hand.click(page.locator('.el-tabs__item', { hasText: 'Geri Beklenenler' }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(1800)
  rec.mark('all')
  await hand.click(page.locator('.el-tabs__item', { hasText: 'Tüm Hareketler' }))
  await settle(page, { quiet: 100, tl })
  await hand.scroll(380, { at: [1100, 650], duration: 1400 })
  await hand.wait(1300)
}
