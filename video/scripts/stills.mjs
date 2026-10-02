// Kontrol kareleri: projeyi bir kez paketler, verilen saniyelerin karelerini art arda render eder.
// Kullanım: node scripts/stills.mjs 24.5 28.2 31.0 ...  → out/stills/s-<saniye>.png
import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const serveUrl = await bundle({ entryPoint: join(ROOT, 'src', 'index.ts'), publicDir: join(ROOT, 'public') })
const composition = await selectComposition({ serveUrl, id: 'Film' })
mkdirSync(join(ROOT, 'out', 'stills'), { recursive: true })
for (const seconds of process.argv.slice(2).map(Number)) {
  const output = join(ROOT, 'out', 'stills', `s-${seconds.toFixed(2)}.png`)
  await renderStill({ composition, serveUrl, output, frame: Math.round(seconds * 30) })
  console.log(`  ✓ ${seconds.toFixed(2)} sn`)
}
