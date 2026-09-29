import { useCurrentFrame } from 'remotion'
import { DeviceTag } from '../kit/DeviceTag'
import { Finger } from '../kit/Finger'
import { LockScreen } from '../kit/LockScreen'
import { placeAt, progress } from '../kit/motion'
import { Phone, PHONE_SIZE } from '../kit/Phone'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { CAPTURE_DAY, LINK_TEXT, shots, tapOf } from './shots'
import { NAME_KEYS, NOTICE, PHONE_KEYS, WORKER_POSES, WORKER_SCREENS, WORKER_TAPS } from './timeline'

const screen = shots.screen

/** Ustanın telefonunda, bildirime dokunduktan sonra: katılma sayfası, ad harf harf, numara, şantiyeler, Kartal. */
const SHOTS: Shot[] = [
  { at: WORKER_SCREENS.join, screen: screen('worker-join') },
  ...NAME_KEYS.map((at, index) => ({ at, screen: screen(`worker-name-${index + 1}`) })),
  ...PHONE_KEYS.map((at, index) => ({ at, screen: screen(`worker-phone-${index + 1}`) })),
  { at: WORKER_SCREENS.sites, screen: screen('worker-sites'), enter: { kind: 'fade', frames: 6 } },
  { at: WORKER_SCREENS.feed, screen: screen('worker-feed'), enter: { kind: 'fade', frames: 6 } },
]

const TAPS = [
  { at: WORKER_TAPS.notice, x: 196, y: 290 },
  tapOf('worker-tap-name', WORKER_TAPS.name),
  tapOf('worker-tap-phone', WORKER_TAPS.phone),
  tapOf('worker-tap-join', WORKER_TAPS.join),
  tapOf('worker-tap-site', WORKER_TAPS.site),
]

const NOTICE_TEXT = { at: NOTICE, from: 'Patron', text: "Kızılkan Yapı'nın ekibine katıl:", link: `https://${LINK_TEXT}` }

/** Yeni ustanın telefonu: önce kilit ekranı ve gelen bağlantı; dokununca uygulama açılır. */
export const WorkerAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < WORKER_POSES[0].at) return null
  const place = placeAt(frame, WORKER_POSES)
  const top = { x: place.x, y: place.y - (PHONE_SIZE.height / 2) * place.scale - 22 }
  const opening = progress(frame, WORKER_SCREENS.join, WORKER_SCREENS.join + 6)
  return (
    <>
      <Phone place={place} clock="09:05">
        {opening < 1 && <LockScreen time="09:05" day={CAPTURE_DAY} notice={NOTICE_TEXT} />}
        {opening > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: opening }}>
            <ScreenTrack shots={SHOTS} />
          </div>
        )}
        <Finger taps={TAPS} />
      </Phone>
      <DeviceTag at={top} text="Usta · şantiyede" frames={{ from: 262, to: 294 }} />
    </>
  )
}
