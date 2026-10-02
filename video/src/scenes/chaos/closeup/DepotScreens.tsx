import { useFilmTime } from '../../../film/clock'
import { HAND, SANS } from '../../../theme/fonts'
import { easeOutCubic, progress } from '../../../motion/ease'
import { OLD_WORLD_FONT } from '../oldWorld'

type Message = { t: number; from: string; text: string }

const Bubble = ({ text, stamp, fresh }: { text: string; stamp: string; fresh: number }) => (
  <div style={{ alignSelf: 'flex-start', maxWidth: 300, opacity: fresh, transform: `translateY(${(1 - fresh) * 30}px)` }}>
    <div style={{ fontSize: 12, color: '#64748b', margin: '14px 0 4px 6px' }}>{stamp}</div>
    <div style={{ background: '#e2e8f0', borderRadius: 20, padding: '11px 16px', fontSize: 19, lineHeight: 1.3,
      color: '#0f172a' }}>
      {text}
    </div>
  </div>
)

/** Ekran klavyesi: mesaj okunurken cevap yazılmaya çalışılıyor. */
const Keyboard = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: '#d1d5db', padding: '14px 6px' }}>
    {[10, 9, 9, 7].map((keys, row) => (
      <div key={row} style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
        {Array.from({ length: keys }, (_, index) => (
          <div key={index} style={{ width: row === 3 && index === 3 ? 150 : 32, height: 46, borderRadius: 6,
            background: '#fff', boxShadow: '0 1px 0 #9ca3af' }} />
        ))}
      </div>
    ))}
  </div>
)

/** Depo sorumlusundan düz SMS: başka bir uygulama, başka bir yer. */
export const SmsScreen = ({ message }: { message: Message }) => {
  const t = useFilmTime()
  const fresh = progress(t, message.t, 0.3, easeOutCubic)
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: OLD_WORLD_FONT }}>
      <div style={{ height: 150, display: 'grid', placeItems: 'center', paddingTop: 40, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: '#94a3b8', color: '#fff', display: 'grid',
          placeItems: 'center', fontSize: 24, fontWeight: 600 }}>M</div>
        <div style={{ fontSize: 16, color: '#0f172a', marginTop: 4 }}>{message.from}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 18px' }}>
        <Bubble text="Çimento geldi, 120 torba. Kime teslim edeyim?" stamp="Dün 17:40" fresh={1} />
        <Bubble text="Kalıp panelleri yarın lazım mı?" stamp="Dün 19:12" fresh={1} />
        {fresh > 0 && <Bubble text={message.text} stamp="Bugün 06:53" fresh={fresh} />}
      </div>
      <Keyboard />
    </div>
  )
}

/** Pembe karbon kopya irsaliye: matbu başlık, elle doldurulmuş satırlar, eksik imza. */
export const DeliveryNote = () => (
  <svg viewBox="0 0 640 820" width={640} height={820}>
    <rect width={640} height={820} fill="#f4c6cf" />
    <rect width={640} height={820} fill="url(#note-fade)" />
    <defs>
      <linearGradient id="note-fade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={0.18} />
        <stop offset="1" stopColor="#7a2f3d" stopOpacity={0.1} />
      </linearGradient>
    </defs>
    <text x={40} y={78} fontFamily={SANS} fontWeight={800} fontSize={34} fill="#7a2f3d" letterSpacing={2}>SEVK İRSALİYESİ</text>
    <text x={440} y={78} fontFamily={SANS} fontWeight={600} fontSize={20} fill="#7a2f3d">No 004218</text>
    <g stroke="#b7707e" strokeWidth={1.4}>
      {[150, 230, 310, 390, 470, 550].map((y) => (
        <line key={y} x1={40} x2={600} y1={y} y2={y} />
      ))}
      <line x1={420} x2={420} y1={150} y2={550} />
    </g>
    <g fontFamily={SANS} fontSize={15} fill="#9b4a59" fontWeight={600}>
      <text x={44} y={142}>CİNSİ</text>
      <text x={428} y={142}>MİKTAR</text>
    </g>
    <g fontFamily={HAND} fill="#2d3f86">
      <text x={50} y={208} fontSize={44}>Kalıp paneli</text>
      <text x={440} y={208} fontSize={44}>24 ad.</text>
      <text x={50} y={288} fontSize={40}>Ana depo → Yomra?</text>
      <text x={50} y={680} fontSize={36}>Teslim alan: ............</text>
      <text x={60} y={760} fontSize={34} transform="rotate(-3 60 760)">imza yok!</text>
    </g>
    <path d="M440 740 c30 -40 50 20 80 -10 s40 -30 60 0" stroke="#2d3f86" strokeWidth={2.5} fill="none" opacity={0.5} />
  </svg>
)
