import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { RATE } from './dsp.mjs'

/** Stereo sesi 16 bit PCM WAV olarak yazar: her tarayıcı ve Remotion doğrudan çalar. */
export function writeWav(path, [left, right]) {
  const frames = left.length
  const data = Buffer.alloc(frames * 4)
  for (let index = 0; index < frames; index++) {
    data.writeInt16LE(toInt16(left[index]), index * 4)
    data.writeInt16LE(toInt16(right[index]), index * 4 + 2)
  }
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write('WAVEfmt ', 8)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(2, 22)
  header.writeUInt32LE(RATE, 24)
  header.writeUInt32LE(RATE * 4, 28)
  header.writeUInt16LE(4, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(data.length, 40)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, Buffer.concat([header, data]))
}

const toInt16 = (value) => Math.round(Math.max(-1, Math.min(1, value)) * 32767)
