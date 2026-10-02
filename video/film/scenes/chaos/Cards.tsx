// "Önceki dünya"nın kartları: genel bir mesajlaşma grubu, arama, fotoğraf. İskele ERP'ye benzemez, marka logosu yok.
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { FONT } from '../../theme'

const TONES = ['#16a34a', '#2563eb', '#d97706', '#9333ea', '#dc2626', '#0891b2']

export interface CardSpec {
  at: number
  x: number
  y: number
  author: string
  text?: string
  photo?: string
  voice?: string
  rotate?: number
  group?: string
}

/** Kart, "at" saniyesinde yaylanarak gelir; freeze'den sonra hareket durur (frozenAt). */
export const MessageCard: React.FC<{ spec: CardSpec; time: number; tone: number; width?: number }> = ({ spec, time, tone, width = 380 }) => {
  const { fps } = useVideoConfig()
  const pop = spring({ frame: Math.round((time - spec.at) * fps), fps, config: { damping: 14, stiffness: 160 } })
  if (time < spec.at) return null
  const initials = spec.author.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return (
    <div style={{ position: 'absolute', left: spec.x, top: spec.y, width, fontFamily: FONT, transformOrigin: '30% 50%',
      transform: `translateY(${(1 - pop) * 26}px) scale(${0.86 + pop * 0.14}) rotate(${spec.rotate ?? 0}deg)`, opacity: pop,
      background: '#ffffff', borderRadius: 18, padding: '14px 16px', boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 8 }}>{spec.group ?? 'Yomra Şantiye Grubu · 23 kişi'}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: TONES[tone % TONES.length], color: '#fff', fontWeight: 700,
          display: 'grid', placeItems: 'center', fontSize: 15, flex: 'none' }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TONES[tone % TONES.length] }}>{spec.author}</div>
          {spec.photo && <Img src={staticFile(spec.photo)} style={{ width: '100%', borderRadius: 10, marginTop: 6 }} />}
          {spec.voice && <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, color: '#334155', fontSize: 16 }}>
            <span style={{ width: 30, height: 30, borderRadius: 15, background: '#e2e8f0', display: 'grid', placeItems: 'center' }}>▶</span>
            <span style={{ letterSpacing: 2 }}>▮▮▯▮▮▮▯▮▯▮▮▯</span><span>{spec.voice}</span></div>}
          {spec.text && <div style={{ fontSize: 19, color: '#0f172a', marginTop: 3, lineHeight: 1.3 }}>{spec.text}</div>}
        </div>
      </div>
    </div>
  )
}

export const CallCard: React.FC<{ at: number; time: number; x: number; y: number; who: string; role: string }> = ({ at, time, x, y, who, role }) => {
  if (time < at) return null
  const pulse = 1 + Math.sin((time - at) * 9) * 0.04
  const appear = interpolate(time - at, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' })
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 420, fontFamily: FONT, opacity: appear, transform: `scale(${0.9 + appear * 0.1})`,
      background: 'rgba(15,23,42,0.94)', borderRadius: 26, padding: '22px 24px', color: '#fff', boxShadow: '0 24px 50px rgba(0,0,0,0.5)' }}>
      <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>Gelen arama…</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{who}</div>
      <div style={{ fontSize: 16, color: '#cbd5e1' }}>{role}</div>
      <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
        <div style={{ flex: 1, height: 52, borderRadius: 26, background: '#dc2626', display: 'grid', placeItems: 'center', fontWeight: 700 }}>Reddet</div>
        <div style={{ flex: 1, height: 52, borderRadius: 26, background: '#16a34a', display: 'grid', placeItems: 'center', fontWeight: 700, transform: `scale(${pulse})` }}>Cevapla</div>
      </div>
    </div>
  )
}

export const Badge: React.FC<{ count: number; x: number; y: number }> = ({ count, x, y }) => (
  <div style={{ position: 'absolute', left: x, top: y, minWidth: 54, height: 54, padding: '0 14px', borderRadius: 27, background: '#dc2626',
    color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 26, display: 'grid', placeItems: 'center', boxShadow: '0 10px 24px rgba(220,38,38,0.45)' }}>
    {count}
  </div>
)
