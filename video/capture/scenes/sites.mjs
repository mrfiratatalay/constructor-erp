// 00:38–00:53 · Şantiyeler (WhatsApp Masaüstü gibi): Yomra Park'ın sohbeti, fotoğrafla saha güncellemesi, mesaj
// menüsünden "Sahaya ekle", sonra Saha sekmesinde günün kayıtları (14:20, 11:05, 10:20, 09:40).
import { fileURLToPath } from 'node:url'
import { BASE, settle } from '../lib/stage.mjs'

const PHOTO = fileURLToPath(new URL('../../out/photos/kolon-kaliplari.jpg', import.meta.url))
const TEXT = '2. kat kolon kalıpları tamamlandı.'

export const stage = { device: 'desktop', person: 'ayse', hand: { x: 1100, y: 700 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/santiyeler`)
  await settle(page, { quiet: 600, tl })
}

async function sendPhoto({ page, hand, tl }) {
  await hand.click(page.locator('.composer-bar').getByRole('button', { name: 'Ekle' }))
  await hand.wait(250)
  await hand.click(page.locator('.el-dropdown-menu__item', { hasText: 'Fotoğraf ve video' }).last())
  await page.locator('.composer-bar input[type=file][accept*="image"]').setInputFiles(PHOTO)
  await settle(page, { quiet: 200, tl })
  await hand.wait(900)
  await hand.click(page.getByRole('button', { name: /Gönder · 1 dosya/ }))
}

async function addToField({ page, hand }) {
  const bubble = page.locator('.feed-column .bubble', { hasText: TEXT }).last()
  await hand.move(bubble, { dx: 0.6, dy: 0.3 })
  await hand.wait(300)
  await hand.click(bubble.getByRole('button', { name: 'Mesaj işlemleri' }))
  await hand.wait(250)
  await hand.click(page.locator('.el-dropdown-menu__item', { hasText: 'Sahaya ekle' }).last())
}

export async function play(context) {
  const { page, hand, rec, tl } = context
  await hand.wait(700)
  rec.mark('list')
  await hand.click(page.locator('.site-list__row', { hasText: 'Yomra Park Konutları' }).first())
  await settle(page, { quiet: 150, tl })
  rec.mark('chat')
  await hand.move([1250, 70], { duration: 800 })
  await hand.wait(900)
  rec.mark('media')
  await hand.scroll(-520, { at: [1500, 640], duration: 1100 })
  await hand.wait(1200)
  await hand.scroll(520, { duration: 900 })
  rec.mark('typing')
  await hand.click(page.getByPlaceholder('Bir not yaz…'))
  await hand.type(TEXT, { speed: 1.1 })
  rec.mark('photo')
  await sendPhoto(context)
  rec.mark('sent')
  await hand.wait(600)
  await hand.scroll(2400, { at: [1500, 760], duration: 700 })
  await hand.wait(1400)
  rec.mark('to-field')
  await addToField(context)
  await hand.wait(900)
  rec.mark('field')
  await hand.click(page.locator('.site-tabs').getByText('Saha', { exact: true }))
  await settle(page, { quiet: 100, tl })
  await hand.wait(1300)
  rec.mark('field-scroll')
  await hand.scroll(560, { at: [1450, 700], duration: 2600 })
  await hand.wait(1400)
}
