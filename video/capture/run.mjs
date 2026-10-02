// Çekimleri sırayla alır: node capture/run.mjs <sahne…>  → out/captures/<sahne>.mp4 + .json (kurgu işaretleri)
// Her sahne capture/scenes/<ad>.mjs: stage (cihaz, kişi), prepare (kayıttan önce sayfayı hazırlar), play (kayıt).
import { mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { Hand } from './lib/human.mjs'
import { Timeline } from './lib/timeline.mjs'
import { demoNow, DEVICES, openStage } from './lib/stage.mjs'

const OUT = fileURLToPath(new URL('../out/captures', import.meta.url))
const SESSIONS = fileURLToPath(new URL('../out/sessions.json', import.meta.url))

async function shoot(name) {
  const scene = await import(`./scenes/${name}.mjs`)
  const ids = JSON.parse(await readFile(SESSIONS, 'utf8').catch(() => '{}'))
  const { browser, page } = await openStage({ ...scene.stage, stepped: true })
  const tl = new Timeline(page, { name, outDir: OUT, scale: DEVICES[scene.stage.device].deviceScaleFactor })
  await tl.install(demoNow())
  const hand = new Hand(page, tl, scene.stage.hand)
  const context = { page, hand, tl, rec: tl, ids }
  const started = Date.now()
  try {
    await scene.prepare?.(context)
    await tl.start()
    await scene.play(context)
    const meta = await tl.stop()
    console.log(`✓ ${name}: ${meta.duration.toFixed(1)} sn, ${meta.frames} kare (${((Date.now() - started) / 1000).toFixed(0)} sn sürdü)`)
  } catch (error) {
    await page.screenshot({ path: `${OUT}/${name}.error.png` }).catch(() => {})
    throw error
  } finally {
    await browser.close()
  }
}

await mkdir(OUT, { recursive: true })
for (const name of process.argv.slice(2)) await shoot(name)
