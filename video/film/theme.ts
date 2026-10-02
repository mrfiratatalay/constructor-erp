// Filmin görsel dili ürünün kendi tasarım token'larından gelir (frontend/src/shared/styles/tokens.css, marketing.css):
// lacivert zemin, baret sarısı vurgu, beton grisi metin. Yeni bir marka dili icat edilmez.
export const COLOR = {
  deep: '#172554',
  night: '#101e3b',
  ink: '#0b1430',
  primary: '#1e40af',
  signature: '#facc15',
  text: '#141a2e',
  muted: '#5b6577',
  canvas: '#f4f6fa',
  line: 'rgba(255,255,255,0.07)',
  white: '#ffffff',
}

export const FONT = "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif"
export const FPS = 30
export const sec = (seconds: number) => Math.round(seconds * FPS)
