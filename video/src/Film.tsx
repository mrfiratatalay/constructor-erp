import type { ComponentType } from 'react'
import { AbsoluteFill } from 'remotion'
import { FilmClock, useFilmTime } from './film/clock'
import { FilmGrain } from './effects/FilmGrain'
import { BrandScene } from './scenes/brand/BrandScene'
import { ChaosScene } from './scenes/chaos/ChaosScene'
import { ComingSoon } from './scenes/ComingSoon'

type Scene = { from: number; to: number; component: ComponentType }

/** Filmin bölümleri (saniye). Her part tamamlandıkça buraya kendi sahnesiyle girer. */
const SCENES: Scene[] = [
  { from: 0, to: 15.95, component: ChaosScene },
  { from: 15.95, to: 23.0, component: BrandScene },
  { from: 23.0, to: 120, component: ComingSoon },
]

const ActiveScenes = () => {
  const t = useFilmTime()
  return (
    <>
      {SCENES.filter((scene) => t >= scene.from && t < scene.to).map(({ from, component: Scene }) => (
        <Scene key={from} />
      ))}
    </>
  )
}

/** Tek parça film: 120 saniye, 1920×1080, 30 fps. Part'lar bu kompozisyonun kare aralıkları olarak render edilir. */
export const Film = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <style>{'*, *::before, *::after { box-sizing: border-box; }'}</style>
    <FilmClock>
      <ActiveScenes />
      <FilmGrain />
    </FilmClock>
  </AbsoluteFill>
)
