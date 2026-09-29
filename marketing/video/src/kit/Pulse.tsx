import { useCurrentFrame } from 'remotion'
import { progress } from './motion'

/**
 * "Tamam" anının dalgası: bir noktanın etrafında iki halka art arda genişleyip söner. Rengi anlamıdır: yeşil, yoklama
 * tamam demektir (uygulamadaki halka da o an yeşile döner).
 */
export const Pulse: React.FC<{ at: { x: number; y: number }; radius: number; color: string; from: number }> = ({
  at,
  radius,
  color,
  from,
}) => {
  const frame = useCurrentFrame()
  return (
    <>
      {[0, 9].map((delay) => {
        const amount = progress(frame, from + delay, from + delay + 26)
        if (amount <= 0 || amount >= 1) return null
        const size = radius * 2 * (1 + amount * 1.6)
        return (
          <div
            key={delay}
            style={{
              position: 'absolute',
              left: at.x - size / 2,
              top: at.y - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              border: `${4 * (1 - amount) + 1}px solid ${color}`,
              opacity: 1 - amount,
            }}
          />
        )
      })}
    </>
  )
}
