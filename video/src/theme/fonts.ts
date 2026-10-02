import { loadFont } from '@remotion/fonts'
import jakartaLatin from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'
import jakartaLatinExt from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-ext-wght-normal.woff2'
import caveatLatin from '@fontsource/caveat/files/caveat-latin-400-normal.woff2'
import caveatLatinExt from '@fontsource/caveat/files/caveat-latin-ext-400-normal.woff2'
import caveatBoldLatin from '@fontsource/caveat/files/caveat-latin-700-normal.woff2'
import caveatBoldLatinExt from '@fontsource/caveat/files/caveat-latin-ext-700-normal.woff2'

/** Ürünün yazı tipi (tokens.css --font-sans): bütün arayüz ve film yazıları. */
export const SANS = "'Plus Jakarta Sans', system-ui, sans-serif"
/** Kâğıda elle yazılmış notlar ("önceki dünya" sahnesi). */
export const HAND = "'Caveat', cursive"

// Türkçe harfler (ş, ğ, İ) latin-ext parçasındadır; ikisi yüklenmezse "İskele" yedek yazı tipiyle çıkar.
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212'
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+20A0-20AB,U+2C60-2C7F'

const faces = [
  { family: 'Plus Jakarta Sans', url: jakartaLatin, weight: '200 800', unicodeRange: LATIN },
  { family: 'Plus Jakarta Sans', url: jakartaLatinExt, weight: '200 800', unicodeRange: LATIN_EXT },
  { family: 'Caveat', url: caveatLatin, weight: '400', unicodeRange: LATIN },
  { family: 'Caveat', url: caveatLatinExt, weight: '400', unicodeRange: LATIN_EXT },
  { family: 'Caveat', url: caveatBoldLatin, weight: '700', unicodeRange: LATIN },
  { family: 'Caveat', url: caveatBoldLatinExt, weight: '700', unicodeRange: LATIN_EXT },
]

export const loadFilmFonts = (): void => {
  for (const face of faces) {
    void loadFont({ ...face, format: 'woff2' })
  }
}
