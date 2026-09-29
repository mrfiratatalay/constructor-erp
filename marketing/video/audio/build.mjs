/**
 * Videoların sesini üretir: müzik ve efektler public/audio/ altına WAV olarak yazılır. Kütüphane yok, internet yok;
 * her çalıştırmada birebir aynı ses çıkar (gürültüler bile sabit tohumludur). npm run audio.
 */
import { fileURLToPath } from 'node:url'
import { finish, SOUNDS } from './effects.mjs'
import { compose } from './music.mjs'
import { SCORES } from './scores.mjs'
import { writeWav } from './wav.mjs'

const target = (name) => fileURLToPath(new URL(`../public/audio/${name}.wav`, import.meta.url))

const started = Date.now()
for (const [name, score] of Object.entries(SCORES)) writeWav(target(`${name}-muzik`), compose(score))
for (const [name, make] of Object.entries(SOUNDS)) writeWav(target(`sfx/${name}`), finish(make()))
const count = `${Object.keys(SCORES).length} müzik, ${Object.keys(SOUNDS).length} efekt`
console.log(`Ses hazır: ${count} (${((Date.now() - started) / 1000).toFixed(1)} sn).`)
