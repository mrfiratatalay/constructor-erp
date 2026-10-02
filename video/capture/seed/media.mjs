// Demo saha fotoğrafları (kodla çizilmiş) ve şefin sesli notu (TTS). Gerçek kişi ya da yer fotoğrafı yok.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { CACHE } from '../lib/stack.mjs'

const SKY = '<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9fca"/><stop offset="1" stop-color="#ecd3ad"/></linearGradient></defs><rect width="1200" height="900" fill="url(#s)"/>'
const GROUND = '<rect y="640" width="1200" height="260" fill="#8a8a86"/><rect y="630" width="1200" height="14" fill="#a3a39d"/>'

const PHOTOS = {
  formwork: `${SKY}${GROUND}${[150, 420, 690, 960].map((x) => `
    <rect x="${x}" y="240" width="110" height="400" fill="#b5844f"/><rect x="${x}" y="240" width="110" height="10" fill="#dcae78"/>
    <line x1="${x + 55}" y1="240" x2="${x + 55}" y2="640" stroke="#8a6440" stroke-width="4"/>
    <line x1="${x - 70}" y1="640" x2="${x + 6}" y2="380" stroke="#6b6f78" stroke-width="9"/>
    ${[18, 55, 92].map((d) => `<line x1="${x + d}" y1="240" x2="${x + d}" y2="170" stroke="#4b505b" stroke-width="6"/>`).join('')}`).join('')}
    <g transform="translate(830 560)"><rect x="-16" y="-80" width="34" height="80" rx="8" fill="#2f3b52"/><circle cx="1" cy="-98" r="17" fill="#c99c7c"/><path d="M-20 -100 a21 21 0 0 1 42 0z" fill="#facc15"/><rect x="-16" y="-80" width="34" height="12" fill="#f97316"/></g>`,
  rebar: `${SKY}${GROUND}
    <rect x="160" y="420" width="640" height="150" rx="10" fill="#c2410c"/><rect x="800" y="380" width="240" height="190" rx="18" fill="#9a3412"/>
    <rect x="860" y="410" width="130" height="80" rx="8" fill="#bfdbfe"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="180" y="${300 + i * 28}" width="600" height="20" rx="6" fill="#57534e"/>`).join('')}
    ${[250, 420, 900].map((x) => `<circle cx="${x}" cy="590" r="54" fill="#1f2937"/><circle cx="${x}" cy="590" r="22" fill="#9ca3af"/>`).join('')}`,
  pump: `${SKY}${GROUND}
    <rect x="200" y="460" width="560" height="120" rx="12" fill="#e5e7eb"/><rect x="760" y="420" width="220" height="160" rx="16" fill="#cbd5e1"/>
    <rect x="800" y="450" width="120" height="70" rx="8" fill="#93c5fd"/>
    <path d="M300 460 L520 250 L900 170" stroke="#f59e0b" stroke-width="34" fill="none" stroke-linecap="round"/>
    <path d="M900 170 L940 330" stroke="#1f2937" stroke-width="12"/>
    ${[290, 480, 860].map((x) => `<circle cx="${x}" cy="600" r="50" fill="#1f2937"/><circle cx="${x}" cy="600" r="20" fill="#9ca3af"/>`).join('')}`,
}

/** Fotoğrafları bir kez üretir (.cache/photos/*.png); hafif eğik ufuk ve lens kararmasıyla "telefon fotoğrafı". */
export const makePhotos = async (browser) => {
  const files = {}
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  for (const [name, body] of Object.entries(PHOTOS)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><g transform="rotate(-1.5 600 450)">${body}</g>
      <rect width="1200" height="900" fill="url(#v)"/><defs><radialGradient id="v"><stop offset="0.6" stop-opacity="0"/><stop offset="1" stop-opacity="0.35"/></radialGradient></defs></svg>`
    await page.setContent(`<body style="margin:0">${svg}</body>`)
    files[name] = join(CACHE, `photo-${name}.png`)
    await page.screenshot({ path: files[name] })
  }
  await page.close()
  return files
}

/** Şefin sesli notu: kadın sesi (Emel), kısa ve doğal; mp3 olarak. */
export const makeVoiceNote = () => {
  const target = join(CACHE, 'voice-note.mp3')
  if (!existsSync(target)) {
    execFileSync(join(CACHE, '..', '.venv', 'Scripts', 'edge-tts.exe'), ['--voice', 'tr-TR-EmelNeural', '--text',
      'Pompa on buçukta geliyor, kalıpçılar hazır. Döküm öğleden sonra.', '--write-media', target])
  }
  return target
}
