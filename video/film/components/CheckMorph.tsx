// Görev tamamlandı → onay işareti büyür, ekranı kaplar ve çözülerek bir sonraki sahneyi açar.
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

export const CheckMorph: React.FC = () => {
  const t = useCurrentFrame() / 30
  const pop = interpolate(t, [0, 0.25], [0, 1], clamp)
  const grow = interpolate(t, [0.45, 0.95], [1, 26], { ...clamp, easing: (x) => x * x * x })
  const fade = interpolate(t, [0.95, 1.3], [1, 0], clamp)
  const draw = interpolate(t, [0.08, 0.38], [0, 1], clamp)
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fade }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: COLOR.signature, transform: `scale(${pop * grow})`,
        boxShadow: '0 20px 60px rgba(250,204,21,0.35)', display: 'grid', placeItems: 'center' }}>
        <svg viewBox="0 0 24 24" width={64} height={64} fill="none" stroke={COLOR.deep} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: interpolate(t, [0.5, 0.7], [1, 0], clamp) }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray={24} strokeDashoffset={24 * (1 - draw)} />
        </svg>
      </div>
    </AbsoluteFill>
  )
}
