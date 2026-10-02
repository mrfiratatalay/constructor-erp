import { AbsoluteFill } from 'remotion'

/**
 * Yakın planların zemini: masaya kuşbakışı. Koyu ahşap, jaluziden düşen çapraz ışık şeritleri, kenarlarda gölge.
 * Geniş plandaki ışıkla tutarlı: aynı sabah, aynı masa.
 */
export const DeskSurface = ({ shift = 0 }: { shift?: number }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 55% 40%, #4a392d 0%, #2c2119 55%, #140f0b 100%)' }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          'repeating-linear-gradient(176deg, rgb(0 0 0 / 0.1) 0px, rgb(0 0 0 / 0) 3px, rgb(0 0 0 / 0.06) 9px, rgb(0 0 0 / 0) 14px)',
        opacity: 0.9,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          'repeating-linear-gradient(118deg, rgb(255 210 150 / 0) 0px, rgb(255 210 150 / 0) 190px, rgb(255 210 150 / 0.09) 260px, rgb(255 210 150 / 0) 330px)',
        backgroundPosition: `${shift}px 0`,
        filter: 'blur(22px)',
        mixBlendMode: 'screen',
      }}
    />
  </AbsoluteFill>
)
