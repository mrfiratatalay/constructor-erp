// 01:36 civarı · Depo hareketi kaydeder: depo sorumlusunun telefonunda hareketler, "Yeni Hareket" ile kayıt başlar.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'phone', person: 'mehmet', hand: { x: 200, y: 600 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/malzemeler`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(700)
  rec.mark('list')
  await hand.scroll(520, { at: [200, 620], duration: 1100 })
  await hand.wait(500)
  await hand.scroll(-520, { duration: 800 })
  rec.mark('new')
  await hand.click(page.getByText('Yeni Hareket').first(), { duration: 260 })
  await settle(page, { quiet: 100, tl })
  await hand.wait(900)
  const option = page.getByText(/Şantiyeye gönder/).first()
  if (await option.isVisible().catch(() => false)) {
    rec.mark('option')
    await hand.click(option, { duration: 260 })
    await settle(page, { quiet: 100, tl })
  }
  await hand.wait(1800)
}
