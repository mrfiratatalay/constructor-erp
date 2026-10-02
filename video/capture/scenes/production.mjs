// 01:23–01:36 · İmalat: Alçı Ekibi'nin bugünkü girişi (68 m²), ilerleme yüzdesi güncellenir; günlük geçmiş.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: 'ayse', hand: { x: 1300, y: 600 } }

export async function prepare({ page, tl, ids }) {
  await page.goto(`${BASE}/santiyeler/${ids.siteIds.yomra}/ilerleme`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  const card = page.locator('.item-row, .el-card', { hasText: '3. kat iç cephe' }).first()
  await hand.wait(1000)
  rec.mark('board')
  await hand.move(card, { dx: 0.3, dy: 0.3, duration: 900 })
  await hand.wait(600)
  rec.mark('entry')
  await hand.click(card.getByRole('button', { name: 'Güncelle' }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(500)
  const drawer = page.locator('.el-drawer', { hasText: 'Günlük İlerleme' })
  await hand.fill(drawer.getByLabel('Bugün yapılan'), '68', { speed: 0.8 })
  await hand.fill(drawer.getByLabel('Çalışan sayısı'), '6', { speed: 0.8 })
  rec.mark('note')
  await hand.fill(drawer.getByPlaceholder(/A Blok 4\. kat/), 'Merdiven holü ve 3 daire tamamlandı.', { speed: 1.6 })
  await hand.wait(300)
  rec.mark('save')
  await hand.click(drawer.getByRole('button', { name: 'Güncellemeyi kaydet' }))
  await settle(page, { quiet: 100, tl })
  rec.mark('progress')
  await hand.move(card, { dx: 0.85, dy: 0.45, duration: 800 })
  await hand.wait(1800)
  rec.mark('history')
  await hand.click(card.getByRole('button', { name: 'Detay' }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(900)
  await hand.scroll(420, { at: [1200, 650], duration: 1400 })
  await hand.wait(1400)
}
