// Ürünün yazı tipi (Plus Jakarta Sans): render başlamadan yüklenir, ilk karede de doğru font görünür.
import { continueRender, delayRender, staticFile } from 'remotion'

const FILES = ['plus-jakarta-sans-latin-wght-normal.woff2', 'plus-jakarta-sans-latin-ext-wght-normal.woff2']

let loaded = false
export function loadFonts() {
  if (loaded) return
  loaded = true
  const handle = delayRender('font')
  const faces = FILES.map((file) => new FontFace('Plus Jakarta Sans Variable', `url(${staticFile(`fonts/${file}`)}) format('woff2')`, { weight: '200 800' }))
  Promise.all(faces.map((face) => face.load())).then((ready) => {
    ready.forEach((face) => (document.fonts as unknown as { add: (f: FontFace) => void }).add(face))
    continueRender(handle)
  })
}
