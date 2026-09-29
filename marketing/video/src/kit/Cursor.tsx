import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { pointerAt, rippleAt, type Tap } from './pointerPath'

const TIMING = { lead: 22, trail: 16, travel: 20, linger: 110, arc: 240 }

/** Masaüstünde imleç: kavisle hedefe gider, tıklayınca hafifçe basılır ve etrafında halka yayılır. */
export const Cursor: React.FC<{ clicks: Tap[] }> = ({ clicks }) => {
  const frame = useCurrentFrame()
  const state = pointerAt(frame, clicks, TIMING)
  const ripple = rippleAt(frame, clicks, 16)
  return (
    <>
      {ripple && (
        <div
          style={{
            position: 'absolute',
            left: ripple.x - 12 - ripple.amount * 26,
            top: ripple.y - 12 - ripple.amount * 26,
            width: 24 + ripple.amount * 52,
            height: 24 + ripple.amount * 52,
            borderRadius: '50%',
            background: COLOR.primary,
            opacity: 0.35 * (1 - ripple.amount),
          }}
        />
      )}
      {state.visible && (
        <svg
          width="34"
          height="46"
          viewBox="0 0 20 27"
          style={{
            position: 'absolute',
            left: state.x - 3,
            top: state.y - 2,
            opacity: state.opacity,
            transform: `scale(${1 - 0.12 * state.press})`,
            transformOrigin: '3px 2px',
            filter: 'drop-shadow(0 3px 4px rgb(0 0 0 / 0.35))',
          }}
        >
          <path d="M1.5 1.5v20.2l5.1-4.9 3.6 8.1 3.6-1.6-3.5-7.9h7.1z" fill={COLOR.white} stroke={COLOR.ink} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
    </>
  )
}
