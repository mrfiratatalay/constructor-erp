import { useCurrentFrame } from 'remotion'
import { DeviceTag } from '../kit/DeviceTag'
import { Finger } from '../kit/Finger'
import { placeAt } from '../kit/motion'
import { PHONE, Phone, PHONE_SIZE } from '../kit/Phone'
import { ScreenImage } from '../kit/ScreenTrack'
import { SlideLayer } from '../kit/SlideLayer'
import { shots, tapOf } from './shots'
import { BOSS_LINK, BOSS_MENU, BOSS_POSES, BOSS_TAPS } from './timeline'

const TAPS = [
  tapOf('boss-tap-add', BOSS_TAPS.add),
  tapOf('boss-tap-people', BOSS_TAPS.people),
  tapOf('boss-tap-copy', BOSS_TAPS.copy),
]

/** Patronun telefonu: şantiyeler listesi, ＋ menüsü, firmanın bağlantısı; sonunda üç cihazlık kapanışta solda. */
export const BossAct: React.FC = () => {
  const frame = useCurrentFrame()
  if (frame < BOSS_POSES[0].at) return null
  const place = placeAt(frame, BOSS_POSES)
  const top = { x: place.x, y: place.y - (PHONE_SIZE.height / 2) * place.scale - 22 }
  return (
    <>
      <Phone place={place} clock="08:58">
        <ScreenImage screen={shots.screen('boss-start')} />
        <SlideLayer layer={shots.layer('boss-menu-layer')} from="bottom" frames={BOSS_MENU} app={PHONE.app} dim={0.7} />
        <SlideLayer layer={shots.layer('boss-link-layer')} from="bottom" frames={BOSS_LINK} app={PHONE.app} dim={0.7} />
        <Finger taps={TAPS} />
      </Phone>
      <DeviceTag at={top} text="Patron · telefonda" frames={{ from: 116, to: 280 }} />
    </>
  )
}
