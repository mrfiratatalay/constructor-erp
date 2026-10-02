import { useFilmTime } from '../../../film/clock'
import cues from '../../../film/cues/chaos.json'
import { buzzOffset, screenGlow } from './buzz'
import { OLD_WORLD_FONT } from '../oldWorld'

/** Kilit ekranı: saat ve üst üste binen bildirim şeritleri. */
const LockScreen = ({ t }: { t: number }) => {
  const arrived = cues.phoneNotifications.filter((note) => note.t <= t)
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '34px 12px', fontFamily: OLD_WORLD_FONT,
      background: 'linear-gradient(170deg, #2c3a58, #172036 60%, #0f1524)' }}>
      <div style={{ color: '#f1f5f9', fontSize: 42, fontWeight: 300, textAlign: 'center' }}>06:52</div>
      <div style={{ color: '#cbd5e1', fontSize: 11, textAlign: 'center', marginBottom: 18 }}>Perşembe, 2 Ekim</div>
      {arrived.reverse().map((note) => (
        <div key={note.t} style={{ background: 'rgb(226 232 240 / 0.72)', borderRadius: 12, padding: '7px 9px',
          marginBottom: 6, fontSize: 9.5, color: '#0f172a' }}>
          <b>{note.app}</b>
          <div>{note.text}</div>
        </div>
      ))}
    </div>
  )
}

/**
 * Masada yatan telefon. Gerçek perspektif için CSS 3D: telefon dik bir ekran olarak çizilir, sonra masaya yatırılır.
 * Bildirim geldiğinde ekran yanar, titreşimde telefon masada hafifçe kayar.
 */
export const DeskPhone = () => {
  const t = useFilmTime()
  const glow = screenGlow(t)
  const buzz = buzzOffset(t)
  return (
    <div style={{ position: 'absolute', left: 1236, top: 668, width: 170, height: 350, perspective: 1100,
      perspectiveOrigin: '50% 0%' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: '#0b0d12',
        boxShadow: '0 0 0 2px #2b303b, 0 30px 40px rgb(0 0 0 / 0.55)',
        transform: `translate(${buzz.x}px, ${buzz.y}px) rotateX(63deg) rotateZ(${-9 + buzz.angle}deg)`,
        transformOrigin: '50% 100%' }}>
        <div style={{ position: 'absolute', inset: 6, borderRadius: 21, overflow: 'hidden', background: '#07090d' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: glow }}>
            <LockScreen t={t} />
          </div>
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, rgb(255 255 255 / 0.12), transparent 40%)' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: -60, top: 200, width: 290, height: 120, borderRadius: '50%',
        background: '#a8c0ff', opacity: glow * 0.16, filter: 'blur(30px)' }} />
    </div>
  )
}
