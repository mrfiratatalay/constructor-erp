// Demo fotoğraflarını üretir: node demo/photos/render.mjs [ad…] → out/photos/<ad>.jpg
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { launch } from '../../tools/browser.mjs'
import { serve } from '../../tools/staticServer.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const OUT = `${ROOT}out/photos`
const SIZES = { default: [1600, 1200] }
const ALL = ['kolon-kaliplari', 'demir-teslim', 'santiye-yomra', 'santiye-kasustu', 'santiye-sahil', 'alci-3-kat']

const server = await serve(ROOT)
const browser = await launch()
const page = await browser.newPage()
page.on('pageerror', (error) => console.error('sayfa hatası:', error.message))
await page.goto(`${server.url}/demo/photos/studio.html`)
await page.waitForFunction(() => window.studioReady === true)
await mkdir(OUT, { recursive: true })
for (const name of process.argv.slice(2).length ? process.argv.slice(2) : ALL) {
  const [width, height] = SIZES[name] ?? SIZES.default
  const started = Date.now()
  const data = await page.evaluate(([n, w, h]) => window.renderShot(n, w, h), [name, width, height])
  await writeFile(`${OUT}/${name}.jpg`, Buffer.from(data.split(',')[1], 'base64'))
  console.log(`${name}.jpg ${width}x${height} · ${Date.now() - started} ms`)
}
await browser.close()
server.close()
