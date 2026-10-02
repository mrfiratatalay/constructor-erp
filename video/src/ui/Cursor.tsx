import { useFilmTime } from '../film/clock'
import { clamp01, easeOutCubic } from '../motion/ease'

type Props = {
  x: number
  y: number
  /** Tıklama anları (saniye): imleç hafifçe küçülür, altında çok hafif bir halka açılır. */
  clicks?: number[]
  opacity?: number
}

/** Tıklamanın görsel geri bildirimi: abartısız, 0,35 sn'lik ince halka. */
const clickState = (t: number, clicks: number[]) => {
  const last = [...clicks].reverse().find((at) => t >= at)
  if (last === undefined) return { press: 0, ring: 0 }
  const since = t - last
  return { press: since < 0.16 ? 1 - Math.abs(since - 0.08) / 0.08 : 0, ring: since < 0.35 ? since / 0.35 : 0 }
}

/** Fare imleci: beyaz ok, ince koyu kenar, yumuşak gölge. Konumu sahne belirler; burada yalnızca çizimi var. */
export const Cursor = ({ x, y, clicks = [], opacity = 1 }: Props) => {
  const t = useFilmTime()
  const { press, ring } = clickState(t, clicks)
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none' }}>
      {ring > 0 && (
        <div style={{ position: 'absolute', left: -24, top: -24, width: 48, height: 48, borderRadius: 24,
          border: '2px solid rgb(255 255 255 / 0.9)', opacity: 1 - ring,
          transform: `scale(${0.4 + easeOutCubic(clamp01(ring)) * 0.8})`,
          boxShadow: '0 0 0 1px rgb(15 23 42 / 0.25)' }} />
      )}
      <svg width={30} height={40} viewBox="0 0 30 40" style={{ transform: `scale(${1 - press * 0.12})`,
        transformOrigin: '2px 2px', filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.35))' }}>
        <path d="M2 2 L2 31 L9.5 24 L14.5 36 L19.5 34 L14.6 22.5 L24.5 22.5 Z" fill="#fff" stroke="#0f172a"
          strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </div>
  )
}
