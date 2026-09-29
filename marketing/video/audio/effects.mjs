import { Filter, master, mixInto, noise, place, RATE, render, samples, stereo } from './dsp.mjs'
import { bell } from './instruments.mjs'
import { reverb } from './space.mjs'

/**
 * Ses efektleri: videodaki her hareketin sesi. Hepsi Do majör ile uyumludur, müziğin üstünde "yanlış nota" gibi
 * durmaz. Altı seçim dokunuşu pentatonik dizide birer basamak yükselir: şef dokundukça küçük bir melodi çıkar.
 */
const TAU = 2 * Math.PI
const PICK_NOTES = [84, 86, 88, 91, 93, 96]

/** Telefona dokunuş: iPhone'un yumuşak tıkı gibi kısa, boğuk; altında hafif bir "tup". */
function tap() {
  const grain = noise(21)
  return render(0.1, (t) => {
    const tick = Math.sin(TAU * (1100 + 400 * Math.exp(-t / 0.01)) * t) * Math.exp(-t / 0.01)
    const thump = Math.sin(TAU * 160 * t) * Math.exp(-t / 0.018) * 0.35
    return tick * 0.6 + thump + grain() * Math.exp(-t / 0.002) * 0.12
  })
}

/** Fare tıkı: basış ve 70 ms sonra biraz daha hafif bırakış. */
function click() {
  const grain = noise(23)
  const band = new Filter('bandpass', 3500, 2)
  const hit = (t) => band.run(grain()) * Math.exp(-t / 0.0025) * 2 + Math.sin(TAU * 2200 * t) * Math.exp(-t / 0.004) * 0.5
  return render(0.15, (t) => (t < 0.07 ? hit(t) : hit(t - 0.07) * 0.6))
}

/** Saat: "tik" biraz tiz, "tak" biraz pes; tahta blok gibi kısa. */
function clock(freq) {
  const grain = noise(29)
  const band = new Filter('bandpass', freq, 6)
  return render(0.1, (t) => band.run(grain()) * Math.exp(-t / 0.012) * 3 + Math.sin(TAU * freq * t) * Math.exp(-t / 0.02) * 0.4)
}

/** Hava sesi: filtrelenmiş gürültü, from'dan to'ya kayar; pencere açılırken yükselir, kapanırken iner. */
function whoosh(length, from, to, seed = 31) {
  const grain = noise(seed)
  const band = new Filter('bandpass', from, 1.4)
  return render(length, (t, index) => {
    const amount = t / length
    if (index % 32 === 0) band.tune(from * (to / from) ** amount)
    return band.run(grain()) * Math.sin(Math.PI * amount) ** 1.5 * 1.6
  })
}

/** Seçim dokunuşu: dokunuşun üstünde pentatonikte bir basamak yükselen çan. */
function pick(step) {
  const out = new Float32Array(samples(0.6))
  place1(out, tap(), 0, 0.8)
  place1(out, bell(PICK_NOTES[step], 0.3), 0.004, 0.5)
  return out
}

/** Başarı: çan akoru yukarı doğru, arkasında yankı. notes aralıklı çalınır. */
function arpeggio(notes, spacing, decay, tail = 2) {
  const out = stereo(samples(tail))
  notes.forEach((note, index) => place(out, bell(note, decay), index * spacing, 0.6, (index - notes.length / 2) * 0.2))
  mixInto(out, reverb(out, { room: 0.86 }), 0.5)
  return out
}

/** Işık çizgisi: 0,8 saniyede tırmanan vızıltı; müziğin düşüşüne vardığı anda biter. */
function zip() {
  const grain = noise(37)
  const band = new Filter('bandpass', 400, 2)
  let phase = 0
  return render(0.8, (t, index) => {
    const amount = t / 0.8
    if (index % 32 === 0) band.tune(400 * 8 ** amount)
    phase += (TAU * 350 * 7.5 ** amount) / RATE
    return (Math.sin(phase) * 0.35 + band.run(grain()) * 0.9) * amount ** 1.6
  })
}

/** Cetvel dolarken: sıklaşan ve tizleşen yumuşak tıkırtılar; 2 saniye, cetvelin dolmasıyla aynı. */
function fill() {
  const out = new Float32Array(samples(2))
  const jitter = noise(41)
  for (let t = 0, gap = 0.07; t < 1.95; t += gap, gap = Math.max(0.032, gap * 0.965)) {
    const freq = 1300 + 1300 * (t / 2) + jitter() * 60
    const level = Math.min(1, t / 0.15) * Math.min(1, (2 - t) / 0.3) * 0.5
    place1(out, render(0.03, (s) => Math.sin(TAU * freq * s) * Math.exp(-s / 0.006)), t, level)
  }
  return out
}

/** Dosya çıkışı: kabarcık "pop"u, arkasından birkaç pırıltı. */
function pop() {
  const out = stereo(samples(1.4))
  place(out, render(0.2, (t) => Math.sin(TAU * (300 + 600 * (1 - Math.exp(-t / 0.02))) * t) * Math.exp(-t / 0.05)), 0, 0.9)
  ;[96, 100, 103].forEach((note, index) => place(out, bell(note, 0.25), 0.05 + index * 0.06, 0.25, index - 1))
  mixInto(out, reverb(out), 0.35)
  return out
}

/** Mono parçayı mono parçanın üstüne ekler. */
function place1(target, source, start, gain) {
  const offset = samples(start)
  for (let index = 0; index < source.length && offset + index < target.length; index++) {
    target[offset + index] += source[index] * gain
  }
}

const both = (mono) => [mono, Float32Array.from(mono)]

/** Adı ve üreticisi: build.mjs her birini public/audio/sfx/<ad>.wav olarak yazar. */
export const SOUNDS = {
  tap: () => both(tap()),
  click: () => both(click()),
  tick: () => both(clock(2600)),
  tock: () => both(clock(1900)),
  whoosh: () => both(whoosh(0.5, 300, 1800, 31)),
  'sheet-up': () => both(whoosh(0.3, 500, 2600, 33)),
  'sheet-down': () => both(whoosh(0.25, 2200, 500, 35)),
  scroll: () => both(whoosh(0.5, 700, 1500, 39)),
  ...Object.fromEntries(PICK_NOTES.map((_, step) => [`pick-${step + 1}`, () => both(pick(step))])),
  cascade: () => arpeggio([84, 88, 91, 96, 100], 0.05, 0.35, 1.6),
  chime: () => arpeggio([84, 88, 91, 96, 103], 0.07, 1.1, 2.6),
  shine: () => arpeggio([96, 100, 103, 108], 0.05, 0.8, 2.2),
  zip: () => both(zip()),
  fill: () => both(fill()),
  pop,
}

export const finish = (sound) => master(sound, 0.89)
