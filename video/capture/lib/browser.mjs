// Çekim tarayıcısı: sabit pencere, yüksek çözünürlük (2x), marka değişimi, temiz ekran.
import { chromium } from 'playwright'

export const WEB = process.env.VIDEO_WEB ?? 'http://localhost:5190'
export const DESKTOP = { width: 1440, height: 900 }
export const PHONE = { width: 390, height: 844 }

/**
 * Ürünün bazı metinlerinde eski ad ("Constructor ERP") duruyor. Ürün koduna dokunmadan, yalnızca çekim
 * katmanında metin düğümleri "İskele ERP" yapılır. Vue sayfayı sonradan çizdiği için değişim her DOM
 * değişikliğinde tekrarlanır. Logodaki "Constructor <b>ERP</b>" iki ayrı düğümdür: tek kelime de değişir.
 */
const brandSwap = () => {
  const swap = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue
      if (text && text.includes('Constructor')) node.nodeValue = text.replace(/Constructor/g, 'İskele')
    }
    if (document.title.includes('Constructor')) document.title = document.title.replace(/Constructor/g, 'İskele')
  }
  const start = () => {
    swap()
    new MutationObserver(swap).observe(document.body, { subtree: true, childList: true, characterData: true })
  }
  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start)
}

/** Kaydırma çubuğu, yanıp sönen imleç ve odak halkası karelerde görünmesin. */
const CLEAN_CSS = `
  ::-webkit-scrollbar { display: none !important; }
  * { scrollbar-width: none !important; caret-color: transparent !important; }
`

export const openBrowser = async () => chromium.launch({ headless: true })

/** Masaüstü ya da telefon bağlamı: 2x (telefonda 3x) piksel yoğunluğu, Türkçe, İstanbul saati. */
export const openContext = async (browser, device = 'desktop') => {
  const phone = device === 'phone'
  const context = await browser.newContext({
    viewport: phone ? PHONE : DESKTOP,
    deviceScaleFactor: phone ? 3 : 2,
    isMobile: phone,
    hasTouch: phone,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    userAgent: phone
      ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36'
      : undefined,
  })
  await context.addInitScript(brandSwap)
  await context.addInitScript((css) => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style')
      style.textContent = css
      document.head.appendChild(style)
    })
  }, CLEAN_CSS)
  return context
}
