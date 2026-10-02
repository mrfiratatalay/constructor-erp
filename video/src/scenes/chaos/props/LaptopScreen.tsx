import { useFilmTime } from '../../../film/clock'
import cues from '../../../film/cues/chaos.json'
import { progress } from '../../../motion/ease'
import { OLD_WORLD_FONT } from '../oldWorld'

const CELL_COLORS = ['#fde68a', '#fecaca', '#bbf7d0', '#e5e7eb']

/** Küçük ölçekte bir tablo: satırlar, sütunlar, renkli hücreler. Okunması değil, "tablo" olduğu anlaşılmalı. */
const MiniSheet = () => (
  <div style={{ position: 'absolute', left: 8, top: 8, width: 318, height: 268, background: '#f8fafc', borderRadius: 4,
    overflow: 'hidden', boxShadow: '0 2px 8px rgb(0 0 0 / 0.3)' }}>
    <div style={{ height: 16, background: '#d9dee6', fontFamily: OLD_WORLD_FONT, fontSize: 7, color: '#334155',
      padding: '3px 6px' }}>
      puantaj_eylul_SON_v3 (2).xlsx
    </div>
    <svg width={318} height={252}>
      {Array.from({ length: 21 }, (_, row) => (
        <line key={`r${row}`} x1={0} y1={row * 12} x2={318} y2={row * 12} stroke="#d4d9e1" strokeWidth={0.6} />
      ))}
      {Array.from({ length: 14 }, (_, column) => (
        <line key={`c${column}`} x1={46 + column * 20} y1={0} x2={46 + column * 20} y2={252} stroke="#d4d9e1"
          strokeWidth={0.6} />
      ))}
      {Array.from({ length: 18 }, (_, row) =>
        Array.from({ length: 13 }, (_, column) => {
          const code = (row * 7 + column * 3) % 11
          if (code > 3) return null
          return <rect key={`${row}-${column}`} x={47 + column * 20} y={13 + row * 12} width={19} height={11}
            fill={CELL_COLORS[code]} />
        }),
      )}
      {Array.from({ length: 18 }, (_, row) => (
        <rect key={`n${row}`} x={4} y={16 + row * 12} width={24 + ((row * 13) % 14)} height={4} fill="#94a3b8" />
      ))}
    </svg>
  </div>
)

const MiniChat = () => (
  <div style={{ position: 'absolute', left: 334, top: 8, width: 124, height: 268, background: '#e8ebef',
    borderRadius: 4, overflow: 'hidden' }}>
    <div style={{ height: 16, background: '#cfd5dd' }} />
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <div key={index} style={{ margin: index % 2 ? '7px 6px 0 30px' : '7px 30px 0 6px', height: 14 + (index % 3) * 6,
        borderRadius: 5, background: index % 2 ? '#cfe3d8' : '#ffffff' }} />
    ))}
  </div>
)

/** Masaüstü bildirimi: telefona gelen her mesaj laptopta da belirir. */
const Toasts = () => {
  const t = useFilmTime()
  return (
    <div style={{ position: 'absolute', right: 8, top: 8, width: 150 }}>
      {cues.phoneNotifications.map((note, index) => {
        const shown = progress(t, note.t + 0.05, 0.3)
        if (shown <= 0) return null
        return (
          <div key={note.t} style={{ marginBottom: 4, height: 30, borderRadius: 6, background: 'rgb(30 41 59 / 0.94)',
            opacity: shown, transform: `translateX(${(1 - shown) * 40}px)`, padding: '4px 6px',
            fontFamily: OLD_WORLD_FONT, color: '#e2e8f0', fontSize: 6.5, lineHeight: 1.35, zIndex: 3 - index }}>
            <b>{note.from}</b>
            <div style={{ opacity: 0.8 }}>{note.text}</div>
          </div>
        )
      })}
    </div>
  )
}

/** Laptop ekranının içi: dağınık bir masaüstü. */
export const LaptopScreen = () => (
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2b3a55, #1b2438)' }}>
    <MiniSheet />
    <MiniChat />
    <Toasts />
  </div>
)
