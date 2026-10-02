import { AbsoluteFill } from 'remotion'
import { brand } from '../../theme/colors'

/**
 * Ürünün koyu alanlarındaki teknik çizim ızgarası (shared/styles/blueprint.css), film ölçeğinde: ince ve ana
 * çizgiler, sol üstten yayılan lacivert ışık. Kaostan sonra her şey bu düzenli zeminin üstüne kurulur.
 */
export const BlueprintGrid = ({ opacity = 1, drift = 0 }: { opacity?: number; drift?: number }) => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${brand.deep} 0%, ${brand.night} 70%)` }}>
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: [
          'linear-gradient(rgb(255 255 255 / 0.085) 1px, transparent 1px)',
          'linear-gradient(90deg, rgb(255 255 255 / 0.085) 1px, transparent 1px)',
          'linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '192px 192px, 192px 192px, 48px 48px, 48px 48px',
        backgroundPosition: `${drift}px 0, ${drift}px 0, ${drift}px 0, ${drift}px 0`,
      }}
    />
    <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 15% 0%, rgb(30 64 175 / 0.55), transparent 65%)' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(90% 70% at 50% 55%, transparent 40%, rgb(5 10 25 / 0.55) 100%)' }} />
  </AbsoluteFill>
)
