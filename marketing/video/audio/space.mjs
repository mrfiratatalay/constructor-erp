import { RATE, stereo } from './dsp.mjs'

/**
 * Oda hissi. Yankı (Freeverb): sekiz geri beslemeli gecikme hattı sesi odanın duvarlarından dönüyormuş gibi
 * çoğaltır, dört tüm-geçiren süzgeç yoğunlaştırır. Sağ kanalın hatları biraz uzundur: ses geniş duyulur.
 */
const COMBS = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617]
const ALLPASSES = [556, 441, 341, 225]
const SPREAD = 23

export function reverb(input, { room = 0.84, damp = 0.25 } = {}) {
  const out = stereo(input[0].length)
  for (let channel = 0; channel < 2; channel++) {
    const offset = channel === 0 ? 0 : SPREAD
    const scale = (value) => Math.round(((value + offset) * RATE) / 44100)
    const combs = COMBS.map((length) => ({ buffer: new Float32Array(scale(length)), index: 0, store: 0 }))
    const allpasses = ALLPASSES.map((length) => ({ buffer: new Float32Array(scale(length)), index: 0 }))
    const source = input[channel]
    for (let index = 0; index < source.length; index++) {
      const dry = source[index] * 0.015
      let wet = 0
      for (const comb of combs) wet += runComb(comb, dry, room, damp)
      for (const allpass of allpasses) wet = runAllpass(allpass, wet)
      out[channel][index] = wet
    }
  }
  return out
}

function runComb(comb, input, feedback, damp) {
  const output = comb.buffer[comb.index]
  comb.store = output * (1 - damp) + comb.store * damp
  comb.buffer[comb.index] = input + comb.store * feedback
  comb.index = (comb.index + 1) % comb.buffer.length
  return output
}

function runAllpass(allpass, input) {
  const delayed = allpass.buffer[allpass.index]
  allpass.buffer[allpass.index] = input + delayed * 0.5
  allpass.index = (allpass.index + 1) % allpass.buffer.length
  return delayed - input
}

/**
 * Ping-pong eko: ses bir sağdan bir soldan, her dönüşte biraz kısılarak tekrar eder. time saniye, feedback 0..1.
 * Tizi her dönüşte biraz yumuşar (tek kutuplu alçak geçiren): eko önündeki sesle yarışmaz.
 */
export function pingPong(input, { time = 0.1875, feedback = 0.35, tone = 0.35 } = {}) {
  const out = stereo(input[0].length)
  const length = Math.round(time * RATE)
  const lines = [new Float32Array(length), new Float32Array(length)]
  const soft = [0, 0]
  for (let index = 0; index < input[0].length; index++) {
    const slot = index % length
    const [fromLeft, fromRight] = [lines[0][slot], lines[1][slot]]
    soft[0] += (fromLeft - soft[0]) * (1 - tone)
    soft[1] += (fromRight - soft[1]) * (1 - tone)
    const mono = (input[0][index] + input[1][index]) / 2
    lines[0][slot] = mono + soft[1] * feedback
    lines[1][slot] = soft[0] * feedback
    out[0][index] = fromLeft
    out[1][index] = fromRight
  }
  return out
}
