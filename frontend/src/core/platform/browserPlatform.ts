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
    isNarrow: window.matchMedia('(max-width: 768px)').matches,
    isTouchTablet: window.matchMedia('(pointer: coarse) and (max-width: 1024px)').matches,
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
