/**
 * Filmin renkleri ürünün kendi token'larından gelir (frontend/src/shared/styles/tokens.css, marketing.css).
 * Kural ürünle aynı: baret sarısı yalnızca koyu zeminde, imza olarak.
 */
export const brand = {
  deep: '#172554', // --brand-deep: koyu alanlar
  night: '#101e3b', // --mk-dark: tanıtım sitesinin hero zemini
  primary: '#1e40af', // --brand-primary
  signature: '#facc15', // --brand-signature: baret sarısı
  signatureSoft: '#fde047', // hero butonunun üzerine gelinmiş hâli
  onDeep: '#ffffff',
  tint: '#eaeffb',
} as const

export const ink = {
  strong: '#141a2e',
  muted: '#5b6577',
  subtle: '#8a93a5',
  paper: '#f7f9fc',
} as const

/** "Önceki dünya" sahnesinin ışığı: sabah güneşi, sıcak vurgular, soğuk gölgeler. */
export const dawn = {
  skyTop: '#8fa6c4',
  skyMid: '#d9c4b0',
  horizon: '#f7d6ac',
  sun: '#fff1d6',
  haze: '#f3dcc0',
  far: '#9aa6b8',
  mid: '#6f7d94',
  near: '#46536b',
  room: '#141a2a',
  roomWarm: '#2a2420',
  rim: '#ffcf8a',
} as const
