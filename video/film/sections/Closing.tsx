// 01:46.6–02:00 · KAPANIŞ. Açılıştaki masaya dönüş: karmaşa yok; dizüstünde gerçek İskele ERP ekranı, telefonda
// şantiyenin Saha'sı. Kamera ekranın içine girer, arayüz marka zeminine çözülür: İskele ERP, "Saha hareketli. Kontrol
// sizde." ve davet. Alan adı kullanıcının verdiği canlı adrestir.
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { Camera } from '../components/Camera'
import { Clip } from '../components/Clip'
import { Wordmark } from '../components/Wordmark'
import { DeskSet } from '../scenes/desk/DeskSet'
import { CoffeeCup, Dust, HardHat, Patron } from '../scenes/desk/Sprites'
import { COLOR, FONT } from '../theme'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const
const ease = (x: number) => 1 - (1 - x) ** 3
const LAPTOP_MAP: [number, number][] = [[0, 0.9], [2.5, 1.4], [3.6, 4.2], [7.4, 7.4]]
const screen = (node: React.ReactNode) => <div style={{ position: 'relative', width: '100%', height: '100%' }}>{node}</div>

const Desk: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ opacity: interpolate(t, [0, 0.6], [0, 1], clamp) * interpolate(t, [5.9, 6.4], [1, 0], clamp) }}>
    <Camera keys={{ scale: [[0, 1.04], [3.9, 1.1], [4.3, 1.1], [6.4, 2.95]], ox: [[0, 50], [4.3, 48.2]], oy: [[0, 55], [4.3, 53]] }}>
      <DeskSet calm laptop={screen(<Clip name="overview" map={LAPTOP_MAP} />)} phone={screen(<Clip name="phoneField" map={[[0, 6.8]]} />)} />
      <HardHat x={300} y={640} scale={0.78} />
      <CoffeeCup x={1650} y={500} />
      <Dust count={50} seed="calm" />
    </Camera>
    <Patron calm shift={interpolate(t, [0, 6], [0, -60])} />
  </AbsoluteFill>
)

const Line: React.FC<{ t: number; at: number; top: number; size: number; color?: string; weight?: number; children: React.ReactNode }> = ({
  t, at, top, size, color = '#fff', weight = 800, children,
}) => {
  const k = ease(interpolate(t, [at, at + 0.7], [0, 1], clamp))
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', fontFamily: FONT, fontSize: size, fontWeight: weight,
      letterSpacing: '-0.04em', color, opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>{children}</div>
  )
}

export const Closing: React.FC = () => {
  const t = useCurrentFrame() / 30
  const ui = interpolate(t, [5.9, 6.4], [0, 1], clamp) * interpolate(t, [6.7, 7.3], [1, 0], clamp)
  const brand = interpolate(t, [6.7, 7.3], [0, 1], clamp)
  const out = interpolate(t, [12.9, 13.4], [1, 0], clamp)
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Desk t={t} />
      <AbsoluteFill style={{ opacity: ui, transform: `scale(${1 + interpolate(t, [5.9, 7.3], [0, 0.06], clamp)})` }}>
        <Clip name="overview" map={LAPTOP_MAP} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: brand * out }}>
        <Backdrop glow={[50, 35]} drift={0.08} />
        <div style={{ position: 'absolute', left: 960, top: 400, transform: 'translate(-50%, -50%)' }}>
          <Wordmark size={120} draw={interpolate(t, [7.35, 8.2], [0, 1], clamp)} reveal={ease(interpolate(t, [7.65, 8.5], [0, 1], clamp))} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 540, height: 110 }}>
          <Line t={t} at={9.8} top={0} size={78}>Saha hareketli. <span style={{ opacity: 0 }}>Kontrol sizde.</span></Line>
          <Line t={t} at={11.0} top={0} size={78} color={COLOR.signature}><span style={{ opacity: 0 }}>Saha hareketli. </span>Kontrol sizde.</Line>
        </div>
        <Line t={t} at={11.8} top={720} size={30} weight={600} color="rgba(255,255,255,0.86)">Firmanız için İskele ERP’yi keşfedin.</Line>
        <Line t={t} at={12.1} top={772} size={22} weight={600} color="rgba(255,255,255,0.55)">iskeleerp.vercel.app</Line>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
