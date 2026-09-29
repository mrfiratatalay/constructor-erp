import { Film } from '../kit/Film'
import { laptopPoint } from '../kit/Laptop'
import { LightStreak } from '../kit/LightStreak'
import { LinkFly } from '../kit/LinkFly'
import { BossAct } from './BossAct'
import { CAMERA, LINK_FROM, LINK_TO } from './camera'
import { DeskAct } from './DeskAct'
import { LINK_TEXT } from './shots'
import { CUES, MUSIC } from './sounds'
import { WorkerAct } from './WorkerAct'
import { CAPTIONS, CLOSING, END_CARD, INTRO, LAPTOP_ON, LINK_FLIGHT, STREAK } from './timeline'

/**
 * Ekip videosu: patron firmanın tek bağlantısını paylaşır, yeni usta şifresiz, indirmesiz katılır;
 * patron ofiste akışta görür, usta yoklamada kendiliğinden yerini almıştır.
 */
const SCRIPT = { intro: INTRO, captions: CAPTIONS, closing: { start: END_CARD, ...CLOSING }, music: MUSIC, cues: CUES }

export const Ekip: React.FC = () => (
  <Film
    camera={CAMERA}
    script={SCRIPT}
    world={
      <>
        <DeskAct />
        <BossAct />
        <WorkerAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={laptopPoint(LAPTOP_ON, { x: 735, y: 460 })} frames={STREAK} />
        <LinkFly
          from={LINK_FROM}
          to={LINK_TO}
          frames={LINK_FLIGHT}
          title="Şantiye ekibine katıl · Kızılkan Yapı"
          link={LINK_TEXT}
        />
      </>
    }
  />
)
