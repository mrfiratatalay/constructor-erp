import manifest from '../captures/malzeme.json'
import { capturesOf, type Layer, type Screen } from '../kit/captures'
import { centerOf } from '../kit/motion'
import type { Tap } from '../kit/pointerPath'
import { PHONE } from '../kit/Phone'

/** Malzeme çekiminin defteri (capture/malzeme.mjs yazar). */
export const shots = capturesOf(manifest)

export const tapOf = (name: string, at: number): Tap => ({ at, ...centerOf(shots.box(name)) })

/** Tam ekran pencere hem katman (kayarak gelir) hem ekran (açıldıktan sonra altındaki ekran odur) olarak kullanılır. */
export const screenOf = (layer: Layer): Screen => ({ src: layer.src, ...PHONE.app })
export const layerOf = (screen: Screen): Layer => ({ src: screen.src, box: { x: 0, y: 0, ...PHONE.app } })

/** Sevkiyat formunun kayan içeriği: üstteki "Sevkiyat çıkar" çubuğunun altından ekranın dibine. */
const bar = shots.box('phone-form-bar')
export const FORM_CONTENT = { top: bar.y + bar.height, bottom: PHONE.app.height }

/** Excel'in adı çekimin gününe göredir (uygulama "sevkiyatlar_2026-09-29.xlsx" diye indirir). */
export const EXPORT_NAME = `sevkiyatlar_${shots.day()}.xlsx`
