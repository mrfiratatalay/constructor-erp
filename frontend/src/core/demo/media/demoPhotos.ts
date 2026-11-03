import alci from './alci.jpg'
import alciKucuk from './alci-kucuk.jpg'
import alciKoridor from './alci-koridor.jpg'
import alciKoridorKucuk from './alci-koridor-kucuk.jpg'
import demirKamyon from './demir-kamyon.jpg'
import demirKamyonKucuk from './demir-kamyon-kucuk.jpg'
import demirTeslim from './demir-teslim.jpg'
import demirTeslimKucuk from './demir-teslim-kucuk.jpg'
import kasustu from './kasustu.jpg'
import kasustuKucuk from './kasustu-kucuk.jpg'
import kasustuDoseme from './kasustu-doseme.jpg'
import kasustuDosemeKucuk from './kasustu-doseme-kucuk.jpg'
import kolonDonati from './kolon-donati.jpg'
import kolonDonatiKucuk from './kolon-donati-kucuk.jpg'
import kolonKaliplari from './kolon-kaliplari.jpg'
import kolonKaliplariKucuk from './kolon-kaliplari-kucuk.jpg'
import sahil from './sahil.jpg'
import sahilKucuk from './sahil-kucuk.jpg'
import sahilCati from './sahil-cati.jpg'
import sahilCatiKucuk from './sahil-cati-kucuk.jpg'
import yomra from './yomra.jpg'
import yomraKucuk from './yomra-kucuk.jpg'
import yomraIskele from './yomra-iskele.jpg'
import yomraIskeleKucuk from './yomra-iskele-kucuk.jpg'

/**
 * Demo fotoğrafları. Gerçek bir şantiyenin fotoğrafı değil, reklam filmi için kodla kurulmuş üç boyutlu sahnelerden
 * (three.js) çekildi: telif sorunu yok, kimsenin yüzü ya da adresi yok. Her birinin küçüğü listeler ve albümler için.
 */
export const PHOTOS = {
  yomra: { url: yomra, thumbnailUrl: yomraKucuk },
  yomraIskele: { url: yomraIskele, thumbnailUrl: yomraIskeleKucuk },
  kasustu: { url: kasustu, thumbnailUrl: kasustuKucuk },
  kasustuDoseme: { url: kasustuDoseme, thumbnailUrl: kasustuDosemeKucuk },
  sahil: { url: sahil, thumbnailUrl: sahilKucuk },
  sahilCati: { url: sahilCati, thumbnailUrl: sahilCatiKucuk },
  kolonKaliplari: { url: kolonKaliplari, thumbnailUrl: kolonKaliplariKucuk },
  kolonDonati: { url: kolonDonati, thumbnailUrl: kolonDonatiKucuk },
  demirTeslim: { url: demirTeslim, thumbnailUrl: demirTeslimKucuk },
  demirKamyon: { url: demirKamyon, thumbnailUrl: demirKamyonKucuk },
  alci: { url: alci, thumbnailUrl: alciKucuk },
  alciKoridor: { url: alciKoridor, thumbnailUrl: alciKoridorKucuk },
} as const

export type PhotoName = keyof typeof PHOTOS
