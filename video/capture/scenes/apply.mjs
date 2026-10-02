// 00:27–00:30 · Başvuru: Atalay Yapı formu doldurur ve gönderir (paket Fiyatlar'dan seçili gelir).
import { COMPANY, LEAD, OWNER } from '../../demo/seed/content.mjs'
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: null, hand: { x: 1330, y: 760 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/basvuru?paket=professional`)
  await settle(page, { quiet: 500, tl })
}

const field = (page, name) => page.locator(`[name="${name}"]`)

export async function play({ page, hand, rec, tl }) {
  await hand.wait(500)
  rec.mark('company')
  await hand.fill(field(page, 'companyName'), COMPANY.name, { speed: 0.9 })
  rec.mark('contact')
  await hand.fill(field(page, 'contactName'), LEAD.contactName, { speed: 1.4 })
  await hand.fill(field(page, 'phone'), LEAD.phone, { speed: 1.6 })
  await hand.fill(field(page, 'email'), OWNER.email, { speed: 1.8 })
  await hand.fill(field(page, 'city'), COMPANY.city, { speed: 1.6 })
  await hand.click(page.locator('.apply-card__number input'))
  await page.keyboard.press('Control+A')
  await hand.type(String(LEAD.siteCount))
  rec.mark('message')
  await hand.fill(field(page, 'message'), LEAD.message, { speed: 2.4 })
  await hand.wait(300)
  rec.mark('submit')
  await hand.click(page.getByRole('button', { name: /Tanıtım talebini gönder/ }))
  await settle(page, { quiet: 100, tl })
  rec.mark('sent')
  await hand.move([1100, 700], { duration: 600 })
  await hand.wait(1400)
}
