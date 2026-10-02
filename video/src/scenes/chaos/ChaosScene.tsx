import type { ComponentType } from 'react'
import { AbsoluteFill } from 'remotion'
import { ClockOverride, useFilmTime } from '../../film/clock'
import cues from '../../film/cues/chaos.json'
import { progress } from '../../motion/ease'
import { Vignette } from '../../effects/Vignette'
import { ChatShot } from './ChatShot'
import { DepotShot } from './DepotShot'
import { OverloadShot } from './OverloadShot'
import { PhotoShot } from './PhotoShot'
import { RosterShot } from './RosterShot'
import { SheetShot } from './SheetShot'
import { WideShot } from './WideShot'

const SHOTS: Record<string, ComponentType> = {
  wide: WideShot,
  chat: ChatShot,
  sheet: SheetShot,
  roster: RosterShot,
  depot: DepotShot,
  photo: PhotoShot,
  overload: OverloadShot,
}

const BRAKE = 0.18

/** Donma ani değil: hareket 0,18 saniyede yavaşlayarak durur (hız 1'den 0'a iner). */
const freezeTime = (t: number): number => {
  if (t <= cues.freeze) return t
  const u = Math.min(1, (t - cues.freeze) / BRAKE)
  return cues.freeze + (BRAKE / 2) * (1 - (1 - u) ** 2)
}

const currentShot = (t: number): ComponentType | null => {
  const entry = Object.entries(cues.shots).find(([, [from, to]]) => t >= from && t < to)
  return entry ? (SHOTS[entry[0]] ?? null) : null
}

/**
 * 0 – 15,95 sn, KAOS. Planlar arasında sert kesmeler; 13,3. saniyede her şey donar, 13,95'te siyaha kesilir.
 * Donma, saati durdurarak yapılır: bütün çizimler aynı saati okuduğu için tek satırla her şey birlikte durur.
 */
export const ChaosScene = () => {
  const t = useFilmTime()
  if (t >= cues.black) return <AbsoluteFill style={{ background: '#000' }} />
  const frozen = freezeTime(t)
  const Shot = currentShot(frozen)
  const fadeIn = progress(t, cues.fadeIn[0], cues.fadeIn[1] - cues.fadeIn[0])
  const stillness = progress(t, cues.freeze, 0.5)
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: fadeIn, filter: `saturate(${1 - stillness * 0.55}) brightness(${1 - stillness * 0.18})` }}>
        <ClockOverride time={frozen}>{Shot && <Shot />}</ClockOverride>
      </AbsoluteFill>
      <Vignette strength={0.5 + stillness * 0.25} />
    </AbsoluteFill>
  )
}
