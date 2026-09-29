import manifest from '../captures/yoklama.json'
import { capturesOf } from '../kit/captures'
import { centerOf } from '../kit/motion'
import type { Tap } from '../kit/pointerPath'

/** Yoklama çekiminin defteri (capture/yoklama.mjs yazar). */
export const shots = capturesOf(manifest)

/** Kaydedilmiş bir dokunuşun ortası, videoda hangi karede dokunulacağıyla. */
export const tapOf = (name: string, at: number): Tap => ({ at, ...centerOf(shots.box(name)) })

/** Telefonda kaydırırken yerinde duranlar: üstte başlık ve sekmeler, altta menü ya da toplu işaretleme çubuğu. */
const header = shots.box('phone-header')
export const PHONE_CONTENT = {
  top: header.y + header.height,
  aboveBar: shots.box('phone-bulkbar').y,
  aboveTabbar: shots.box('phone-tabbar').y,
}

/** Çekimin ayı ("2026-09"): ekrandaki puantaj o aydır, indirilen Excel'in adı da. */
export const TODAY_MONTH = shots.day().slice(0, 7)
