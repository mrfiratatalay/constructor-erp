import { FileMoment } from '../kit/FileMoment'
import { Film } from '../kit/Film'
import { laptopPoint } from '../kit/Laptop'
import { LightStreak } from '../kit/LightStreak'
import { Pulse } from '../kit/Pulse'
import { COLOR } from '../theme'
import { CAMERA, EXCEL_BUTTON, RING } from './camera'
import { DeskAct } from './DeskAct'
import { PhoneAct } from './PhoneAct'
import { TODAY_MONTH } from './shots'
import { CUES, MUSIC } from './sounds'
import { CAPTIONS, CLOSING, DESK_CLICKS, END_CARD, INTRO, LAPTOP_ON, RING_PULSE, STREAK } from './timeline'

/**
 * Yoklama videosu: sabah şef telefonda yoklamayı alır, patron ofiste bugünü ve ayın puantajını görür, Excel'i indirir.
 */
const SCRIPT = { intro: INTRO, captions: CAPTIONS, closing: { start: END_CARD, ...CLOSING }, music: MUSIC, cues: CUES }

export const Yoklama: React.FC = () => (
  <Film
    camera={CAMERA}
    script={SCRIPT}
    world={
      <>
        <DeskAct />
        <PhoneAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={laptopPoint(LAPTOP_ON, { x: 735, y: 460 })} frames={STREAK} />
        <Pulse at={RING} radius={30} color={COLOR.successBright} from={RING_PULSE} />
      </>
    }
    overlay={
      <FileMoment
        start={DESK_CLICKS.excel + 2}
        button={EXCEL_BUTTON}
        camera={CAMERA}
        name={`puantaj-${TODAY_MONTH}.xlsx`}
        sheets={['Personel', 'Ekipler', 'Kayıtlar']}
      />
    }
  />
)
