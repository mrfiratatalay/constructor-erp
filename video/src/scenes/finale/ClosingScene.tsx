import { AbsoluteFill } from 'remotion'
import { useFilmTime } from '../../film/clock'
import { LogoLockup } from '../../brand/LogoLockup'
import { Vignette } from '../../effects/Vignette'
import { brand } from '../../theme/colors'
import { SANS } from '../../theme/fonts'
import { Camera } from '../../motion/Camera'
import { easeInCubic, easeOutCubic, keyframes, progress } from '../../motion/ease'
import { BlueprintGrid } from '../brand/BlueprintGrid'
import { WideWorld } from '../chaos/world/WideWorld'

/** Laptop ekranının merkezi: kamera oraya yaklaşır ve ekranın içine girer (katman derinliği 0,9). */
const SCREEN_CENTER = { x: 845, y: 552 }

const line = (t: number, at: number) => {
  const shown = progress(t, at, 0.6, easeOutCubic)
  return { opacity: shown, transform: `translateY(${(1 - shown) * 22}px)`, filter: `blur(${(1 - shown) * 6}px)` }
}

/** Son kart: logo, slogan (tanıtım sitesinin başlığıyla aynı iki renk), çağrı ve gerçek adres. */
const FinalCard = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ fontFamily: SANS, color: '#fff', textAlign: 'center' }}>
    <div style={{ position: 'absolute', left: 960, top: 290, transform: 'translateX(-50%)', opacity: progress(t, 114.0, 0.4) }}>
      <LogoLockup scale={3.2} surface="dark" draw={progress(t, 114.05, 0.75)} reveal={progress(t, 114.3, 0.55, easeOutCubic)} />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 520, fontSize: 92, fontWeight: 800, letterSpacing: '-0.05em',
      lineHeight: 1.08, ...line(t, 115.95) }}>Saha hareketli.</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 622, fontSize: 92, fontWeight: 800, letterSpacing: '-0.05em',
      lineHeight: 1.08, color: brand.signature, ...line(t, 117.5) }}>Kontrol sizde.</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 830, fontSize: 30, fontWeight: 600, color: 'rgb(255 255 255 / 0.78)',
      ...line(t, 117.95) }}>Firmanız için İskele ERP’yi keşfedin.</div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 880, fontSize: 24, fontWeight: 700, letterSpacing: '0.04em',
      color: brand.signature, ...line(t, 118.2) }}>iskeleerp.vercel.app</div>
  </AbsoluteFill>
)

/**
 * 106,2 – 120 sn, KAPANIŞ: "Şantiyeler farklı olabilir. Ekipler farklı olabilir. Ama kontrol tek yerde olabilir.
 * İskele ERP. Saha hareketli. Kontrol sizde." Açılıştaki ofis, bu kez sakin; kamera laptopa, ekranın içine girer,
 * ekran marka zeminine erir.
 */
export const ClosingScene = () => {
  const t = useFilmTime()
  const zoom = keyframes(t, [[106.2, 1.0], [111.6, 1.22], [113.9, 4.6]], easeInCubic)
  const toCenter = keyframes(t, [[111.6, 0], [113.9, 1]])
  const camera = { x: ((SCREEN_CENTER.x - 960) / 0.9) * toCenter, y: ((SCREEN_CENTER.y - 540) / 0.9) * toCenter, zoom,
    focusX: SCREEN_CENTER.x, focusY: SCREEN_CENTER.y }
  const brandIn = progress(t, 113.55, 0.6)
  return (
    <AbsoluteFill style={{ background: '#000', opacity: progress(t, 106.15, 0.6) * (1 - progress(t, 119.55, 0.45)) }}>
      {brandIn < 1 && (
        <AbsoluteFill>
          <Camera state={camera}><WideWorld calm /></Camera>
          <Vignette strength={0.45 * (1 - toCenter)} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ opacity: brandIn }}>
        <BlueprintGrid drift={-t * 4} />
        <AbsoluteFill style={{ background: 'radial-gradient(45% 40% at 50% 42%, rgb(37 99 235 / 0.3), transparent 70%)' }} />
        <FinalCard t={t} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
