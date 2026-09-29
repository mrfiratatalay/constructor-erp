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
 * İlerleme videosu: şef akşam telefondan Demir İşleri'ne bugünün miktarını yazar, yüzdeyi ve kalanı uygulama
 * hesaplar; patron ofiste panoda görür, geciken işi süzer, detayda şefin notunu okur.
 */
const SCRIPT = { intro: INTRO, captions: CAPTIONS, closing: { start: END_CARD, ...CLOSING }, music: MUSIC, cues: CUES }
const DEMIR_ROW = laptopPoint(LAPTOP_ON, centerOf(shots.box('desk-demir-row')))

export const Ilerleme: React.FC = () => (
  <Film
    camera={CAMERA}
    script={SCRIPT}
    world={
      <>
        <DeskAct />
        <PhoneAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={DEMIR_ROW} frames={STREAK} />
      </>
    }
  />
)
