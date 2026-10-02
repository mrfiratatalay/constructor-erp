import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { keyframes } from '../../motion/ease'
import { DeskSurface } from './closeup/DeskSurface'
import { RosterPaper } from './closeup/RosterPaper'

const [START, END] = cues.shots.roster
const SCRIBBLE = cues.sfx.find((cue) => cue.kind === 'scribble')?.t ?? START + 0.2

/** Kalem: tikin çizildiği yerde, çizgiyle birlikte kısa bir hareket yapar. */
const Pen = () => {
  const t = useFilmTime()
  // Uç, kâğıttaki tikin yolunu izler: (-16, 0) → (-6, 13) → (16, -17), tikin merkezine göre.
  const x = keyframes(t, [[SCRIBBLE, 0], [SCRIBBLE + 0.12, 10], [SCRIBBLE + 0.32, 32], [SCRIBBLE + 0.6, 60]])
  const y = keyframes(t, [[SCRIBBLE, 0], [SCRIBBLE + 0.12, 13], [SCRIBBLE + 0.32, -17], [SCRIBBLE + 0.6, -40]])
  return (
    <div style={{ position: 'absolute', left: 1178 + x, top: 482 + y, width: 420, height: 18, borderRadius: 9,
      background: 'linear-gradient(180deg, #334155, #0f172a)', transform: 'rotate(-34deg)', transformOrigin: '0 50%',
      boxShadow: '12px 22px 18px rgb(0 0 0 / 0.45)' }}>
      <div style={{ position: 'absolute', left: -14, top: 3, width: 18, height: 12, background: '#cbd5e1',
        clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }} />
    </div>
  )
}

/** 7,15 – 7,9 sn, "Yoklama başka yerde" (2): panoya kıstırılmış kâğıt; kalem bir tik daha atar. */
export const RosterShot = () => {
  const t = useFilmTime()
  const scale = keyframes(t, [[START, 1.04], [END, 1.1]])
  return (
    <AbsoluteFill>
      <DeskSurface shift={(t - START) * 20} />
      <AbsoluteFill style={{ transform: `scale(${scale}) rotate(-3deg)`, transformOrigin: '52% 48%' }}>
        <div style={{ position: 'absolute', left: 470, top: 40, width: 960, height: 1080, borderRadius: 22,
          background: 'linear-gradient(150deg, #7a5a3e, #5b4129)', boxShadow: '0 40px 70px rgb(0 0 0 / 0.55)' }}>
          <div style={{ position: 'absolute', left: 50, top: 150, boxShadow: '0 4px 10px rgb(0 0 0 / 0.25)' }}>
            <RosterPaper tickAt={SCRIBBLE} />
          </div>
          <div style={{ position: 'absolute', left: 330, top: 40, width: 300, height: 130, borderRadius: 14,
            background: 'linear-gradient(180deg, #e2e8f0, #94a3b8)', boxShadow: '0 10px 18px rgb(0 0 0 / 0.4)' }} />
        </div>
        <Pen />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
