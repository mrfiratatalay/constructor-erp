import { useCurrentFrame } from 'remotion'
import { Cursor } from '../kit/Cursor'
import { DeviceTag } from '../kit/DeviceTag'
import { Laptop, LAPTOP_SIZE } from '../kit/Laptop'
import { placeAt } from '../kit/motion'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { Spotlight } from '../kit/Spotlight'
import { shots, tapOf } from './shots'
import { DESK_CLICKS, DESK_ISSUE, DESK_TYPING, LAPTOP_POSES, LAPTOP_TAG, REPLY, REPLY_SENT, SITE_ROW } from './timeline'

/** Patronun ekranı: listede öne çıkan Kartal, Saha'daki sarı satır, Sohbet'te yazılan ve giden cevap. */
const SHOTS: Shot[] = [
  { at: 0, screen: shots.screen('desk-start') },
  { at: DESK_CLICKS.saha + 3, screen: shots.screen('desk-saha'), enter: { kind: 'fade', frames: 6 } },
  { at: DESK_CLICKS.chat + 3, screen: shots.screen('desk-chat'), enter: { kind: 'fade', frames: 6 } },
  ...DESK_TYPING.map((at, index) => ({ at, screen: shots.screen(`desk-typed-${index + 1}`) })),
  { at: REPLY_SENT, screen: shots.screen('desk-replied') },
]

const CLICKS = [
  tapOf('desk-tap-saha', DESK_CLICKS.saha),
  tapOf('desk-tap-chat', DESK_CLICKS.chat),
  tapOf('desk-tap-text', DESK_CLICKS.text),
]

export const DeskAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < LAPTOP_POSES[0].at) return null
  const place = placeAt(frame, LAPTOP_POSES)
  const top = { x: place.x, y: place.y - (LAPTOP_SIZE.height / 2) * place.scale - 18 }
  return (
    <>
      <Laptop place={place}>
        <ScreenTrack shots={SHOTS} />
        <Spotlight box={shots.box('desk-site-row')} frames={SITE_ROW} />
        <Spotlight box={shots.box('desk-issue-row')} frames={DESK_ISSUE} />
        <Spotlight box={shots.box('desk-reply')} frames={REPLY} />
        <Cursor clicks={CLICKS} />
      </Laptop>
      <DeviceTag at={top} text="Patron · ofiste" frames={LAPTOP_TAG} />
    </>
  )
}
