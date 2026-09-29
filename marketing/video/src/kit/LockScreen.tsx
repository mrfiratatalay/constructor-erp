import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress, settle } from './motion'
import { PHONE } from './Phone'

type LockScreenProps = {
  time: string
  day: string
  notice: { at: number; from: string; text: string; link: string }
}

/**
 * Yeni ustanın telefonu, uygulama açılmadan önce: kilit ekranı, saat ve tarih; gelen mesajın bildirimi yukarıdan
 * kayarak iner. Bir mesajlaşma uygulamasının kopyası değildir: sade bir bildirim kartı, marka ve logo yok.
 */
export const LockScreen: React.FC<LockScreenProps> = ({ time, day, notice }) => {
  const frame = useCurrentFrame()
  const drop = progress(frame, notice.at, notice.at + 14, settle)
  const date = new Date(`${day}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
  return (
    <div style={{ position: 'absolute', inset: 0, ...PHONE.app, background: `linear-gradient(160deg, ${COLOR.primary}, ${COLOR.deep} 70%)` }}>
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', color: COLOR.white }}>
        <div style={{ fontSize: 20, fontWeight: 600, opacity: 0.85 }}>{date}</div>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{time}</div>
      </div>
      {drop > 0 && <Notice notice={notice} drop={drop} />}
    </div>
  )
}

const CARD: React.CSSProperties = {
  position: 'absolute',
  left: 12,
  right: 12,
  top: 250,
  display: 'flex',
  gap: 12,
  padding: '14px 16px',
  borderRadius: 22,
  background: 'rgb(255 255 255 / 0.92)',
  boxShadow: '0 12px 30px rgb(0 0 0 / 0.3)',
  color: COLOR.ink,
}

const Notice: React.FC<{ notice: LockScreenProps['notice']; drop: number }> = ({ notice, drop }) => (
  <div style={{ ...CARD, opacity: drop, transform: `translateY(${(1 - drop) * -60}px)` }}>
    <MessageIcon />
    <div style={{ minWidth: 0, fontSize: 14, lineHeight: 1.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
        <span>{notice.from}</span>
        <span style={{ fontWeight: 500, opacity: 0.55 }}>şimdi</span>
      </div>
      <div>{notice.text}</div>
      <div style={{ color: COLOR.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notice.link}</div>
    </div>
  </div>
)

const MessageIcon: React.FC = () => (
  <div style={{ flex: 'none', display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 10, background: COLOR.primary }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLOR.white} strokeWidth="2.2" strokeLinejoin="round">
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  </div>
)
