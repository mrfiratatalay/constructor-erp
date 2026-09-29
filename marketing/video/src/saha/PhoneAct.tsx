import { useCurrentFrame } from 'remotion'
import { DeviceTag } from '../kit/DeviceTag'
import { Finger } from '../kit/Finger'
import { placeAt } from '../kit/motion'
import { PHONE, Phone, PHONE_SIZE } from '../kit/Phone'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { Spotlight } from '../kit/Spotlight'
import { shots, tapOf } from './shots'
import { FINALE, ISSUE_ROW, MENU, PHONE_POSES, PHONE_REPLY, PHONE_TAG, PHONE_TAPS, PHONE_TYPING } from './timeline'

const screen = shots.screen

/** Şefin telefonu: Saha, sorun çubuğu, cümle öbek öbek, gönderince sarı satır; kapanışta Sohbet'te patronun cevabı. */
const SHOTS: Shot[] = [
  { at: 0, screen: screen('phone-saha') },
  { at: PHONE_TAPS.issue + 3, screen: screen('phone-issue'), enter: { kind: 'fade', frames: 6 } },
  ...PHONE_TYPING.map((at, index) => ({ at, screen: screen(`phone-typed-${index + 1}`) })),
  { at: PHONE_TAPS.send + 3, screen: screen('phone-sent'), enter: { kind: 'fade', frames: 6 } },
  { at: FINALE, screen: screen('phone-chat') },
]

const TAPS = [
  tapOf('phone-tap-plus', PHONE_TAPS.plus),
  tapOf('phone-tap-issue', PHONE_TAPS.issue),
  tapOf('phone-tap-text', PHONE_TAPS.text),
  tapOf('phone-tap-send', PHONE_TAPS.send),
]

export const PhoneAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < PHONE_POSES[0].at) return null
  const place = placeAt(frame, PHONE_POSES)
  const top = { x: place.x, y: place.y - (PHONE_SIZE.height / 2) * place.scale - 22 }
  return (
    <>
      <Phone place={place} clock={frame < FINALE ? '14:20' : '14:26'}>
        <ScreenTrack shots={SHOTS} />
        <SlideLayer layer={shots.layer('phone-menu-layer')} from="bottom" frames={MENU} app={PHONE.app} dim={0.7} />
        <Spotlight box={shots.box('phone-issue-row')} frames={ISSUE_ROW} />
        <Spotlight box={shots.box('phone-reply')} frames={PHONE_REPLY} />
        <Finger taps={TAPS} />
      </Phone>
      <DeviceTag at={top} text="Şef · sahada" frames={PHONE_TAG} />
    </>
  )
}
