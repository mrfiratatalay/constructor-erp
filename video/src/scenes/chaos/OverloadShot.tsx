import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { Camera } from '../../motion/Camera'
import { easeInCubic, keyframes } from '../../motion/ease'
import { smoothNoise } from '../../motion/random'
import { OverloadCards } from './overload/OverloadCards'
import { WideWorld } from './world/WideWorld'

const [START] = cues.shots.overload

/**
 * 11,15 – 13,95 sn, aşırı yük: geniş plana dönülür, kamera ağır ağır patrona yaklaşır, titreşimi artar.
 * Bütün dağınık bilgi onun etrafına yığılır. 13,3'te ChaosScene saati durdurur ve bu kare donar.
 */
export const OverloadShot = () => {
  const t = useFilmTime()
  const zoom = keyframes(t, [[START, 1.05], [cues.freeze, 1.16]], easeInCubic)
  const tension = keyframes(t, [[START, 0.2], [cues.freeze, 2.4]])
  const shakeX = smoothNoise(3, t * 9) * tension * 2
  const shakeY = smoothNoise(7, t * 8) * tension * 1.5
  const darken = keyframes(t, [[START, 0], [cues.freeze, 0.32]])
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Camera state={{ x: 10 + shakeX, y: shakeY, zoom, focusX: 760, focusY: 600 }}>
        <WideWorld />
      </Camera>
      <AbsoluteFill style={{ background: `rgb(4 6 12 / ${darken})` }} />
      <OverloadCards />
    </AbsoluteFill>
  )
}
