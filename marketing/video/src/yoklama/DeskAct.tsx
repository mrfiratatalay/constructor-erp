import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { Cursor } from '../kit/Cursor'
import { DeviceTag } from '../kit/DeviceTag'
import { LAPTOP, Laptop, LAPTOP_SIZE } from '../kit/Laptop'
import { placeAt } from '../kit/motion'
import { RevealWipe } from '../kit/RevealWipe'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { shots, tapOf } from './shots'
import { CURSOR_REST, DESK_CLICKS, DRAWER, GRID_FILL, LAPTOP_POSES, LAPTOP_TAG } from './timeline'

const SHOTS: Shot[] = [
  { at: 0, screen: shots.screen('desk-today') },
  { at: DESK_CLICKS.puantaj + 2, screen: shots.screen('desk-month'), enter: { kind: 'fade', frames: 8 } },
]

const CLICKS = [
  tapOf('desk-tap-puantaj', DESK_CLICKS.puantaj),
  tapOf('desk-tap-cell', DESK_CLICKS.cell),
  { ...CURSOR_REST, press: false },
  tapOf('desk-tap-excel', DESK_CLICKS.excel),
]

/** Patronun dizüstü bilgisayarı: bugünün sonucu, ayın cetveli, bir kişinin günü, Excel. */
export const DeskAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < LAPTOP_POSES[0].at) return null
  const place = placeAt(frame, LAPTOP_POSES)
  const top = { x: place.x, y: place.y - (LAPTOP_SIZE.height / 2) * place.scale - 18 }
  return (
    <>
      <Laptop place={place}>
        <ScreenTrack shots={SHOTS} />
        {frame >= DESK_CLICKS.puantaj + 2 && (
          <RevealWipe box={shots.box('desk-days')} frames={GRID_FILL} cover={COLOR.white} />
        )}
        <SlideLayer layer={shots.layer('desk-drawer-layer')} from="right" frames={DRAWER} app={LAPTOP.app} dim={0.5} />
        <Cursor clicks={CLICKS} />
      </Laptop>
      <DeviceTag at={top} text="Patron · ofiste" frames={LAPTOP_TAG} />
    </>
  )
}
