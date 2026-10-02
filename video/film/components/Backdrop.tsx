// Ürün sahnelerinin zemini: ürünün koyu lacivert, ince teknik çizim ızgaralı paneli (blueprint.css) ve yumuşak ışık.
import { useCurrentFrame } from 'remotion'
import { COLOR } from '../theme'

export const Backdrop: React.FC<{ glow?: [number, number]; drift?: number }> = ({ glow = [22, 12], drift = 0.15 }) => {
  const shift = useCurrentFrame() * drift
  return (
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 90% at ${glow[0]}% ${glow[1]}%, #1f3a8f 0%, ${COLOR.deep} 38%, ${COLOR.ink} 100%)` }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.9,
        backgroundImage: `linear-gradient(${COLOR.line} 1px, transparent 1px), linear-gradient(90deg, ${COLOR.line} 1px, transparent 1px)`,
        backgroundSize: '56px 56px', backgroundPosition: `${shift}px ${shift * 0.4}px` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 55%, transparent 40%, rgba(5,10,25,0.55) 100%)' }} />
    </div>
  )
}
