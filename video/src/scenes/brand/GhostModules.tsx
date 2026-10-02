import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/brand.json'
import { clamp01, easeOutBack, mix, progress } from '../../motion/ease'
import type { Box } from '../../ui/useCapture'
import { GHOSTS, MODULE_TARGETS, ghostLines, moduleBox } from './scaffold'

type Rect = Box & { angle: number }

const lerpRect = (from: Rect, to: Rect, amount: number): Rect => ({
  x: mix(from.x, to.x, amount),
  y: mix(from.y, to.y, amount),
  width: mix(from.width, to.width, amount),
  height: mix(from.height, to.height, amount),
  angle: mix(from.angle, to.angle, amount),
})

/** Bir modülün t anındaki yeri: dağınık → iskele modülü → landing sayfasındaki öğe. */
const rectAt = (index: number, t: number, target: Box): Rect => {
  const ghost = GHOSTS[index]
  const elapsed = Math.max(0, Math.min(t, cues.snap[0]) - cues.scatter[0])
  const drifting: Rect = { ...ghost, x: ghost.x + ghost.vx * elapsed, y: ghost.y + ghost.vy * elapsed }
  const snapStart = cues.snap[0] + index * 0.025
  const snap = clamp01((t - snapStart) / (cues.snap[1] - cues.snap[0]))
  const placed = lerpRect(drifting, { ...moduleBox(index), angle: 0 }, easeOutBack(snap))
  const morph = progress(t, cues.appSilhouette[0] + index * 0.02, cues.appSilhouette[1] - cues.appSilhouette[0])
  return lerpRect(placed, { ...target, angle: 0 }, morph)
}

type Props = { targets: Box[]; opacity: number }

/**
 * Kaostan kalan kartlar: önce dağınık ve eğik süzülür, müziğin ilk temiz notasında (18,05) iskelenin
 * modüllerine oturur, sonra landing sayfasının gerçek yerleşimine (header, başlık, butonlar…) dönüşür.
 * "Dağınık → düzenli" metaforunun hareketle anlatımı.
 */
export const GhostModules = ({ targets, opacity }: Props) => {
  const t = useFilmTime()
  const settled = progress(t, cues.snap[0], 0.6)
  const morph = progress(t, cues.appSilhouette[0], 0.8)
  return (
    <AbsoluteFill style={{ opacity }}>
      {GHOSTS.map((_, index) => {
        const rect = rectAt(index, t, targets[index])
        // Pencerenin kendisine dönüşen fazla modüller inerken söner: çerçeveyi AppSilhouette çizer.
        const merges = MODULE_TARGETS[index] === 'viewport' ? 1 - morph : 1
        const appear = progress(t, cues.scatter[0] + index * 0.06, 0.5) * merges
        return (
          <div key={index} style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.width,
            height: rect.height, transform: `rotate(${rect.angle}deg)`, opacity: appear, borderRadius: 10 - morph * 4,
            border: `1.5px solid rgb(255 255 255 / ${0.34 - settled * 0.12 + morph * 0.12})`,
            background: `rgb(255 255 255 / ${0.03 + settled * 0.03})`, padding: '14px 16px', overflow: 'hidden' }}>
            {ghostLines(index).map((width, line) => (
              <div key={line} style={{ width: `${width * 100}%`, height: 7, borderRadius: 4, marginBottom: 10,
                background: `rgb(255 255 255 / ${(0.2 - settled * 0.1) * (1 - morph)})` }} />
            ))}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}
