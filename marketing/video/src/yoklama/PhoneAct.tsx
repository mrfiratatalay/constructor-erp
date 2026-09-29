import { useCurrentFrame } from 'remotion'
import { DeviceTag } from '../kit/DeviceTag'
import { Finger } from '../kit/Finger'
import { placeAt } from '../kit/motion'
import { PHONE, Phone, PHONE_SIZE } from '../kit/Phone'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { PHONE_CONTENT, shots, tapOf } from './shots'
import { PHONE_POSES, PHONE_SCROLLS, PHONE_TAPS, SHEET } from './timeline'

const screen = shots.screen
const { picks } = PHONE_TAPS

/** Şefin telefonunda sırayla görünenler; her geçiş çekimin gerçek sırasıdır. */
const SHOTS: Shot[] = [
  { at: 0, screen: screen('phone-start') },
  { at: SHEET.close, screen: screen('phone-one-marked') },
  { at: PHONE_TAPS.select + 3, screen: screen('phone-select-mode'), enter: { kind: 'fade', frames: 6 } },
  {
    at: PHONE_SCROLLS.toList,
    screen: screen('phone-select-list'),
    enter: { kind: 'scroll', frames: 26, strip: screen('phone-strip-select'), top: PHONE_CONTENT.top, bottom: PHONE_CONTENT.aboveBar },
  },
  ...picks.map((at, index) => ({ at: at + 2, screen: screen(`phone-picked-${index + 1}`) })),
  {
    at: PHONE_SCROLLS.toEnd,
    screen: screen('phone-picked-all'),
    enter: { kind: 'scroll', frames: 28, strip: screen('phone-strip-picked'), top: PHONE_CONTENT.top, bottom: PHONE_CONTENT.aboveBar },
  },
  { at: PHONE_TAPS.present + 3, screen: screen('phone-marked-bottom'), enter: { kind: 'wipe', frames: 16 } },
  {
    at: PHONE_SCROLLS.toTop,
    screen: screen('phone-done'),
    enter: { kind: 'scroll', frames: 32, strip: screen('phone-strip-done'), top: PHONE_CONTENT.top, bottom: PHONE_CONTENT.aboveTabbar },
  },
]

const TAPS = [
  tapOf('phone-tap-row', PHONE_TAPS.row),
  tapOf('phone-tap-absent', PHONE_TAPS.absent),
  tapOf('phone-tap-select', PHONE_TAPS.select),
  ...picks.map((at, index) => tapOf(`phone-tap-pick-${index + 1}`, at)),
  tapOf('phone-tap-present', PHONE_TAPS.present),
]

export const PhoneAct: React.FC = () => {
  const frame = useCurrentFrame()
  const first = PHONE_POSES[0].at
  const last = PHONE_POSES[PHONE_POSES.length - 1].at
  if (frame < first || frame > last) return null
  const place = placeAt(frame, PHONE_POSES)
  const top = { x: place.x, y: place.y - (PHONE_SIZE.height / 2) * place.scale - 22 }
  return (
    <>
      <Phone place={place} clock="08:14">
        <ScreenTrack shots={SHOTS} />
        <SlideLayer layer={shots.layer('phone-sheet-layer')} from="bottom" frames={SHEET} app={PHONE.app} dim={0.7} />
        <Finger taps={TAPS} />
      </Phone>
      <DeviceTag at={top} text="Şef · sahada" frames={{ from: 104, to: 440 }} />
    </>
  )
}
