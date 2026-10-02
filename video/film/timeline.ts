// Filmin bölümleri (saniye). Seslendirmenin zamanlaması audio/script.mjs'tedir; bölümler onun etrafında kurulur.
export const SECTIONS = {
  chaos: [0, 14.85],
  brand: [14.85, 24.6],
  landing: [24.6, 28.2],
  apply: [28.2, 30.5],
  admin: [30.5, 33.3],
  setup: [33.3, 38.7],
  sites: [38.7, 51.6],
  rollcall: [51.6, 56.6],
  puantaj: [56.6, 63.3],
  materials: [63.3, 74.6],
  production: [74.6, 85.2],
  tasks: [85.2, 94.0],
  devices: [94.0, 106.6],
  closing: [106.6, 120.0],
} as const

export type SectionName = keyof typeof SECTIONS
