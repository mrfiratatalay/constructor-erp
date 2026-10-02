// 01:34–01:46.6 · Saha + depo + ofis aynı sistem: şefin telefonu (fotoğraflı saha güncellemesi), depo sorumlusunun
// telefonu (malzeme hareketi), patronun bilgisayarı (aynı şantiyenin Saha'sında ikisi de görünür). Aralarında ince
// blueprint bağlantıları; seslendirmeye göre sırayla odak, sonunda üçü birlikte.
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { AppWindow } from '../components/AppWindow'
import { Backdrop } from '../components/Backdrop'
import { Phone } from '../components/Phone'
import { COLOR, FONT } from '../theme'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const
const FOCUS: [number, number][] = [[0, 2.3], [2.3, 4.6], [4.6, 8.0]]
const LABELS = [['SAHA', 'Şantiye şefi · telefon'], ['DEPO', 'Depo sorumlusu · telefon'], ['OFİS', 'Patron · bilgisayar']]
const SLOTS = [{ x: 110, w: 340 }, { x: 500, w: 340 }, { x: 890, w: 920 }]

function emphasis(i: number, t: number) {
  const [from, to] = FOCUS[i]
  if (t >= 8.0) return 1
  const inside = t >= from - 0.2 && t < to + 0.2
  return inside ? 1 : 0.42
}

const Device: React.FC<{ i: number; t: number; children: React.ReactNode }> = ({ i, t, children }) => {
  const rise = interpolate(t, [i * 0.22, i * 0.22 + 0.6], [0, 1], clamp)
  const focus = emphasis(i, t)
  const gather = interpolate(t, [11.4, 12.6], [0, 1], clamp)
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: rise * (0.35 + focus * 0.65) * (1 - gather),
      transform: `translateY(${(1 - rise) * 50}px) scale(${0.96 + focus * 0.04 - gather * 0.06})`, transformOrigin: `${SLOTS[i].x + SLOTS[i].w / 2}px 540px`,
      filter: `saturate(${0.5 + focus * 0.5})` }}>
      {children}
      <div style={{ position: 'absolute', left: SLOTS[i].x, width: SLOTS[i].w, top: 955, textAlign: 'center', fontFamily: FONT, color: '#fff' }}>
        <div style={{ fontSize: 15, letterSpacing: '0.2em', fontWeight: 800, color: COLOR.signature }}>{LABELS[i][0]}</div>
        <div style={{ fontSize: 19, fontWeight: 600, opacity: 0.8, marginTop: 4 }}>{LABELS[i][1]}</div>
      </div>
    </div>
  )
}

const Links: React.FC<{ t: number }> = ({ t }) => {
  const draw = interpolate(t, [4.4, 6.2], [0, 1], clamp)
  const pulse = (t * 120) % 40
  const paths = ['M290 170 C 380 60, 820 40, 1060 200', 'M680 170 C 760 110, 900 120, 1060 200']
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="rgba(255,255,255,0.16)" strokeWidth={2} fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - draw)} />
          <path d={d} stroke={COLOR.signature} strokeWidth={2.5} fill="none" strokeDasharray="6 34" strokeDashoffset={-pulse}
            opacity={draw * (t > 8 ? 1 : 0.7)} />
        </g>
      ))}
      <circle cx={1060} cy={200} r={7 * draw} fill={COLOR.signature} />
    </svg>
  )
}

export const Devices: React.FC = () => {
  const t = useCurrentFrame() / 30
  return (
    <AbsoluteFill>
      <Backdrop glow={[50, 30]} />
      <Links t={t} />
      <Device i={0} t={t}><Phone name="phoneField" map={[[0, 0.6], [6.4, 6.8]]} height={700} style={{ left: 120, top: 200 }} /></Device>
      <Device i={1} t={t}><Phone name="phoneMaterials" map={[[0, 0.4], [2.0, 0.6], [7.0, 7.6]]} height={700} style={{ left: 510, top: 200 }} /></Device>
      <Device i={2} t={t}><AppWindow name="overview" map={[[0, 0.5], [4.4, 0.6], [8.0, 4.6], [12.6, 7.4]]} width={920} left={890} top={250} /></Device>
    </AbsoluteFill>
  )
}
