import { AbsoluteFill, useCurrentFrame } from 'remotion'

const SEEDS = [3, 11, 23, 37, 41, 59]

const noiseTile = (seed: number): string => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/></filter><rect width='256' height='256' filter='url(%23n)'/></svg>`
  return `url("data:image/svg+xml;utf8,${svg}")`
}

/**
 * İnce film greni: koyu lacivert geçişlerde 8 bit videonun bantlaşmasını kırar ve çizime fotoğraf dokusu verir.
 * Her kare başka bir desen (6 tohum döner), göz bunu hareketli gren olarak görür.
 */
export const FilmGrain = ({ opacity = 0.07 }: { opacity?: number }) => {
  const frame = useCurrentFrame()
  const seed = SEEDS[frame % SEEDS.length]
  const offset = (frame * 37) % 256
  return (
    <AbsoluteFill
      style={{
        backgroundImage: noiseTile(seed),
        backgroundPosition: `${offset}px ${(offset * 3) % 256}px`,
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}
