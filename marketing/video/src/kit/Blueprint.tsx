import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'
import { progress } from './motion'

/**
 * Uygulamanın koyu alanlarındaki teknik çizim ızgarası (shared/styles/blueprint.css), videoda kendini çizer: ortadan
 * dışa doğru açılır, sonra çok yavaş kayar. İnce çizgiler 48, kalınlar 240 pikselde bir; şantiye projesi hissi verir,
 * önündeki ekranı bastırmaz.
 */
export const Blueprint: React.FC<{ drawFrom?: number }> = ({ drawFrom = 0 }) => {
  const frame = useCurrentFrame()
  const reach = progress(frame, drawFrom, drawFrom + 40) * 140
  const drift = (frame * 0.25) % 48
  const grid = [
    'linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px)',
    'linear-gradient(90deg, rgb(255 255 255 / 0.06) 1px, transparent 1px)',
    'linear-gradient(rgb(255 255 255 / 0.09) 2px, transparent 2px)',
    'linear-gradient(90deg, rgb(255 255 255 / 0.09) 2px, transparent 2px)',
  ].join(', ')
  const mask = `radial-gradient(circle at 50% 50%, #000 ${reach}%, transparent ${reach + 12}%)`
  return (
    <AbsoluteFill style={{ background: COLOR.deep }}>
      <AbsoluteFill
        style={{
          backgroundImage: grid,
          backgroundSize: '48px 48px, 48px 48px, 240px 240px, 240px 240px',
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 58% 48%, rgb(30 64 175 / 0.55), transparent 70%), radial-gradient(ellipse at center, transparent 55%, rgb(5 10 30 / 0.55))',
        }}
      />
    </AbsoluteFill>
  )
}
