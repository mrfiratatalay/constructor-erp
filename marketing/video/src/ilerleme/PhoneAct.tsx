import { useCurrentFrame } from 'remotion'
import { DeviceTag } from '../kit/DeviceTag'
import { Finger } from '../kit/Finger'
import { placeAt } from '../kit/motion'
import { PHONE, Phone, PHONE_SIZE } from '../kit/Phone'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { Spotlight } from '../kit/Spotlight'
import { SHEET_CONTENT, shots, tapOf } from './shots'
import { CARD_PULSE, NOTICE, PHONE_POSES, PHONE_TAG, PHONE_TAPS, QUANTITY_KEYS, SHEET, WORKER_KEYS } from './timeline'

const screen = shots.screen
const { save } = PHONE_TAPS

/**
 * Şefin telefonunda sırayla görünenler. Pencere kayarak açılır, açıldıktan sonra altındaki ekran da odur; rakamlar
 * yazıldıkça ekran değişir, sonra pencerenin içi Kaydet'e kayar. Kaydedince pencere iner, altında kart güncellenmiştir.
 */
const SHOTS: Shot[] = [
  { at: 0, screen: screen('phone-feed') },
  { at: PHONE_TAPS.tab + 3, screen: screen('phone-board'), enter: { kind: 'fade', frames: 6 } },
  { at: SHEET.settled, screen: screen('phone-sheet') },
  ...QUANTITY_KEYS.map((at, index) => ({ at, screen: screen(`phone-quantity-${index + 1}`) })),
  ...WORKER_KEYS.map((at, index) => ({ at, screen: screen(`phone-workers-${index + 1}`) })),
  { at: SHEET.glide, screen: screen('phone-sheet-bottom'), enter: { kind: 'scroll', frames: 12, ...SHEET_CONTENT } },
  { at: save + 2, screen: screen('phone-saved') },
]

const TAPS = [
  tapOf('phone-tap-tab', PHONE_TAPS.tab),
  tapOf('phone-tap-update', PHONE_TAPS.update),
  tapOf('phone-tap-quantity', PHONE_TAPS.quantity),
  tapOf('phone-tap-workers', PHONE_TAPS.workers),
  tapOf('phone-tap-save', save),
]

export const PhoneAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < PHONE_POSES[0].at) return null
  const place = placeAt(frame, PHONE_POSES)
  const top = { x: place.x, y: place.y - (PHONE_SIZE.height / 2) * place.scale - 22 }
  return (
    <>
      <Phone place={place} clock="17:38">
        <ScreenTrack shots={SHOTS} />
        <SlideLayer layer={shots.layer('phone-sheet-layer')} from="bottom" frames={{ open: SHEET.open, cut: SHEET.settled }}
          app={PHONE.app} dim={0.7} />
        <SlideLayer layer={shots.layer('phone-sheet-bottom-layer')} from="bottom"
          frames={{ open: save + 2, close: save + 2, instant: true }} app={PHONE.app} dim={0.7} />
        <Spotlight box={shots.box('phone-saved-card')} frames={{ from: CARD_PULSE, to: 430 }} />
        <SlideLayer layer={shots.layer('phone-notify-layer')} from="top" frames={NOTICE} app={PHONE.app} dim={0} />
        <Finger taps={TAPS} />
      </Phone>
      <DeviceTag at={top} text="Şef · sahada" frames={PHONE_TAG} />
    </>
  )
}
