import manifest from '../captures/saha.json'
import { capturesOf } from '../kit/captures'
import { centerOf } from '../kit/motion'
import type { Tap } from '../kit/pointerPath'

/** Saha çekiminin defteri (capture/saha.mjs yazar). */
export const shots = capturesOf(manifest)

export const tapOf = (name: string, at: number): Tap => ({ at, ...centerOf(shots.box(name)) })
