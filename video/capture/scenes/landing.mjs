// 00:21–00:27 · Tanıtım sitesi: hero (İskele ERP), Fiyatlar, Professional paketini seç.
import { BASE, settle } from '../lib/stage.mjs'

export const stage = { device: 'desktop', person: null, hand: { x: 1500, y: 620 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/`)
  await settle(page, { quiet: 600, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(1600)
  rec.mark('hero')
  await hand.move([1180, 420], { duration: 700 })
  await hand.wait(250)
  rec.mark('to-pricing')
  await hand.click(page.getByRole('navigation', { name: 'Site menüsü' }).getByRole('link', { name: 'Fiyatlar' }))
  await settle(page, { quiet: 300, tl })
  rec.mark('pricing')
  await hand.wait(900)
  const professional = page.locator('.public-plan', { hasText: 'Professional' })
  await hand.move(professional, { dy: 0.35 })
  await hand.wait(700)
  rec.mark('choose')
  await hand.click(professional.getByRole('link', { name: /Bu paketi seçin/ }))
  await settle(page, { quiet: 200, tl })
  rec.mark('apply')
  await hand.wait(1200)
}
