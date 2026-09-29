import '@fontsource-variable/plus-jakarta-sans'
import { useEffect, useState } from 'react'
import { continueRender, delayRender } from 'remotion'

/**
 * Uygulamanın yazı tipi (Plus Jakarta Sans). Kare, yazı tipi yüklenmeden çizilmez: yoksa ilk karelerde yedek yazı
 * tipi görünür. Türkçe harfler ayrı bir alt küme dosyasındadır; onlar da istenir.
 */
export function useBrandFont() {
  const [handle] = useState(() => delayRender('Plus Jakarta Sans yükleniyor'))
  useEffect(() => {
    const weights = [600, 700, 800].map((weight) =>
      document.fonts.load(`${weight} 48px 'Plus Jakarta Sans Variable'`, 'Kızılkan Şantiye ğüşiöçİĞÜŞÖÇ'),
    )
    Promise.all(weights).then(() => continueRender(handle))
  }, [handle])
}
