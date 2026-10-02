// Çekimleri kompozisyon için kare dizisine açar: out/captures/<ad>.mp4 → public/clips/<ad>/000001.jpg …
// ve film/clips.generated.ts (kare sayısı, boyut, kurgu işaretleri). node tools/extractClips.mjs [ad…]
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const CAPTURES = `${ROOT}out/captures/`
const names = process.argv.slice(2).length ? process.argv.slice(2)
  : (await readdir(CAPTURES)).filter((file) => file.endsWith('.mp4')).map((file) => file.replace('.mp4', ''))

for (const name of names) {
  const dir = `${ROOT}public/clips/${name}`
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', `${CAPTURES}${name}.mp4`, '-q:v', '2', `${dir}/%06d.jpg`])
  console.log(name, (await readdir(dir)).length, 'kare')
}

const clips = {}
for (const file of (await readdir(CAPTURES)).filter((f) => f.endsWith('.json') && existsSync(`${ROOT}public/clips/${f.replace('.json', '')}`))) {
  const meta = JSON.parse(await readFile(`${CAPTURES}${file}`, 'utf8'))
  const frames = (await readdir(`${ROOT}public/clips/${meta.name}`)).length
  clips[meta.name] = { frames, marks: Object.fromEntries(meta.marks.map((mark) => [mark.label, mark.at])) }
}
await writeFile(`${ROOT}film/clips.generated.ts`, `// Üretildi: tools/extractClips.mjs. Elle düzenlenmez.\nexport const CLIPS = ${JSON.stringify(clips, null, 2)} as const\n\nexport type ClipName = keyof typeof CLIPS\n`)
