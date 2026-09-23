/**
 * Ekran genişliği eşikleri, tek kaynak. CSS'e kırılım noktası yazılmaz: kabuk açılışta bu eşiklerle
 * seçilir, kabuğun içi ise tavanlı ve akışkan ölçülerle (tokens.css'teki --layout-*) her genişliğe uyar.
 */
export const BREAKPOINTS = {
  /** Bu genişliğe kadar her ekran telefondur. */
  phone: 768,
  /** Dokunmatik ekran bu genişliğe kadar tablettir; o da mobil kabukla açılır. */
  touchTablet: 1024,
  /** Masaüstü penceresi bundan darsa sol menü ikonlara iner: liste ve akışa yer kalır. */
  wideDesktop: 1200,
} as const

export const MEDIA_QUERIES = {
  phone: `(width <= ${BREAKPOINTS.phone}px)`,
  touchTablet: `(pointer: coarse) and (width <= ${BREAKPOINTS.touchTablet}px)`,
  compactDesktop: `(width < ${BREAKPOINTS.wideDesktop}px)`,
} as const
