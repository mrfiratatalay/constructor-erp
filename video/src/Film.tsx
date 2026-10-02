import type { ComponentType } from 'react'
import { AbsoluteFill, Audio, getRemotionEnvironment, staticFile } from 'remotion'
import { FilmClock, useFilmTime } from './film/clock'
import { FilmGrain } from './effects/FilmGrain'
import { AttendanceScene } from './scenes/attendance/AttendanceScene'
import { BrandScene } from './scenes/brand/BrandScene'
import { ChaosScene } from './scenes/chaos/ChaosScene'
import { ClosingScene } from './scenes/finale/ClosingScene'
import { DevicesScene } from './scenes/finale/DevicesScene'
import { MATERIALS } from './scenes/plans/materials'
import { ONBOARDING } from './scenes/plans/onboarding'
import { SITES } from './scenes/plans/sites'
import { PRODUCTION, TASKS } from './scenes/plans/work'
import { UiScene, type UiPlan } from './ui/UiScene'

type Scene = { from: number; to: number; component: ComponentType }

const planScene = (plan: UiPlan): Scene => ({ from: plan.from, to: plan.to, component: () => <UiScene plan={plan} /> })

/**
 * Filmin sahneleri (saniye). Geçişlerde sahneler üst üste biner: sonraki sahne öncekinin üstünde belirir.
 * Part'lar: 1 kaos + marka (0–23), 2 kurulum (23–37,5), 3 şantiye (37,5–50,6), 4 yoklama (50,6–62,5),
 * 5 malzeme (62,5–76,5), 6 imalat + görev (76,5–95,5), 7 üç cihaz + kapanış (95,5–120).
 */
const SCENES: Scene[] = [
  { from: 0, to: 15.95, component: ChaosScene },
  { from: 15.95, to: 23.0, component: BrandScene },
  planScene(ONBOARDING),
  planScene(SITES),
  { from: 50.6, to: 62.9, component: AttendanceScene },
  planScene(MATERIALS),
  planScene(PRODUCTION),
  planScene(TASKS),
  { from: 95.4, to: 106.8, component: DevicesScene },
  { from: 106.15, to: 120, component: ClosingScene },
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
      {/* Studio'da önizleme sesli çalsın. Render'da ses ayrıca (mix.py) üretilip birleştirilir. */}
      {getRemotionEnvironment().isStudio && <Audio src={staticFile('audio/mix/film.wav')} />}
    </FilmClock>
  </AbsoluteFill>
)
