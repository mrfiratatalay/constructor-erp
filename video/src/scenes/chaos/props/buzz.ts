import cues from '../../../film/cues/chaos.json'
import { hash } from '../../../motion/random'

type Buzz = { t: number; dur: number }

const buzzes: Buzz[] = cues.sfx
  .filter((cue) => cue.kind === 'vibrate')
  .map((cue) => ({ t: cue.t, dur: cue.dur ?? 0.3 }))

/** Titreşim anında telefonun kaydığı küçük mesafe (piksel): ses efektiyle aynı çizelgeden gelir. */
export const buzzOffset = (t: number, seed = 0): { x: number; y: number; angle: number } => {
  const active = buzzes.some((buzz) => t >= buzz.t && t <= buzz.t + buzz.dur)
  if (!active) return { x: 0, y: 0, angle: 0 }
  const tick = Math.floor(t * 60) + seed
  return { x: (hash(tick) - 0.5) * 3.2, y: (hash(tick + 7) - 0.5) * 2.2, angle: (hash(tick + 13) - 0.5) * 1.2 }
}

/** Telefon ekranı en son ne zaman uyandı: bildirim gelince yanar, birkaç saniye sonra kararır. */
export const screenGlow = (t: number): number => {
  const wakes = [...cues.phoneNotifications.map((note) => note.t), ...cues.overloadCards].filter((wake) => wake <= t)
  if (wakes.length === 0) return 0
  const since = t - wakes[wakes.length - 1]
  return Math.min(1, since / 0.12) * (since > 6 ? Math.max(0, 1 - (since - 6) / 0.5) : 1)
}
