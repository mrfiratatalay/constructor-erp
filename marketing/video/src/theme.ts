/**
 * Uygulamanın tasarım sisteminden (frontend/src/shared/styles/tokens.css): video ile uygulama aynı markadan
 * çıkmış görünsün. Lacivert ana renk, baret sarısı imza (yalnızca koyu zeminde), durum renkleri yalnızca durum için.
 */
export const COLOR = {
  deep: '#172554',
  primary: '#1e40af',
  signature: '#facc15',
  white: '#ffffff',
  canvas: '#f4f6fa',
  ink: '#141a2e',
  success: '#166534',
  successBright: '#2f9e5b',
  device: '#0c1120',
} as const

export const FONT = "'Plus Jakarta Sans Variable', system-ui, sans-serif"

export const STAGE = { width: 1920, height: 1080, fps: 30 } as const
