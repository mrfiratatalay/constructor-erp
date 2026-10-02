// Seslendirmeyi üretir: her cümle ayrı (TTS), sonra stüdyo zinciri: 48 kHz, hafif tempo (rubberband, perde korunur),
// gövde EQ'su, de-esser, yumuşak sıkıştırma. node audio/voice.mjs → out/audio/vo/<id>.wav + durations.json
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { VOICE } from './script.mjs'
import { speak } from './tts.mjs'

const OUT = fileURLToPath(new URL('../out/audio/vo/', import.meta.url))
const ffmpeg = (...args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args])
const BASE_TEMPO = 1.15

const chain = (tempo) => [
  'aresample=48000',
  `rubberband=tempo=${tempo}:pitch=0.985:formant=preserved:pitchq=quality`,
  'highpass=f=75', 'equalizer=f=160:t=q:w=1.1:g=2.2', 'equalizer=f=3200:t=q:w=1.4:g=1.6',
  'equalizer=f=9000:t=h:w=1:g=2', 'deesser=i=0.35',
  'acompressor=threshold=0.12:ratio=2.5:attack=8:release=120:makeup=1.6',
  'silenceremove=start_periods=1:start_threshold=-48dB', 'areverse',
  'silenceremove=start_periods=1:start_threshold=-48dB', 'areverse',
  'afade=t=in:d=0.01', 'apad=pad_dur=0.04',
].join(',')

const duration = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString())

await mkdir(OUT, { recursive: true })
const durations = {}
for (const line of VOICE) {
  const mp3 = `${OUT}${line.id}.mp3`
  if (!existsSync(mp3)) await writeFile(mp3, await speak(line.text))
  const wav = `${OUT}${line.id}.wav`
  ffmpeg('-i', mp3, '-af', chain((line.tempo ?? 1) * BASE_TEMPO), '-ac', '1', '-c:a', 'pcm_s24le', wav)
  durations[line.id] = +duration(wav).toFixed(3)
  const next = VOICE[VOICE.indexOf(line) + 1]
  const room = next ? next.at - line.at : 120 - line.at
  console.log(`${line.id} @${line.at.toFixed(1)} ${durations[line.id].toFixed(2)} sn (yer ${room.toFixed(1)})${durations[line.id] > room ? '  ⚠ taşıyor' : ''}  ${line.text}`)
}
await writeFile(`${OUT}durations.json`, JSON.stringify(durations, null, 2))
