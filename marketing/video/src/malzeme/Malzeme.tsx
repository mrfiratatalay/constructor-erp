import { FileMoment } from '../kit/FileMoment'
import { Film } from '../kit/Film'
import { laptopPoint } from '../kit/Laptop'
import { LightStreak } from '../kit/LightStreak'
import { Pulse } from '../kit/Pulse'
import { COLOR } from '../theme'
import { CAMERA, EXCEL_BUTTON, RETURN_BUTTON, SENT } from './camera'
import { DeskAct } from './DeskAct'
import { PhoneAct } from './PhoneAct'
import { EXPORT_NAME } from './shots'
import { CUES, MUSIC } from './sounds'
import { CAPTIONS, CLOSING, DESK_CLICKS, END_CARD, INTRO, LAPTOP_ON, SENT_PULSE, STREAK } from './timeline'

/**
 * Malzeme videosu: depocu telefonda sevkiyat çıkarır (nereye, ne, ne kadar, irsaliye), patron ofiste defterde görür,
 * 40 gündür dönmeyen kalıpların iadesini kaydeder, Excel'i indirir.
 */
const SCRIPT = { intro: INTRO, captions: CAPTIONS, closing: { start: END_CARD, ...CLOSING }, music: MUSIC, cues: CUES }

export const Malzeme: React.FC = () => (
  <Film
    camera={CAMERA}
    script={SCRIPT}
    world={
      <>
        <DeskAct />
        <PhoneAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={laptopPoint(LAPTOP_ON, { x: 735, y: 460 })} frames={STREAK} />
        <Pulse at={SENT} radius={40} color={COLOR.successBright} from={SENT_PULSE} />
        <Pulse at={RETURN_BUTTON} radius={24} color={COLOR.successBright} from={DESK_CLICKS.returned + 2} />
      </>
    }
    overlay={
      <FileMoment start={DESK_CLICKS.excel + 2} button={EXCEL_BUTTON} camera={CAMERA} name={EXPORT_NAME} sheets={['Sevkiyatlar']} />
    }
  />
)
