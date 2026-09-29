import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { pointerAt, rippleAt, type Tap } from './pointerPath'

const TIMING = { lead: 14, trail: 12, travel: 10, linger: 34, arc: 60 }
const SIZE = 46

/** Telefonda parmak: yarı saydam halka dokunacağı yere süzülür, basınca küçülür ve dalga yayar. */
export const Finger: React.FC<{ taps: Tap[] }> = ({ taps }) => {
  const frame = useCurrentFrame()
  const state = pointerAt(frame, taps, TIMING)
  const ripple = rippleAt(frame, taps)
  return (
    <>
      {ripple && (
        <div
          style={{
            position: 'absolute',
            left: ripple.x - 20 - ripple.amount * 34,
            top: ripple.y - 20 - ripple.amount * 34,
            width: 40 + ripple.amount * 68,
            height: 40 + ripple.amount * 68,
            borderRadius: '50%',
            border: `3px solid ${COLOR.primary}`,
            opacity: 0.55 * (1 - ripple.amount),
          }}
        />
      )}
      {state.visible && (
        <div
          style={{
            position: 'absolute',
            left: state.x - SIZE / 2,
            top: state.y - SIZE / 2,
            width: SIZE,
            height: SIZE,
            borderRadius: '50%',
            background: 'rgb(255 255 255 / 0.55)',
            border: '2px solid rgb(20 26 46 / 0.35)',
            boxShadow: '0 8px 18px rgb(20 26 46 / 0.28)',
            opacity: state.opacity,
            transform: `scale(${1 - 0.2 * state.press})`,
          }}
        />
      )}
    </>
  )
}
