import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { DESKTOP_STAGE } from '../../film/stage'
import { easeOutCubic, mix, progress } from '../../motion/ease'
import { AppWindow } from '../../ui/AppWindow'
import { Cursor } from '../../ui/Cursor'
import { cursorAt } from '../onboarding/cursorPath'

/**
 * 22,3 – 23,0: gerçek tanıtım sitesi, iskeleden doğan pencerenin içinde bulanıklıktan netliğe gelir.
 * İmleç kadraja sağ alttan, doğal bir eğriyle girer (part 2'de "Fiyatlar"a gider).
 */
export const LandingReveal = ({ src }: { src: string }) => {
  const t = useFilmTime()
  const [start, end] = cues.toLanding
  if (t < start) return null
  const shown = progress(t, start, 0.45)
  const focus = progress(t, start, end - start, easeOutCubic)
  const cursor = cursorAt(t)
  return (
    <AbsoluteFill>
      <AppWindow placement={{ ...DESKTOP_STAGE, scale: mix(0.985, 1, focus) * DESKTOP_STAGE.scale }} src={src}
        style={{ opacity: shown, filter: `blur(${(1 - focus) * 12}px)` }} />
      <Cursor x={cursor.x} y={cursor.y} opacity={progress(t, cues.cursorIn[0], 0.2)} />
    </AbsoluteFill>
  )
}
