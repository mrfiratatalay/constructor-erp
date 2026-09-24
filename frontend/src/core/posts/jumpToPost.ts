import { nextTick } from 'vue'

/** Mesaj bu kadar sayfa geride değilse aranmaz: çok eski mesaj için akış sonsuza kadar yüklenmesin. */
const MAX_PAGES = 15
const FLASH_MS = 1600

/** Akıştaki bir mesajın öğe kimliği: baloncuk bu kimlikle çizilir, atlamalar onu bulur. */
export const postElementId = (postId: string) => `post-${postId}`

interface FeedPages {
  isLoaded: () => boolean
  hasMore: () => boolean
  loadMore: () => Promise<unknown>
}

/**
 * Mesaja git (arama sonucu, alıntı ya da sabit mesaj): mesaj henüz yüklenmediyse geçmiş sayfalar yüklenir,
 * sonra mesaj ekranın ortasına getirilip kısa süre vurgulanır (WhatsApp'taki gibi). Bulunamazsa false döner.
 */
export async function jumpToPost(postId: string, feed: FeedPages): Promise<boolean> {
  for (let page = 0; page < MAX_PAGES && !feed.isLoaded() && feed.hasMore(); page++) {
    await feed.loadMore()
    await nextTick()
  }
  await nextTick()
  const element = document.getElementById(postElementId(postId))
  if (!element) return false
  element.scrollIntoView({ block: 'center', behavior: 'smooth' })
  element.classList.add('bubble--flash')
  setTimeout(() => element.classList.remove('bubble--flash'), FLASH_MS)
  return true
}
