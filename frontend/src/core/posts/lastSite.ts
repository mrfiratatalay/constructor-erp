const STORAGE_KEY = 'santiye.lastSite'

/** Birden çok şantiyeye bakan kişi için son gönderdiği şantiye seçili gelir. */
export function readLastSite(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function rememberLastSite(siteId: string) {
  try {
    localStorage.setItem(STORAGE_KEY, siteId)
  } catch {
    // Kaydedilemezse bir dahaki sefere şantiye yine seçilir; engellemeye değmez.
  }
}
