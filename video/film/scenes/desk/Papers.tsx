// Masadaki kâğıtlar (masa düzleminde, perspektifle): elle tutulmuş yoklama, irsaliye, yapışkan not. "Önceki dünya":
// bilgi kâğıtta, defterde, ayrı ayrı. El yazısı eğik yazı ve çizgiyle taklit edilir.
const HAND = { fontFamily: "'Plus Jakarta Sans Variable', sans-serif", fontStyle: 'italic', color: '#1f2a44', transform: 'skewX(-8deg)' }
const abs = (style: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', ...style })

const ROWS: [string, string][] = [['Ali Y.', '✓'], ['Murat D.', '✓'], ['Emre K.', 'izin'], ['Hasan K.', '½'], ['İbrahim', '✓'], ['Kadir', '?'], ['Osman', '✓']]

export const RollCallPaper: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <div style={abs({ left: 470, top: 300, width: 380, height: 500, transform: 'rotateZ(9deg)', background: '#f7f3ea',
    boxShadow: `0 12px 24px rgba(0,0,0,0.35), 0 0 0 ${glow * 8}px rgba(250,204,21,${glow * 0.6})`, padding: '34px 38px',
    backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 51px, rgba(30,64,175,0.18) 51px 53px)' })}>
    <div style={{ ...HAND, fontSize: 34, fontWeight: 700 }}>Yoklama — 22/10</div>
    {ROWS.map(([name, mark], i) => (
      <div key={name} style={{ ...HAND, display: 'flex', justifyContent: 'space-between', fontSize: 30, marginTop: i ? 10 : 22, fontWeight: 500 }}>
        <span>{name}</span><span style={{ color: mark === '?' ? '#b91c1c' : '#1f2a44' }}>{mark}</span>
      </div>
    ))}
  </div>
)

export const DeliveryNote: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <div style={abs({ left: 1480, top: 170, width: 330, height: 280, transform: 'rotateZ(-8deg)', background: '#fffdf6',
    boxShadow: `0 10px 20px rgba(0,0,0,0.35), 0 0 0 ${glow * 8}px rgba(250,204,21,${glow * 0.6})`, padding: 26, fontFamily: "'Plus Jakarta Sans Variable'" })}>
    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.1em', color: '#475569' }}>SEVK İRSALİYESİ</div>
    <div style={{ height: 2, background: '#cbd5e1', margin: '12px 0 16px' }} />
    <div style={{ ...HAND, fontSize: 30 }}>Kalıp paneli — 24 ad.</div>
    <div style={{ ...HAND, fontSize: 26, marginTop: 10, color: '#475569' }}>Depo → Yomra ?</div>
    <div style={{ ...HAND, fontSize: 24, marginTop: 14, color: '#b91c1c' }}>geri gelecek mi??</div>
  </div>
)

export const StickyNote: React.FC = () => (
  <div style={abs({ left: 1480, top: 110, width: 190, height: 170, transform: 'rotateZ(-6deg)', background: '#fde68a',
    boxShadow: '0 8px 14px rgba(0,0,0,0.3)', padding: 18 })}>
    <div style={{ ...HAND, fontSize: 30, fontWeight: 700 }}>POMPA??</div>
    <div style={{ ...HAND, fontSize: 26, marginTop: 8 }}>15:00 ara!</div>
  </div>
)

export const Pencil: React.FC = () => (
  <div style={abs({ left: 760, top: 900, width: 340, height: 18, transform: 'rotateZ(-22deg)', borderRadius: 4,
    background: 'linear-gradient(90deg, #374151 0 6%, #f2b705 6% 88%, #e8c39e 88% 96%, #1f2937 96%)', boxShadow: '0 6px 8px rgba(0,0,0,0.35)' })} />
)
