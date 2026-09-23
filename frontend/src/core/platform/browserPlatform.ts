import { MEDIA_QUERIES } from './breakpoints'
import { choosePlatform, type Platform, type ScreenInfo } from './choosePlatform'

const STORAGE_KEY = 'santiye.platform'

function readSavedPlatform(): Platform | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'mobile' || value === 'desktop' ? value : null
  } catch {
    // Gizli sekme gibi durumlarda localStorage hata verebilir; tercih yokmuş gibi davranırız.
    return null
  }
}

function readScreenInfo(): ScreenInfo {
  return {
    isNarrow: window.matchMedia(MEDIA_QUERIES.phone).matches,
    isTouchTablet: window.matchMedia(MEDIA_QUERIES.touchTablet).matches,
  }
}

export function detectPlatform(): Platform {
  return choosePlatform(readSavedPlatform(), readScreenInfo())
}

/** Tercihi kaydeder ve sayfayı yeniler; yeni kabuğun kodu yalnızca o an indirilir. */
export function switchPlatform(target: Platform): void {
  try {
    localStorage.setItem(STORAGE_KEY, target)
  } catch {
    // Kaydedilemezse otomatik seçim devam eder; kullanıcıyı engellemeye değmez.
  }
  window.location.reload()
}
