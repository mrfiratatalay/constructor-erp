// Çekimlerin öğe kutularını (public/capture/**/*.json) tek dosyada toplar: src/film/boxes.json.
// Sahneler imlecin ve kameranın hedeflerini buradan okur; çekimler yenilenince bu betik yeniden çalıştırılır.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CAPTURE = join(ROOT, 'public', 'capture')
const round = (box) => Object.fromEntries(Object.entries(box).map(([key, value]) => [key, Math.round(value * 10) / 10]))
const all = {}
for (const scene of readdirSync(CAPTURE)) {
  for (const file of readdirSync(join(CAPTURE, scene)).filter((name) => name.endsWith('.json'))) {
    const boxes = JSON.parse(readFileSync(join(CAPTURE, scene, file), 'utf8'))
    all[`${scene}/${file.replace('.json', '')}`] = Object.fromEntries(Object.entries(boxes).map(([key, box]) => [key, round(box)]))
  }
}
// Her çekim tek satır: dosya kısa kalır, değişiklikler satır satır okunur.
const lines = Object.entries(all).map(([key, boxes]) => `  ${JSON.stringify(key)}: ${JSON.stringify(boxes)}`)
const NEWLINE = String.fromCharCode(10)
writeFileSync(join(ROOT, 'src', 'film', 'boxes.json'), ['{', lines.join(`,${NEWLINE}`), '}', ''].join(NEWLINE))
console.log(`${Object.keys(all).length} çekimin kutuları yazıldı.`)
