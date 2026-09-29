/**
 * Videoların sesini üretir: müzik ve efektler public/audio/ altına WAV olarak yazılır. Kütüphane yok, internet yok;
 * her çalıştırmada birebir aynı ses çıkar (gürültüler bile sabit tohumludur). npm run audio.
 */
import { fileURLToPath } from 'node:url'
import { finish, SOUNDS } from './effects.mjs'
import { composeYoklama } from './music.mjs'
import { writeWav } from './wav.mjs'

const target = (name) => fileURLToPath(new URL(`../public/audio/${name}.wav`, import.meta.url))

const started = Date.now()
writeWav(target('yoklama-muzik'), composeYoklama())
for (const [name, make] of Object.entries(SOUNDS)) writeWav(target(`sfx/${name}`), finish(make()))
console.log(`Ses hazır: müzik ve ${Object.keys(SOUNDS).length} efekt (${((Date.now() - started) / 1000).toFixed(1)} sn).`)
