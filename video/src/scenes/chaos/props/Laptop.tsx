import { LaptopScreen } from './LaptopScreen'

export const SCREEN = { x: 612, y: 410, width: 466, height: 284 }

/** Klavye gövdesi: perspektifte yamuk, tuş sıraları ve dokunmatik alan. */
const Base = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute' }}>
    <defs>
      <linearGradient id="laptop-deck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a3f4a" />
        <stop offset="1" stopColor="#1c1f26" />
      </linearGradient>
    </defs>
    <path d="M598 712 L1092 712 L1132 786 L558 786Z" fill="url(#laptop-deck)" />
    <g stroke="#14171d" strokeWidth={1.6}>
      {[0, 1, 2, 3, 4].map((row) => {
        const y = 720 + row * 9
        const inset = 10 + row * 4.8
        return <line key={row} x1={606 - row * 4 + inset} y1={y} x2={1084 + row * 4 - inset} y2={y} />
      })}
    </g>
    <path d="M790 766 L900 766 L904 782 L786 782Z" fill="#2b3039" />
    <path d="M558 786 L1132 786 L1128 792 L562 792Z" fill="#0d0f13" />
    <path d="M598 712 L1092 712" stroke="#c9d6f0" strokeWidth={1.2} opacity={0.5} />
  </svg>
)

/** Laptop: ekran izleyiciye dönük, odadaki en parlak yüzey. Etrafına hafif ışık taşar. */
export const Laptop = () => (
  <>
    <div style={{ position: 'absolute', left: SCREEN.x - 40, top: SCREEN.y - 30, width: SCREEN.width + 80,
      height: SCREEN.height + 60, background: '#a9c2ff', opacity: 0.18, filter: 'blur(40px)', borderRadius: 40 }} />
    <div style={{ position: 'absolute', left: SCREEN.x - 12, top: SCREEN.y - 12, width: SCREEN.width + 24,
      height: SCREEN.height + 30, background: '#14171e', borderRadius: '14px 14px 4px 4px',
      boxShadow: '0 0 0 1px #2a2f3a' }} />
    <div style={{ position: 'absolute', left: SCREEN.x, top: SCREEN.y, width: SCREEN.width, height: SCREEN.height,
      overflow: 'hidden', borderRadius: 3 }}>
      <LaptopScreen />
    </div>
    <Base />
  </>
)
