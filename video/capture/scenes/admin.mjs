// 00:30–00:35 · Platform yönetimi: başvuruyu firmaya dönüştür, Havale/EFT ödemesini kaydet, kurulum bağlantısı üret.
// Bağlantı ekranda maskelenir; gerçeği out/setup-link.txt'e yazılır (kurulum çekimi onu açar).
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BASE, settle } from '../lib/stage.mjs'

const LINK_FILE = fileURLToPath(new URL('../../out/setup-link.txt', import.meta.url))

export const stage = { device: 'desktop', person: 'admin', hand: { x: 1250, y: 650 } }

export async function prepare({ page, tl }) {
  await page.goto(`${BASE}/platform-admin/basvurular`)
  await settle(page, { quiet: 500, tl })
}

export async function play({ page, hand, rec, tl }) {
  await hand.wait(700)
  rec.mark('lead')
  const row = page.locator('.el-table__row', { hasText: 'Atalay Yapı' }).first()
  await hand.move(row, { dx: 0.2 })
  await hand.wait(500)
  await hand.click(page.locator('.el-table__fixed-right .el-table__row, .el-table__row').getByRole('button', { name: 'Firmaya dönüştür' }).first())
  await settle(page, { quiet: 200, tl })
  rec.mark('dialog')
  await hand.wait(900)
  const dialog = page.locator('.el-dialog', { hasText: 'Yeni firma' })
  await hand.scroll(420, { at: dialog.locator('.el-dialog__body'), duration: 800 })
  rec.mark('payment')
  await hand.click(dialog.getByText('Havale / EFT', { exact: true }))
  await hand.fill(dialog.getByPlaceholder(/Elden alındı/), 'Havale/EFT · dekont alındı', { speed: 2.2 })
  await hand.wait(300)
  rec.mark('open')
  await hand.click(dialog.getByRole('button', { name: /Firmayı aç ve bağlantı üret/ }))
  await settle(page, { quiet: 100, tl })
  rec.mark('link')
  await hand.move(page.locator('.el-dialog', { hasText: 'Kurulum bağlantısı hazır' }).locator('.onboarding-link__url'), { duration: 700 })
  await hand.wait(1600)
  const link = await page.evaluate(() => window.__stageSecrets.setupUrl)
  if (!link) throw new Error('kurulum bağlantısı okunamadı')
  await writeFile(LINK_FILE, link)
}
