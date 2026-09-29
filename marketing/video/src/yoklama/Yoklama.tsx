import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Blueprint } from '../kit/Blueprint'
import { Camera, toScreen } from '../kit/Camera'
import { Captions } from '../kit/Captions'
import { EndCard } from '../kit/EndCard'
import { FileFly } from '../kit/FileFly'
import { laptopPoint } from '../kit/Laptop'
import { LightStreak } from '../kit/LightStreak'
import { placeAt, progress } from '../kit/motion'
import { Pulse } from '../kit/Pulse'
import { Soundtrack } from '../kit/Soundtrack'
import { Title } from '../kit/Title'
import { useBrandFont } from '../kit/useBrandFont'
import { COLOR, FONT } from '../theme'
import { CAMERA, EXCEL_BUTTON, RING } from './camera'
import { DeskAct } from './DeskAct'
import { PhoneAct } from './PhoneAct'
import { CUES, MUSIC } from './sounds'
import { CAPTIONS, CLOSING, DESK_CLICKS, END_CARD, INTRO, LAPTOP_ON, RING_PULSE, STREAK } from './timeline'

/**
 * Yoklama videosu: sabah şef telefonda yoklamayı alır, patron ofiste bugünü ve ayın puantajını görür, Excel'i indirir.
 * Cihazlar ve efektler kameranın içinde (dünyada), sözler ve uçan dosya ekranın üstündedir; ses en alttadır.
 */
export const Yoklama: React.FC = () => {
  useBrandFont()
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: COLOR.deep, overflow: 'hidden' }}>
      <Blueprint />
      <Camera poses={CAMERA}>
        <DeskAct />
        <PhoneAct />
        <LightStreak from={{ x: 1700, y: 780 }} to={laptopPoint(LAPTOP_ON, { x: 735, y: 460 })} frames={STREAK} />
        <Pulse at={RING} radius={30} color={COLOR.successBright} from={RING_PULSE} />
      </Camera>
      <ExcelMoment />
      <Captions lines={CAPTIONS} />
      {INTRO.map((title) => (
        <Title key={title.from} {...title} />
      ))}
      <EndCard start={END_CARD} line={CLOSING.line} note={CLOSING.note} />
      <Soundtrack music={MUSIC.name} musicVolume={MUSIC.volume} cues={CUES} />
    </AbsoluteFill>
  )
}

const EXCEL_SHEETS = ['Personel', 'Ekipler', 'Kayıtlar']

/** Excel'e tıklanınca arka kararır, dosya düğmeden çıkıp ortaya oturur. */
const ExcelMoment: React.FC = () => {
  const frame = useCurrentFrame()
  const start = DESK_CLICKS.excel + 2
  if (frame < start) return null
  const from = toScreen(EXCEL_BUTTON, placeAt(start, CAMERA))
  return (
    <>
      <AbsoluteFill style={{ background: `rgb(8 14 36 / ${0.55 * progress(frame, start, start + 14)})` }} />
      <FileFly from={from} to={{ x: 1300, y: 470 }} name="puantaj-2026-09.xlsx" sheets={EXCEL_SHEETS} start={start} />
    </>
  )
}
