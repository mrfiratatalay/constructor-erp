import { LAPTOP, laptopPoint } from './Laptop'
import type { Place } from './motion'
import { phonePoint } from './Phone'
import { STAGE } from '../theme'

/** Soldaki sözün sağ kenarı: telefona yaklaşırken telefonun sol kenarı bunun sağında kalır. */
const CAPTION_EDGE = 1110

/**
 * Telefonda dokunulan yere yaklaşmak: uygulamanın appY yüksekliği ekranın ortasına gelir, telefon sağda durur.
 * 1,5 kat yakınlıkta uygulamanın yazısı 1080p'de ~23 piksele çıkar: telefondan izleyen de okur.
 */
export function followPhone(place: Place, appY: number, scale: number): Place {
  const left = phonePoint(place, { x: 0, y: appY })
  return { x: left.x - (CAPTION_EDGE - STAGE.width / 2) / scale, y: left.y, scale }
}

/**
 * Laptop ekranında bir noktaya yaklaşmak. Ekranın kenarına yaslı yerlerde (sağdan açılan panel, sağ üstteki düğme,
 * akışın en altındaki satır) kamera ekranın kenarını aşmaz: yoksa ekranın dışındaki çerçeve ve zemin görünür.
 * Yalnızca yan kenarlar ve alt kenar sınırlanır; üstte başlığı biraz aşmak sorun değildir.
 */
export function focusLaptop(place: Place, point: { x: number; y: number }, scale: number): Place {
  const halfWidth = STAGE.width / (2 * scale * place.scale)
  const halfHeight = STAGE.height / (2 * scale * place.scale)
  const x = Math.min(Math.max(point.x, halfWidth), LAPTOP.app.width - halfWidth)
  const y = Math.min(point.y, LAPTOP.app.height - halfHeight)
  return { ...laptopPoint(place, { x, y }), scale }
}
