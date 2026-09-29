import manifest from '../captures/ilerleme.json'
import { capturesOf } from '../kit/captures'
import { centerOf } from '../kit/motion'
import type { Tap } from '../kit/pointerPath'
import { PHONE } from '../kit/Phone'

/** İlerleme çekiminin defteri (capture/ilerleme.mjs yazar). */
export const shots = capturesOf(manifest)

export const tapOf = (name: string, at: number): Tap => ({ at, ...centerOf(shots.box(name)) })

/** "Günlük İlerleme" penceresinin kayan içeriği: pencerenin başlığının altından ekranın dibine. */
const content = shots.box('phone-sheet-content')
export const SHEET_CONTENT = { top: content.y, bottom: PHONE.app.height }
