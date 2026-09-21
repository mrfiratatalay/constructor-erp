/** Uygulamanın hangi kabukla açılacağı: telefonda Vant, bilgisayarda Element Plus. */
export type Platform = 'mobile' | 'desktop'

export interface ScreenInfo {
  /** Telefon genişliği (≤ 768px). */
  isNarrow: boolean
  /** Dokunmatik ve ≤ 1024px: tablet ya da yan çevrilmiş telefon. */
  isTouchTablet: boolean
}

/**
 * Kullanıcının kayıtlı tercihi her zaman kazanır; yoksa ekrana bakılır.
 * Saf fonksiyon: tarayıcıya dokunmaz, bu yüzden tek başına test edilebilir.
 */
export function choosePlatform(saved: Platform | null, screen: ScreenInfo): Platform {
  if (saved) return saved
  return screen.isNarrow || screen.isTouchTablet ? 'mobile' : 'desktop'
}
