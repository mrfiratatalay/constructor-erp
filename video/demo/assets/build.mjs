// Demo varlıkları: firma logosu (PNG), sesli not (Opus) ve kısa şantiye videosu (MP4, fotoğraftan yavaş yaklaşma).
//   node demo/assets/build.mjs → out/assets/
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { launch } from '../../tools/browser.mjs'
import { speak } from '../../audio/tts.mjs'

const HERE = fileURLToPath(new URL('.', import.meta.url))
const OUT = fileURLToPath(new URL('../../out/assets/', import.meta.url))
const PHOTOS = fileURLToPath(new URL('../../out/photos/', import.meta.url))
const ffmpeg = (...args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args])

async function logo() {
  const browser = await launch()
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } })
  await page.setContent(`<style>body{margin:0}</style>${await readFile(`${HERE}logo.svg`, 'utf8')}`)
  await page.locator('svg').screenshot({ path: `${OUT}atalay-yapi-logo.png`, omitBackground: true })
  await browser.close()
}

/** Mehmet'in sesli notu: kısa, gerçek bir saha cümlesi. Ürün sesli notu Opus olarak alır (tarayıcı kaydı gibi). */
async function voiceNote() {
  const mp3 = `${OUT}sesli-not.mp3`
  await writeFile(mp3, await speak('Ayşe Hanım, demirler geldi, boşaltmaya başladık. Yarım saate depoya alırız.'))
  ffmpeg('-i', mp3, '-af', 'highpass=f=180,lowpass=f=6000,volume=0.9', '-c:a', 'libopus', '-b:a', '32k', `${OUT}sesli-not.ogg`)
}

/** Şantiye videosu: genel görünüş fotoğrafına yavaşça yaklaşan, telefonla çekilmiş gibi kısa bir klip. */
function siteClip() {
  ffmpeg('-loop', '1', '-i', `${PHOTOS}santiye-yomra.jpg`, '-t', '6', '-vf',
    "scale=3200:-1,zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)+on*0.6':y='ih/2-(ih/zoom/2)':d=180:s=1280x960:fps=30,format=yuv420p",
    '-c:v', 'libx264', '-crf', '20', '-movflags', '+faststart', `${OUT}santiye-video.mp4`)
}

await mkdir(OUT, { recursive: true })
await logo()
await voiceNote()
siteClip()
console.log('varlıklar hazır:', OUT)
