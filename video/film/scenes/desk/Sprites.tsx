// Ekran düzlemindeki nesneler: baret, kahve, omuz üstü patron silueti (bulanık, ön plan: yüz yok, derinlik var),
// pencereden süzülen tozlar.
import { Img, random, staticFile, useCurrentFrame } from 'remotion'

export const HardHat: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <svg viewBox="0 0 300 200" width={300 * scale} height={200 * scale} style={{ position: 'absolute', left: x, top: y }}>
    <defs>
      <radialGradient id="hat" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#ffe07a" /><stop offset="0.55" stopColor="#facc15" /><stop offset="1" stopColor="#b98c06" /></radialGradient>
    </defs>
    <ellipse cx="150" cy="168" rx="150" ry="26" fill="rgba(0,0,0,0.35)" />
    <path d="M18 150 Q150 182 282 150 L274 136 Q150 160 26 136 Z" fill="#d9a90a" />
    <path d="M40 140 Q46 40 150 34 Q254 40 260 140 Q150 158 40 140 Z" fill="url(#hat)" />
    <path d="M150 34 V146 M110 40 Q100 90 104 150 M190 40 Q200 90 196 150" stroke="#c99a07" strokeWidth={8} fill="none" opacity={0.6} />
  </svg>
)

export const CoffeeCup: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const t = useCurrentFrame() / 30
  return (
    <svg viewBox="0 0 220 260" width={170} height={200} style={{ position: 'absolute', left: x, top: y }}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${80 + i * 22} 70 q-14 -22 0 -40 q14 -18 0 -36`} stroke="rgba(255,255,255,0.22)" strokeWidth={5} fill="none"
          transform={`translate(${Math.sin(t * 1.2 + i) * 6} ${-((t * 18 + i * 12) % 24)})`} />
      ))}
      <ellipse cx="110" cy="236" rx="96" ry="18" fill="rgba(0,0,0,0.35)" />
      <path d="M30 90 L46 226 Q110 244 174 226 L190 90 Z" fill="#e7e5e4" />
      <ellipse cx="110" cy="90" rx="80" ry="20" fill="#3f2a1d" stroke="#f5f5f4" strokeWidth={8} />
      <path d="M186 120 q40 6 30 44 q-8 30 -38 30" stroke="#e7e5e4" strokeWidth={14} fill="none" />
    </svg>
  )
}

/** Omuz üstü siluet: sol ön planda koyu, bulanık (önceden çizilmiş plaka); kamera hareketinde biraz daha kayar. */
export const Patron: React.FC<{ shift?: number; calm?: boolean }> = ({ shift = 0 }) => (
  <Img src={staticFile('plates/patron.png')} style={{ position: 'absolute', left: -330 + shift, top: 110, width: 800, height: 1080,
    transform: 'scale(0.92)', transformOrigin: '0% 100%' }} />
)

export const Dust: React.FC<{ count?: number; seed?: string }> = ({ count = 40, seed = 'dust' }) => {
  const t = useCurrentFrame() / 30
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {Array.from({ length: count }, (_, i) => {
        const x = random(`${seed}x${i}`) * 1920 + Math.sin(t * 0.3 + i) * 30
        const y = (random(`${seed}y${i}`) * 1080 - t * (6 + random(`${seed}s${i}`) * 10)) % 1080
        const size = 2 + random(`${seed}r${i}`) * 4
        return <div key={i} style={{ position: 'absolute', left: x, top: (y + 1080) % 1080, width: size, height: size, borderRadius: '50%',
          background: 'rgba(255,236,200,0.45)' }} />
      })}
    </div>
  )
}
