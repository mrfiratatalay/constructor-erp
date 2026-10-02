import { useFilmTime } from '../../../film/clock'
import { between, smoothNoise } from '../../../motion/random'
import { SUN } from './Sky'

// Açılar ekran koordinatında: 0° sağ, 90° aşağı. Hüzmeler güneşten aşağı-sola, odaya ve masaya iner.
const RAYS = [
  { spread: [112, 117], strength: 0.5 },
  { spread: [124, 128], strength: 0.35 },
  { spread: [133, 140], strength: 0.45 },
  { spread: [146, 150], strength: 0.3 },
  { spread: [157, 163], strength: 0.38 },
  { spread: [70, 76], strength: 0.25 },
]

const pointAt = (angle: number, distance: number): string => {
  const radians = (angle * Math.PI) / 180
  return `${SUN.x + Math.cos(radians) * distance} ${SUN.y + Math.sin(radians) * distance}`
}

/** Pencereden odaya dolan ışık hüzmeleri: yavaşça nefes alır, pusu görünür kılar. */
export const LightRays = () => {
  const t = useFilmTime()
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}
      style={{ position: 'absolute', mixBlendMode: 'screen', filter: 'blur(10px)' }}>
      <defs>
        <radialGradient id="ray-fade" cx={SUN.x} cy={SUN.y} r={1500} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe2b0" stopOpacity={0.55} />
          <stop offset="0.55" stopColor="#ffd9a0" stopOpacity={0.12} />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
      </defs>
      {RAYS.map(({ spread: [from, to], strength }, index) => {
        const breathe = 0.75 + 0.25 * Math.sin(t * 0.7 + index * 1.7)
        const path = `M${SUN.x} ${SUN.y} L${pointAt(from, 1700)} L${pointAt(to, 1700)}Z`
        return <path key={from} d={path} fill="url(#ray-fade)" opacity={Math.min(1, strength * breathe * 1.5)} />
      })}
    </svg>
  )
}

/** Işıkta asılı toz zerreleri: belirlenimci, her render'da aynı yolu izler. */
export const DustMotes = ({ count = 34 }: { count?: number }) => {
  const t = useFilmTime()
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', mixBlendMode: 'screen' }}>
      {Array.from({ length: count }, (_, index) => {
        // Zerreler yalnızca hüzmelerin içinde: güneşten aşağı-sola uzanan bir şerit.
        const along = between(index, 0.15, 1)
        const x = SUN.x - along * 900 + between(index + 50, -120, 120) + smoothNoise(index * 3, t * 0.35) * 40 + t * 4
        const y = SUN.y + along * 380 + between(index + 100, -90, 90) + smoothNoise(index * 5 + 1, t * 0.3) * 30 - t * 3
        const size = between(index + 200, 0.8, 2.2)
        const twinkle = 0.12 + 0.35 * (0.5 + smoothNoise(index * 7 + 2, t * 1.4))
        return <circle key={index} cx={x} cy={y} r={size} fill="#fff1d6" opacity={twinkle} />
      })}
    </svg>
  )
}

/** Güneşin binanın kolonlarından taşan parlaması: kamera merceğinde arkadan gelen ışığın bıraktığı "bloom". */
export const SunBloom = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', mixBlendMode: 'screen' }}>
    <defs>
      <radialGradient id="sun-bloom" cx={SUN.x} cy={SUN.y} r={420} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff3dc" stopOpacity={0.95} />
        <stop offset="0.12" stopColor="#ffe2b2" stopOpacity={0.6} />
        <stop offset="0.45" stopColor="#ffcf8f" stopOpacity={0.16} />
        <stop offset="1" stopColor="#ffcf8f" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={SUN.x} cy={SUN.y} r={420} fill="url(#sun-bloom)" />
  </svg>
)
