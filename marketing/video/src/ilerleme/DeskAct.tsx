import { useCurrentFrame } from 'remotion'
import { Cursor } from '../kit/Cursor'
import { DeviceTag } from '../kit/DeviceTag'
import { LAPTOP, Laptop, LAPTOP_SIZE } from '../kit/Laptop'
import { placeAt } from '../kit/motion'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { Spotlight } from '../kit/Spotlight'
import { shots, tapOf } from './shots'
import { BODRUM_ROW, DEMIR_ROW, DESK_CLICKS, DRAWER, LAPTOP_POSES, LAPTOP_TAG, NOTE } from './timeline'

/** Patronun ekranı: İlerleme panosu, Geciken süzgeci, Bodrum Tesisatı'nın gün gün geçmişi. */
const SHOTS: Shot[] = [
  { at: 0, screen: shots.screen('desk-board') },
  { at: DESK_CLICKS.delayed + 3, screen: shots.screen('desk-delayed'), enter: { kind: 'fade', frames: 6 } },
  { at: DRAWER.settled, screen: shots.screen('desk-detail') },
]

const CLICKS = [tapOf('desk-tap-delayed', DESK_CLICKS.delayed), tapOf('desk-tap-detail', DESK_CLICKS.detail)]

export const DeskAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < LAPTOP_POSES[0].at) return null
  const place = placeAt(frame, LAPTOP_POSES)
  const top = { x: place.x, y: place.y - (LAPTOP_SIZE.height / 2) * place.scale - 18 }
  return (
    <>
      <Laptop place={place}>
        <ScreenTrack shots={SHOTS} />
        <Spotlight box={shots.box('desk-demir-row')} frames={DEMIR_ROW} />
        <Spotlight box={shots.box('desk-bodrum-row')} frames={BODRUM_ROW} />
        <SlideLayer layer={shots.layer('desk-detail-layer')} from="right" frames={{ open: DRAWER.open, cut: DRAWER.settled }}
          app={LAPTOP.app} dim={0.5} />
        <Spotlight box={shots.box('desk-delay-note')} frames={NOTE} />
        <Cursor clicks={CLICKS} />
      </Laptop>
      <DeviceTag at={top} text="Patron · ofiste" frames={LAPTOP_TAG} />
    </>
  )
}
