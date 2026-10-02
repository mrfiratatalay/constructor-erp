import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { Camera } from '../../motion/Camera'
import { easeOutCubic, keyframes, progress } from '../../motion/ease'
import { NotificationCard } from './NotificationCard'
import { WideWorld } from './world/WideWorld'

const [START, END] = cues.shots.wide
const ICONS: Record<string, string> = { blue: '💬', orange: '🔧', violet: '📊' }

/** Telefondan yükselen bildirimler: her yenisi öncekileri yukarı iter. */
const RisingNotifications = () => {
  const t = useFilmTime()
  const arrived = cues.phoneNotifications.filter((note) => note.t <= t)
  return (
    <AbsoluteFill>
      {arrived.map((note, index) => {
        const enter = progress(t, note.t, 0.42, easeOutCubic)
        const lift = arrived.slice(index + 1).reduce((sum, later) => sum + progress(t, later.t, 0.38, easeOutCubic) * 104, 0)
        return (
          <NotificationCard key={note.t} app={note.app} from={note.from} text={note.text} tone={note.tone}
            icon={ICONS[note.tone]}
            style={{ position: 'absolute', left: 1452, top: 548 - lift + (1 - enter) * 90, opacity: enter,
              transform: `scale(${0.92 + enter * 0.08})`, transition: 'none' }} />
        )
      })}
    </AbsoluteFill>
  )
}

/** 0,9 – 4,7 sn: geniş plan. Kamera masaya doğru yavaşça ilerler; telefon uyanır, bildirimler yükselir. */
export const WideShot = () => {
  const t = useFilmTime()
  const zoom = keyframes(t, [[START, 1], [END, 1.075]])
  const drift = keyframes(t, [[START, -12], [END, 18]])
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Camera state={{ x: drift, y: 0, zoom, focusX: 1010, focusY: 660 }}>
        <WideWorld />
      </Camera>
      <RisingNotifications />
    </AbsoluteFill>
  )
}
