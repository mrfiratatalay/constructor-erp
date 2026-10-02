// 00:35–00:38 · Kurulum sihirbazı: patron kurulum bağlantısını açar; firma (logo), hesabı ve ilk şantiyesi.
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { OWNER, SITES } from '../../demo/seed/content.mjs'
import { settle } from '../lib/stage.mjs'

const LINK_FILE = fileURLToPath(new URL('../../out/setup-link.txt', import.meta.url))
const LOGO = fileURLToPath(new URL('../../out/assets/atalay-yapi-logo.png', import.meta.url))

export const stage = { device: 'desktop', person: null, hand: { x: 1500, y: 700 } }

export async function prepare({ page, tl }) {
  await page.goto((await readFile(LINK_FILE, 'utf8')).trim())
  await settle(page, { quiet: 500, tl })
}

const next = (page) => page.getByRole('button', { name: 'Devam', exact: true })

async function uploadLogo(page, hand, tl) {
  await hand.click(page.locator('.setup-company button').first())
  await page.locator('.setup-company input[type=file]').setInputFiles(LOGO)
  await settle(page, { quiet: 300, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(900)
  rec.mark('company')
  await uploadLogo(page, hand, tl)
  await hand.wait(600)
  await hand.click(next(page))
  rec.mark('owner')
  await hand.fill(page.getByLabel('Adınız soyadınız'), OWNER.fullName, { speed: 1.5 })
  await hand.fill(page.getByLabel('Giriş e-postası'), OWNER.email, { speed: 2 })
  await hand.fill(page.getByLabel('Şifre', { exact: true }), OWNER.password, { speed: 2.2 })
  await hand.fill(page.getByLabel('Şifre (tekrar)'), OWNER.password, { speed: 2.2 })
  await hand.click(next(page))
  rec.mark('site')
  await hand.fill(page.getByPlaceholder(/Kartal Konutları/), SITES.yomra.name, { speed: 1.2 })
  await hand.fill(page.getByPlaceholder(/yol tarifini/), SITES.yomra.address, { speed: 2.4 })
  await hand.click(next(page))
  rec.mark('summary')
  await hand.wait(1100)
  rec.mark('finish')
  await hand.click(page.getByRole('button', { name: 'Kurulumu bitir' }))
  await settle(page, { quiet: 200, tl })
  rec.mark('workspace')
  await hand.move([980, 520], { duration: 700 })
  await hand.wait(1500)
}
