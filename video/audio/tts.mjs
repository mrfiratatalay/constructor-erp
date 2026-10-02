// Türkçe metinden konuşma (Google Çeviri'nin seslendirme ucu). Uç tek istekte ~200 karakter alır: metin cümle ve
// virgül sınırlarından bölünür, MP3 parçaları uç uca eklenir (MP3 çerçeveleri birleştirmeye dayanıklıdır).
const ENDPOINT = 'https://translate.googleapis.com/translate_tts'
const LIMIT = 190

function chunks(text) {
  const parts = text.match(/[^.,;:!?…]+[.,;:!?…]*\s*/g) ?? [text]
  const out = []
  let current = ''
  for (const part of parts) {
    if ((current + part).length > LIMIT && current) {
      out.push(current.trim())
      current = ''
    }
    current += part
  }
  if (current.trim()) out.push(current.trim())
  return out
}

async function fetchChunk(text, speed) {
  const params = new URLSearchParams({ client: 'gtx', ie: 'UTF-8', tl: 'tr', ttsspeed: String(speed), q: text })
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch(`${ENDPOINT}?${params}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (response.ok) return Buffer.from(await response.arrayBuffer())
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt))
  }
  throw new Error(`seslendirme alınamadı: ${text}`)
}

/** MP3 döner. speed: 1 normal; reklam okuması için tempo ayrıca rubberband ile ayarlanır (audio/voice.mjs). */
export async function speak(text, { speed = 1 } = {}) {
  const buffers = []
  for (const part of chunks(text)) buffers.push(await fetchChunk(part, speed))
  return Buffer.concat(buffers)
}
