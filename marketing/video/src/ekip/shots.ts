import manifest from '../captures/ekip.json'
import { capturesOf } from '../kit/captures'
import { centerOf } from '../kit/motion'
import type { Tap } from '../kit/pointerPath'

/** Ekip çekiminin defteri (capture/ekip.mjs yazar). */
export const shots = capturesOf(manifest)

export const tapOf = (name: string, at: number): Tap => ({ at, ...centerOf(shots.box(name)) })

/** Çekimin günü: ustanın kilit ekranındaki tarih odur. */
export const CAPTURE_DAY = shots.day()

/**
 * Firmanın bağlantısı videoda kısaltılmış görünür (adres/katil/…); tamamı patronun ekranındaki pencerede yazar.
 * Çekimdeki adresten gelir: gerçek adresle yeniden çekilince video da onu yazar.
 */
export const LINK_TEXT = shots.link().replace(/^https?:\/\//, '').replace(/[^/]+$/, '…')
