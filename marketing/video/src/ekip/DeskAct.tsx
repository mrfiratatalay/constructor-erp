import { useCurrentFrame } from 'remotion'
import { Cursor } from '../kit/Cursor'
import { DeviceTag } from '../kit/DeviceTag'
import { Laptop, LAPTOP_SIZE } from '../kit/Laptop'
import { placeAt } from '../kit/motion'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { Spotlight } from '../kit/Spotlight'
import { shots, tapOf } from './shots'
import { DESK_CLICKS, JOINED_LINE, LAPTOP_POSES, NEW_ROW } from './timeline'

const SHOTS: Shot[] = [
  { at: 0, screen: shots.screen('desk-feed') },
  { at: DESK_CLICKS.roll + 3, screen: shots.screen('desk-roll'), enter: { kind: 'fade', frames: 8 } },
]

/** Patronun ekranı: Kartal'ın akışında "katıldı" satırı, sonra yoklamada kendiliğinden eklenmiş yeni usta. */
export const DeskAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < LAPTOP_POSES[0].at) return null
  const place = placeAt(frame, LAPTOP_POSES)
  const top = { x: place.x, y: place.y - (LAPTOP_SIZE.height / 2) * place.scale - 18 }
  return (
    <>
      <Laptop place={place}>
        <ScreenTrack shots={SHOTS} />
        <Spotlight box={shots.box('desk-joined-line')} frames={JOINED_LINE} />
        <Spotlight box={shots.box('desk-new-row')} frames={NEW_ROW} />
        <Cursor clicks={[tapOf('desk-tap-roll', DESK_CLICKS.roll)]} />
      </Laptop>
      <DeviceTag at={top} text="Patron · ofiste" frames={{ from: 476, to: 506 }} />
    </>
  )
}
