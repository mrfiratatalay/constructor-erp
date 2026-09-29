import { useCurrentFrame } from 'remotion'
import { DeviceTag } from '../kit/DeviceTag'
import { Finger } from '../kit/Finger'
import { placeAt } from '../kit/motion'
import { PHONE, Phone, PHONE_SIZE } from '../kit/Phone'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { FORM_CONTENT, layerOf, screenOf, shots, tapOf } from './shots'
import { FORM, PHONE_POSES, PHONE_TAG, PHONE_TAPS, PICKERS } from './timeline'

const screen = shots.screen
const [first, second] = PHONE_TAPS.lines
const formLayer = shots.layer('phone-form-layer')
const pickerLayer = shots.layer('phone-picker-layer')

/**
 * Depocunun telefonunda sırayla görünenler. Tam ekran form kayarak açılır, açıldıktan sonra altındaki ekran da
 * odur; malzeme seçici formun üstünden gelip gider, altında form bir sonraki hâline geçmiş olur.
 */
const SHOTS: Shot[] = [
  { at: 0, screen: screen('phone-start') },
  { at: FORM.settled, screen: screenOf(formLayer) },
  { at: PHONE_TAPS.site + 2, screen: screen('phone-target') },
  { at: first.material, screen: screen('phone-line-1-picked') },
  ...first.digits.map((at, index) => ({ at, screen: screen(`phone-line-1-typed-${index + 1}`) })),
  { at: PHONE_TAPS.add + 2, screen: screen('phone-added') },
  { at: second.material, screen: screen('phone-line-2-picked') },
  ...second.digits.map((at, index) => ({ at, screen: screen(`phone-line-2-typed-${index + 1}`) })),
  { at: FORM.glide, screen: screen('phone-form-bottom'), enter: { kind: 'scroll', frames: 16, ...FORM_CONTENT } },
  { at: PHONE_TAPS.photo + 3, screen: screen('phone-photo'), enter: { kind: 'fade', frames: 6 } },
  { at: PHONE_TAPS.send, screen: screen('phone-saved') },
]

const TAPS = [
  tapOf('phone-tap-new', PHONE_TAPS.create),
  tapOf('phone-tap-site', PHONE_TAPS.site),
  ...PHONE_TAPS.lines.flatMap((line, index) => [
    tapOf(`phone-line-${index + 1}-tap-pick`, line.pick),
    tapOf(`phone-line-${index + 1}-tap-material`, line.material),
    tapOf(`phone-line-${index + 1}-tap-quantity`, line.quantity),
  ]),
  tapOf('phone-tap-add', PHONE_TAPS.add),
  tapOf('phone-tap-photo', PHONE_TAPS.photo),
  tapOf('phone-tap-send', PHONE_TAPS.send),
].sort((a, b) => a.at - b.at)

export const PhoneAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < PHONE_POSES[0].at || frame > PHONE_POSES[PHONE_POSES.length - 1].at) return null
  const place = placeAt(frame, PHONE_POSES)
  const top = { x: place.x, y: place.y - (PHONE_SIZE.height / 2) * place.scale - 22 }
  return (
    <>
      <Phone place={place} clock="09:32">
        <ScreenTrack shots={SHOTS} />
        <SlideLayer layer={formLayer} from="bottom" frames={{ open: FORM.open, cut: FORM.settled }} app={PHONE.app} dim={0} />
        {PICKERS.map((frames) => (
          <SlideLayer key={frames.open} layer={pickerLayer} from="bottom" frames={frames} app={PHONE.app} dim={0} />
        ))}
        <SlideLayer
          layer={layerOf(screen('phone-photo'))}
          from="bottom"
          frames={{ open: PHONE_TAPS.send, close: PHONE_TAPS.send + 2, instant: true }}
          app={PHONE.app}
          dim={0}
        />
        <Finger taps={TAPS} />
      </Phone>
      <DeviceTag at={top} text="Depocu · depoda" frames={PHONE_TAG} />
    </>
  )
}
