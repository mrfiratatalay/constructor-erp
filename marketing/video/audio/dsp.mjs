/**
 * Sesin yapı taşları. Ses saniyede RATE tane sayıdır (-1..1); her enstrüman bu sayıları hesaplayan küçük bir
 * fonksiyondur. Kütüphane yok: osilatör, filtre, yankı ve karıştırma burada, birkaç satırda.
 */
export const RATE = 48000

export const samples = (seconds) => Math.round(seconds * RATE)
export const midiHz = (note) => 440 * 2 ** ((note - 69) / 12)
export const stereo = (length) => [new Float32Array(length), new Float32Array(length)]

/** Tekrarlanabilir gürültü (xorshift): aynı tohum her seferinde aynı sesi verir. */
export function noise(seed = 1) {
  let state = seed >>> 0 || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return ((state >>> 0) / 4294967296) * 2 - 1
  }
}

/** Testere dişi dalga, bant sınırlı (polyBLEP): tiz notalarda cızırtı (aliasing) yapmaz. */
export function saw(freq, phase = 0) {
  const step = freq / RATE
  return () => {
    phase += step
    if (phase >= 1) phase -= 1
    return 2 * phase - 1 - polyBlep(phase, step)
  }
}

function polyBlep(t, dt) {
  if (t < dt) {
    const x = t / dt
    return x + x - x * x - 1
  }
  if (t > 1 - dt) {
    const x = (t - 1) / dt
    return x * x + x + x + 1
  }
  return 0
}

/** İkinci dereceden filtre (RBJ): lowpass tizi keser, highpass bası, bandpass ortayı bırakır. */
export class Filter {
  constructor(type, freq, q = 0.707) {
    this.type = type
    this.x1 = this.x2 = this.y1 = this.y2 = 0
    this.tune(freq, q)
  }

  tune(freq, q = this.q) {
    this.q = q
    const w = (2 * Math.PI * Math.min(Math.max(freq, 20), RATE * 0.45)) / RATE
    const cos = Math.cos(w)
    const alpha = Math.sin(w) / (2 * q)
    const [b0, b1, b2] = coefficients(this.type, cos, alpha)
    const a0 = 1 + alpha
    Object.assign(this, { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: (-2 * cos) / a0, a2: (1 - alpha) / a0 })
  }

  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2
    this.x2 = this.x1
    this.x1 = x
    this.y2 = this.y1
    this.y1 = y
    return y
  }
}

function coefficients(type, cos, alpha) {
  if (type === 'lowpass') return [(1 - cos) / 2, 1 - cos, (1 - cos) / 2]
  if (type === 'highpass') return [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2]
  return [alpha, 0, -alpha]
}

/** Tek sesli (mono) bir parçayı stereo kanala yerleştirir: start saniyede, gain kadar, pan -1 (sol) .. 1 (sağ). */
export function place(target, source, start, gain = 1, pan = 0) {
  const offset = samples(start)
  const left = gain * Math.cos(((pan + 1) * Math.PI) / 4)
  const right = gain * Math.sin(((pan + 1) * Math.PI) / 4)
  const end = Math.min(source.length, target[0].length - offset)
  for (let index = Math.max(0, -offset); index < end; index++) {
    target[0][offset + index] += source[index] * left
    target[1][offset + index] += source[index] * right
  }
}

/** Bir stereo parçayı ötekinin üstüne ekler. */
export function mixInto(target, source, gain = 1) {
  for (let channel = 0; channel < 2; channel++) {
    for (let index = 0; index < target[channel].length; index++) target[channel][index] += source[channel][index] * gain
  }
}

/** Mono ses üretir: length saniye, her örnek için fn(t, i). */
export function render(length, fn) {
  const out = new Float32Array(samples(length))
  for (let index = 0; index < out.length; index++) out[index] = fn(index / RATE, index)
  return out
}

/** En yüksek noktayı ceiling'e getirir; üstüne yumuşak kırpma (tanh) ile ani tepeler ezilmeden yuvarlanır. */
export function master(buffer, ceiling = 0.89) {
  let peak = 1e-9
  for (const channel of buffer) for (const value of channel) peak = Math.max(peak, Math.abs(value))
  for (const channel of buffer) {
    for (let index = 0; index < channel.length; index++) channel[index] = Math.tanh((channel[index] / peak) * 1.1) * ceiling
  }
  return buffer
}
