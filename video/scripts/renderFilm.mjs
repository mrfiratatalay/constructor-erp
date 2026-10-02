// Final film: master (yüksek kalite) → teslim sürümü (1080p H.264), ses kanalları, altyazı ve part dilimleri.
// Kullanım: node scripts/renderFilm.mjs   (önce: cd audio && ../.venv/Scripts/python mix.py)
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'out', 'final')
const PARTS_DIR = join(ROOT, 'out', 'parts')
const NAME = 'iskele-erp-reklam-filmi'
const ffmpeg = join(ROOT, 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe')
const python = join(ROOT, '.venv', 'Scripts', 'python.exe')
const run = (command, args, cwd = ROOT) => execFileSync(command, args, { cwd, stdio: 'inherit', shell: command === 'npx' })
const encode = (args) => run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args])

/** Part'lar filmin bölümleridir; teslim dosyasından kesilir (yeniden render yok). */
const PARTS = [
  [1, 0, 23, 'kaos-marka'], [2, 23, 37.5, 'kurulum'], [3, 37.5, 50.6, 'santiye-saha'], [4, 50.6, 62.5, 'yoklama-puantaj'],
  [5, 62.5, 76.5, 'malzeme'], [6, 76.5, 95.5, 'ilerleme-gorev'], [7, 95.5, 120, 'tek-calisma-alani-kapanis'],
]

mkdirSync(OUT, { recursive: true })
mkdirSync(PARTS_DIR, { recursive: true })
const silentMaster = join(OUT, 'master.video.mp4')
const master = join(OUT, `${NAME}-120s-master.mp4`)
const delivery = join(OUT, `${NAME}-120s-1080p.mp4`)
const mix = join(ROOT, 'public', 'audio', 'mix', 'film.wav')

run('npx', ['remotion', 'render', 'src/index.ts', 'Film', silentMaster, '--muted', '--crf=10'])
encode(['-i', silentMaster, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'libfdk_aac', '-b:a', '320k',
  '-ar', '48000', '-movflags', '+faststart', master])
encode(['-i', master, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'copy',
  '-movflags', '+faststart', delivery])
for (const [stem, label] of [['vo', 'voiceover'], ['music', 'music'], ['sfx', 'sfx']]) {
  encode(['-i', join(ROOT, 'out', 'stems', `${stem}.wav`), '-c:a', 'pcm_s24le', '-ar', '48000', join(OUT, `${NAME}-${label}.wav`)])
}
run(python, ['srt.py'], join(ROOT, 'audio'))
for (const [number, from, to, name] of PARTS) {
  const target = join(PARTS_DIR, `iskele-erp-part-${String(number).padStart(2, '0')}-${name}.mp4`)
  encode(['-ss', String(from), '-to', String(to), '-i', delivery, '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-c:a', 'libfdk_aac', '-b:a', '320k', '-movflags', '+faststart', target])
}
console.log(`\nHazır: ${delivery}`)
