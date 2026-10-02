// Bir part'ı izlenebilir MP4 olarak üretir: görüntü (Remotion, sessiz) + o aralığın sesi (mix'ten dilim) → birleşim.
// Kullanım: node scripts/renderPart.mjs 1
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FPS = 30

/** Part'lar filmin saniye aralıklarıdır; final film bunların hepsidir (0–120). */
const PARTS = {
  1: { from: 0, to: 23, name: 'kaos-marka' },
  2: { from: 23, to: 37.5, name: 'kurulum' },
  3: { from: 37.5, to: 50.6, name: 'santiye-saha' },
  4: { from: 50.6, to: 62.5, name: 'yoklama-puantaj' },
  5: { from: 62.5, to: 76.5, name: 'malzeme' },
  6: { from: 76.5, to: 95.5, name: 'ilerleme-gorev' },
  7: { from: 95.5, to: 120, name: 'tek-calisma-alani-kapanis' },
}

const run = (command, args, cwd = ROOT) => execFileSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' && command === 'npx' })

const part = PARTS[process.argv[2]]
if (!part) throw new Error(`Bilinmeyen part: ${process.argv[2]}. Var olanlar: ${Object.keys(PARTS).join(', ')}`)

const number = String(process.argv[2]).padStart(2, '0')
const outDir = join(ROOT, 'out', 'parts')
mkdirSync(outDir, { recursive: true })
const video = join(outDir, `part-${number}.video.mp4`)
const audio = join(outDir, `part-${number}.wav`)
const final = join(outDir, `iskele-erp-part-${number}-${part.name}.mp4`)
const python = join(ROOT, '.venv', 'Scripts', 'python.exe')
const ffmpeg = join(ROOT, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe')

const lastFrame = Math.round(part.to * FPS) - 1
run('npx', ['remotion', 'render', 'src/index.ts', 'Film', video, `--frames=${Math.round(part.from * FPS)}-${lastFrame}`, '--muted'])
run(python, ['part_audio.py', String(part.from), String(part.to), audio], join(ROOT, 'audio'))
run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-i', audio, '-map', '0:v', '-map', '1:a',
  '-c:v', 'copy', '-c:a', 'libfdk_aac', '-b:a', '320k', '-ar', '48000', '-shortest', '-movflags', '+faststart', final])
run(python, ['srt.py', String(part.from), String(part.to), final.replace(/\.mp4$/, '.srt')], join(ROOT, 'audio'))
console.log(`\nHazır: ${final}`)
