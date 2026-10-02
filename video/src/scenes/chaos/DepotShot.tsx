import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { keyframes } from '../../motion/ease'
import { DeliveryNote, SmsScreen } from './closeup/DepotScreens'
import { DeskSurface } from './closeup/DeskSurface'
import { PhoneDevice } from './closeup/PhoneDevice'

const [START, END] = cues.shots.depot

/**
 * 7,9 – 9,4 sn, "Malzeme başka yerde": depodan düz bir SMS, yanında elle doldurulmuş pembe irsaliye.
 * Kamera mesajdan kâğıda kayar: malzemenin izi iki ayrı yerde, ikisi de eksik.
 */
export const DepotShot = () => {
  const t = useFilmTime()
  const pan = keyframes(t, [[START, 60], [END, -150]])
  const scale = keyframes(t, [[START, 1.0], [END, 1.05]])
  return (
    <AbsoluteFill>
      <DeskSurface shift={(t - START) * 26} />
      <AbsoluteFill style={{ transform: `translateX(${pan}px) scale(${scale})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 1020, top: 120, transform: 'rotate(-7deg)',
          boxShadow: '0 30px 50px rgb(0 0 0 / 0.45)' }}>
          <DeliveryNote />
        </div>
        <PhoneDevice x={640} y={560} scale={0.98} angle={5}>
          <SmsScreen message={cues.depotMessage} />
        </PhoneDevice>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
