// Kare alma: sayfa tamamen hazır olunca PNG + o andaki önemli öğelerin kutuları (JSON).
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'capture')

/** Ağ susana, fontlar yüklenene ve iki kare çizilene kadar bekler: yarım yüklenmiş ekran çekilmez. */
export const settle = async (page, extraMs = 250) => {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))))
  await page.waitForTimeout(extraMs)
}

/** Seçicilerin ekran kutuları (CSS pikseli): film imleci ve kamera yakınlaşması bunlara göre hareket eder. */
const boxesOf = async (page, targets) => {
  const boxes = {}
  for (const [name, selector] of Object.entries(targets)) {
    const box = await page.locator(selector).first().boundingBox().catch(() => null)
    if (box) boxes[name] = box
  }
  return boxes
}

/**
 * Bir durumu kaydeder: public/capture/<sahne>/<ad>.png ve aynı adla .json (kutular).
 * targets: { ad: 'css seçici' }.
 */
export const shoot = async (page, scene, name, targets = {}) => {
  const file = join(ROOT, scene, `${name}.png`)
  await mkdir(dirname(file), { recursive: true })
  await page.screenshot({ path: file })
  const boxes = await boxesOf(page, targets)
  await writeFile(join(ROOT, scene, `${name}.json`), JSON.stringify(boxes, null, 1))
  console.log(`  ✓ ${scene}/${name}`)
  return boxes
}
