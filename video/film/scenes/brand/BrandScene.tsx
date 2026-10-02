// 00:15–00:24 · MARKA KIRILMASI. Siyah ve sessizlik; ince blueprint ızgarası; tek bir iskele direği çizilir, yatay
// bağlarla modüler bir yapıya dönüşür. Kaostaki dağınık kartların silüetleri ızgaraya oturur (DAĞINIK → DÜZENLİ),
// sonra bir uygulama penceresinin iskeletini kurar. "İskele ERP" ve gerçek tanıtım sitesi o pencerede belirir.
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion'
import { AppWindow, WINDOW } from '../../components/AppWindow'
import { Backdrop } from '../../components/Backdrop'
import { Wordmark } from '../../components/Wordmark'
import { COLOR, FONT } from '../../theme'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const
const ease = (t: number) => 1 - (1 - t) ** 3

/** Pencere iskeletinin modülleri: sol menü, liste satırları, içerik kartları (WINDOW içindeki oranlar). */
const MODULES = [
  [0, 0, 0.18, 1], [0.19, 0.02, 0.27, 0.08], ...[0, 1, 2, 3].map((i) => [0.19, 0.12 + i * 0.13, 0.27, 0.11]),
  [0.48, 0.02, 0.51, 0.08], [0.48, 0.13, 0.51, 0.36], [0.48, 0.52, 0.25, 0.45], [0.745, 0.52, 0.245, 0.45],
]

const Module: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const [mx, my, mw, mh] = MODULES[i]
  const settle = ease(interpolate(t, [2.6 + i * 0.07, 4.4 + i * 0.07], [0, 1], clamp))
  const left = (1920 - WINDOW.width) / 2
  const top = (1080 - WINDOW.height) / 2
  const target = { x: left + mx * WINDOW.width, y: top + my * WINDOW.height, w: mw * WINDOW.width, h: mh * WINDOW.height }
  const from = { x: random(`bx${i}`) * 1500 + 100, y: random(`by${i}`) * 800 + 80, w: 340, h: 92 }
  const k = settle
  const box = { x: from.x + (target.x - from.x) * k, y: from.y + (target.y - from.y) * k, w: from.w + (target.w - from.w) * k, h: from.h + (target.h - from.h) * k }
  const visible = interpolate(t, [2.4 + i * 0.05, 2.9 + i * 0.05], [0, 1], clamp) * interpolate(t, [8.7, 9.3], [1, 0], clamp)
  return (
    <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 14 - k * 6,
      border: `1.5px solid rgba(255,255,255,${0.16 + k * 0.1})`, background: `rgba(255,255,255,${0.02 + k * 0.03})`, opacity: visible,
      transform: `rotate(${(1 - k) * (random(`br${i}`) - 0.5) * 14}deg)` }} />
  )
}

const Scaffold: React.FC<{ t: number }> = ({ t }) => {
  const rise = ease(interpolate(t, [2.2, 3.0], [0, 1], clamp))
  const ledgers = [0, 1, 2, 3, 4]
  const fade = interpolate(t, [6.2, 7.0], [1, 0], clamp)
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: fade }}>
      <line x1={330} y1={980} x2={330} y2={980 - 880 * rise} stroke={COLOR.signature} strokeWidth={3} />
      <line x1={1590} y1={980} x2={1590} y2={980 - 880 * ease(interpolate(t, [2.5, 3.3], [0, 1], clamp))} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      {ledgers.map((i) => {
        const draw = ease(interpolate(t, [2.9 + i * 0.16, 3.5 + i * 0.16], [0, 1], clamp))
        const y = 960 - i * 210
        return <line key={i} x1={330} y1={y} x2={330 + 1260 * draw} y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
      })}
    </svg>
  )
}

const Line: React.FC<{ t: number; at: number; children: React.ReactNode; top: number; size: number; color?: string }> = ({ t, at, children, top, size, color = '#fff' }) => {
  const appear = ease(interpolate(t, [at, at + 0.6], [0, 1], clamp))
  const leave = interpolate(t, [6.3, 7.0], [0, 1], clamp)
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: top - leave * 40, textAlign: 'center', fontFamily: FONT, fontSize: size,
      fontWeight: 700, letterSpacing: '-0.035em', color, opacity: appear * (1 - leave), transform: `translateY(${(1 - appear) * 22}px)` }}>
      {children}
    </div>
  )
}

export const BrandScene: React.FC = () => {
  const t = useCurrentFrame() / 30
  const grid = interpolate(t, [2.15, 2.9], [0, 1], clamp)
  const mark = interpolate(t, [7.4, 8.1], [0, 1], clamp)
  const lift = ease(interpolate(t, [8.5, 9.6], [0, 1], clamp))
  const landing = interpolate(t, [8.75, 9.75], [0, 1], clamp)
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: grid }}><Backdrop glow={[50, 40]} drift={0} /></AbsoluteFill>
      <Scaffold t={t} />
      {MODULES.map((_, i) => <Module key={i} i={i} t={t} />)}
      <Line t={t} at={2.2} top={410} size={84}>İnşaat zaten karmaşık.</Line>
      <Line t={t} at={4.7} top={520} size={84} color={COLOR.signature}>Yönetimi olmak zorunda değil.</Line>
      <AbsoluteFill style={{ opacity: landing }}><AppWindow name="landing" map={[[0, 0]]} /></AbsoluteFill>
      <div style={{ position: 'absolute', left: 960, top: 540, opacity: mark * interpolate(t, [9.4, 9.9], [1, 0], clamp),
        transform: `translate(-50%, -50%) translate(${-lift * 520}px, ${-lift * 440}px) scale(${1 - lift * 0.55})` }}>
        <Wordmark size={110} draw={interpolate(t, [7.4, 8.2], [0, 1], clamp)} reveal={ease(interpolate(t, [7.7, 8.5], [0, 1], clamp))} />
      </div>
    </AbsoluteFill>
  )
}
