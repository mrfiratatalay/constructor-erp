import { AbsoluteFill } from 'remotion'
import { Blueprint } from '../kit/Blueprint'
import { Camera } from '../kit/Camera'
import { Captions } from '../kit/Captions'
import { EndCard } from '../kit/EndCard'
import { FileMoment } from '../kit/FileMoment'
import { laptopPoint } from '../kit/Laptop'
import { LightStreak } from '../kit/LightStreak'
import { Pulse } from '../kit/Pulse'
import { Soundtrack } from '../kit/Soundtrack'
import { Title } from '../kit/Title'
import { useBrandFont } from '../kit/useBrandFont'
import { COLOR, FONT } from '../theme'
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
export const Malzeme: React.FC = () => {
  useBrandFont()
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: COLOR.deep, overflow: 'hidden' }}>
      <Blueprint />
      <Camera poses={CAMERA}>
        <DeskAct />
        <PhoneAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={laptopPoint(LAPTOP_ON, { x: 735, y: 460 })} frames={STREAK} />
        <Pulse at={SENT} radius={40} color={COLOR.successBright} from={SENT_PULSE} />
        <Pulse at={RETURN_BUTTON} radius={24} color={COLOR.successBright} from={DESK_CLICKS.returned + 2} />
      </Camera>
      <FileMoment start={DESK_CLICKS.excel + 2} button={EXCEL_BUTTON} camera={CAMERA} name={EXPORT_NAME} sheets={['Sevkiyatlar']} />
      <Captions lines={CAPTIONS} />
      {INTRO.map((title) => (
        <Title key={title.from} {...title} />
      ))}
      <EndCard start={END_CARD} line={CLOSING.line} note={CLOSING.note} />
      <Soundtrack music={MUSIC.name} musicVolume={MUSIC.volume} cues={CUES} />
    </AbsoluteFill>
  )
}
