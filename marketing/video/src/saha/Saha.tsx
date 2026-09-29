import { Film } from '../kit/Film'
import { laptopPoint } from '../kit/Laptop'
import { LightStreak } from '../kit/LightStreak'
import { centerOf } from '../kit/motion'
import { CAMERA } from './camera'
import { DeskAct } from './DeskAct'
import { PhoneAct } from './PhoneAct'
import { shots } from './shots'
import { CUES, MUSIC } from './sounds'
import { CAPTIONS, CLOSING, END_CARD, INTRO, LAPTOP_ON, STREAK } from './timeline'

/**
 * Saha ve sohbet videosu: şef şantiyeden sorun bildirir, akışta sarı satır olur; patron ofiste listede ve Saha'da
 * görür, şantiyenin sohbetinden cevap yazar; cevap aynı dakikada şefin telefonundadır.
 */
const SCRIPT = { intro: INTRO, captions: CAPTIONS, closing: { start: END_CARD, ...CLOSING }, music: MUSIC, cues: CUES }
const SITE_ROW = laptopPoint(LAPTOP_ON, centerOf(shots.box('desk-site-row')))

export const Saha: React.FC = () => (
  <Film
    camera={CAMERA}
    script={SCRIPT}
    world={
      <>
        <DeskAct />
        <PhoneAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={SITE_ROW} frames={STREAK} />
      </>
    }
  />
)
