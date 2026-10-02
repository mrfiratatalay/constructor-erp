import { useFilmTime } from '../../../film/clock'
import { easeOutCubic, progress } from '../../../motion/ease'

type Props = { at: number; name: string; detail: string }

/** Ekranın üstünden inen gelen arama bandı: mesajlar okunurken bir de telefon çalar. */
export const CallBanner = ({ at, name, detail }: Props) => {
  const t = useFilmTime()
  const enter = progress(t, at, 0.34, easeOutCubic)
  if (enter <= 0) return null
  const pulse = 1 + Math.max(0, Math.sin((t - at) * 9)) * 0.06
  return (
    <div style={{ position: 'absolute', left: 12, right: 12, top: 52, padding: '16px 18px', borderRadius: 26,
      background: 'rgb(17 24 39 / 0.96)', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 14,
      transform: `translateY(${(1 - enter) * -150}px)`, boxShadow: '0 18px 40px rgb(0 0 0 / 0.4)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: '#475569', display: 'grid', placeItems: 'center',
        fontSize: 19, fontWeight: 700, transform: `scale(${pulse})` }}>ŞŞ</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 14, color: '#94a3b8' }}>{detail}</div>
      </div>
      <div style={{ width: 46, height: 46, borderRadius: 23, background: '#ef4444', display: 'grid', placeItems: 'center',
        fontSize: 20 }}>✕</div>
      <div style={{ width: 46, height: 46, borderRadius: 23, background: '#22c55e', display: 'grid', placeItems: 'center',
        fontSize: 20, transform: `scale(${pulse})` }}>✆</div>
    </div>
  )
}
