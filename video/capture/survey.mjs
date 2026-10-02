// Keşif: ekranların seed verisiyle nasıl göründüğü (yalnızca geliştirme). node capture/survey.mjs → out/survey/*.png
import { mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BASE, openStage, settle } from './lib/stage.mjs'

const OUT = fileURLToPath(new URL('../out/survey/', import.meta.url))
const { siteIds } = JSON.parse(await readFile(fileURLToPath(new URL('../out/sessions.json', import.meta.url)), 'utf8'))
const y = siteIds.yomra
const ONLY = process.argv.slice(2)
const SHOTS = [
  ['desktop', null, '/', 'landing'],
  ['desktop', null, '/fiyatlar', 'pricing'],
  ['desktop', null, '/basvuru?paket=professional', 'apply'],
  ['desktop', 'kemal', '/santiyeler', 'sites'],
  ['desktop', 'ayse', `/santiyeler/${y}`, 'chat-ayse'],
  ['desktop', 'kemal', `/santiyeler/${y}/saha`, 'field'],
  ['desktop', 'kemal', `/santiyeler/${y}/ilerleme`, 'production'],
  ['desktop', 'kemal', `/santiyeler/${y}/gorevler`, 'tasks'],
  ['desktop', 'kemal', '/yoklama', 'attendance'],
  ['desktop', 'kemal', '/yoklama?sekme=puantaj', 'puantaj'],
  ['desktop', 'kemal', '/malzemeler', 'materials'],
  ['phone', 'ayse', '/yoklama', 'phone-attendance'],
  ['phone', 'ayse', `/santiyeler/${y}/saha`, 'phone-field'],
  ['phone', 'mehmet', '/malzemeler', 'phone-materials'],
]

await mkdir(OUT, { recursive: true })
for (const [device, person, path, name] of SHOTS.filter((shot) => !ONLY.length || ONLY.includes(shot[3]))) {
  const { browser, page } = await openStage({ device, person })
  await page.goto(BASE + path)
  await settle(page, { quiet: 900 })
  await page.screenshot({ path: `${OUT}${name}.png` })
  console.log(name, page.url())
  await browser.close()
}
