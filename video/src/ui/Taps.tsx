import { useFilmTime } from '../film/clock'
import { clamp01, easeOutCubic } from '../motion/ease'

/** Telefonda parmak dokunuşu: [zaman, x, y] (video pikseli). */
export type Tap = [number, number, number]

/** Dokunuşun izi: kısa bir dolu daire ve dışa açılan ince halka. İmleç yerine telefonun dili. */
export const Taps = ({ taps }: { taps: Tap[] }) => {
  const t = useFilmTime()
  return (
    <>
      {taps.map(([at, x, y]) => {
        const since = t - at
        if (since < -0.12 || since > 0.5) return null
        const press = clamp01(1 - Math.abs(since) / 0.18)
        const ring = easeOutCubic(clamp01(since / 0.5))
        return (
          <div key={at} style={{ position: 'absolute', left: x, top: y }}>
            <div style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: 22,
              background: 'rgb(255 255 255 / 0.55)', boxShadow: '0 0 0 1px rgb(15 23 42 / 0.25)', opacity: press,
              transform: `scale(${0.7 + press * 0.3})` }} />
            {since > 0 && (
              <div style={{ position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: 30,
                border: '2px solid rgb(255 255 255 / 0.85)', opacity: 1 - ring, transform: `scale(${0.6 + ring * 0.9})` }} />
            )}
          </div>
        )
      })}
    </>
  )
}
