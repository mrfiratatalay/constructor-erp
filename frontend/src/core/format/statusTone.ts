/** Anlam renkleri (tokens.css): hata, dikkat, tamam, nötr. Marka rengi durum için kullanılmaz. */
export type StatusTone = 'danger' | 'warning' | 'success' | 'neutral'

/**
 * Durum etiketinin tonları: anlam renkleri ve tek istisna "progress" (süren iş mavidir: imalatın "Devam ediyor"u,
 * Musa'nın kararı, TASARIM.md "İmalat"). Yalnızca etikette; uyarı şeritleri anlam renkleriyle kalır.
 */
export type TagTone = StatusTone | 'progress'
