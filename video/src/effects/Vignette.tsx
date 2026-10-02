import { AbsoluteFill } from 'remotion'

/** Kenarları yumuşakça karartır: göz kadrajın ortasına, anlatılan şeye gider. */
export const Vignette = ({ strength = 0.55, color = '0 0 0' }: { strength?: number; color?: string }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 95% at 50% 46%, transparent 52%, rgb(${color} / ${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
)
