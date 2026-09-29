import { useCurrentFrame } from 'remotion'
import { Cursor } from '../kit/Cursor'
import { DeviceTag } from '../kit/DeviceTag'
import { LAPTOP, Laptop, LAPTOP_SIZE } from '../kit/Laptop'
import { placeAt } from '../kit/motion'
import { ScreenTrack, type Shot } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { Spotlight } from '../kit/Spotlight'
import { shots, tapOf } from './shots'
import { DESK_CLICKS, DRAWER, LAPTOP_POSES, LAPTOP_TAG, NEW_ROW, TYPING } from './timeline'

/** Patronun ekranı: defter, harf harf arama, iadeden sonra güncellenen liste. */
const SHOTS: Shot[] = [
  { at: 0, screen: shots.screen('desk-start') },
  ...TYPING.map((at, index) => ({ at: at + 1, screen: shots.screen(`desk-search-${index + 1}`) })),
  { at: DESK_CLICKS.returned + 2, screen: shots.screen('desk-after') },
]

const CLICKS = [
  tapOf('desk-tap-search', DESK_CLICKS.search),
  tapOf('desk-tap-row', DESK_CLICKS.row),
  tapOf('desk-tap-return', DESK_CLICKS.returned),
  tapOf('desk-tap-excel', DESK_CLICKS.excel),
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
        <Spotlight box={shots.box('desk-new-row')} frames={NEW_ROW} />
        <SlideLayer
          layer={shots.layer('desk-drawer-layer')}
          swap={{ at: DESK_CLICKS.returned + 2, layer: shots.layer('desk-drawer-after-layer') }}
          from="right"
          frames={DRAWER}
          app={LAPTOP.app}
          dim={0.5}
        />
        <Cursor clicks={CLICKS} />
      </Laptop>
      <DeviceTag at={top} text="Patron · ofiste" frames={LAPTOP_TAG} />
    </>
  )
}
