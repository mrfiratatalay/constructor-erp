import { Filter, midiHz, noise, RATE, render, saw } from './dsp.mjs'

/**
 * Enstrümanlar: her biri tek bir notayı mono ses olarak döndürür. Hepsi aynı üç fikirden yapılır: bir kaynak
 * (sinüs, testere, gürültü), onu yumuşatan bir filtre, sesin zamanla nasıl söndüğünü söyleyen bir zarf.
 */
const TAU = 2 * Math.PI

/** Bas davul: 150 Hz'den 45 Hz'e hızla düşen sinüs ("düm") ve başında küçük bir tık. */
export function kick() {
  let phase = 0
  const click = noise(7)
  return render(0.45, (t) => {
    phase += (TAU * (45 + 110 * Math.exp(-t / 0.035))) / RATE
    const body = Math.sin(phase) * Math.exp(-t / 0.2)
    return Math.tanh(1.6 * body + click() * Math.exp(-t / 0.003) * 0.25)
  })
}

/** El çırpma: bant geçiren gürültü, üç hızlı patlama ve kısa bir kuyruk (birkaç el aynı anda). */
export function clap(seed = 3) {
  const source = noise(seed)
  const band = new Filter('bandpass', 1300, 1.1)
  const bursts = [0, 0.011, 0.023]
  return render(0.3, (t) => {
    const hit = bursts.reduce((sum, start) => sum + (t >= start ? Math.exp(-(t - start) / 0.006) : 0), 0)
    return band.run(source()) * (hit * 0.8 + Math.exp(-t / 0.11) * 0.55) * 2.2
  })
}

/** Hi-hat: yalnızca tizi kalmış gürültü; kapalıysa hemen söner, açıksa biraz çınlar. */
export function hat(open = false, seed = 11) {
  const source = noise(seed)
  const high = new Filter('highpass', 7500, 0.8)
  const decay = open ? 0.16 : 0.032
  return render(open ? 0.4 : 0.1, (t) => high.run(source()) * Math.exp(-t / decay))
}

/** Bas: testere dişi, başta parlak sonra koyulaşan filtreyle; altında bir oktav aşağıda temiz sinüs. */
export function bass(note, length) {
  const wave = saw(midiHz(note))
  const low = new Filter('lowpass', 900, 0.9)
  const sub = midiHz(note)
  return render(length + 0.05, (t, index) => {
    if (index % 32 === 0) low.tune(160 + 900 * Math.exp(-t / 0.09))
    const gate = Math.min(1, t / 0.004) * (t < length ? 1 : Math.exp(-(t - length) / 0.015))
    return (low.run(wave()) * 0.8 + Math.sin(TAU * sub * t) * 0.3) * gate
  })
}

/** Akor tabakası: her nota üç hafif akortsuz testere (koro etkisi), yumuşak filtre, yavaş giriş ve çıkış. */
export function pad(notes, length, { attack = 0.35, release = 0.9, brightness = 1800 } = {}) {
  const voices = notes.flatMap((note, n) => [-0.11, 0, 0.12].map((detune, v) => saw(midiHz(note + detune), (n * 3 + v) * 0.137)))
  const low = new Filter('lowpass', brightness, 0.6)
  const high = new Filter('highpass', 140, 0.7)
  return render(length + release, (t) => {
    let sum = 0
    for (const voice of voices) sum += voice()
    const swell = Math.min(1, t / attack) * (t < length ? 1 : Math.exp(-(t - length) / (release / 3)))
    return high.run(low.run(sum / voices.length)) * swell * 2
  })
}

/** Telli synth: parlak başlayıp hemen koyulaşan kısa nota ("tık-tın"); arpej ve melodinin sesi. */
export function pluck(note, { decay = 0.22, brightness = 5200 } = {}) {
  const wave = saw(midiHz(note))
  const detuned = saw(midiHz(note + 0.08), 0.31)
  const low = new Filter('lowpass', brightness, 1.2)
  return render(decay * 4, (t, index) => {
    if (index % 16 === 0) low.tune(350 + brightness * Math.exp(-t / (decay * 0.35)))
    return low.run((wave() + detuned()) * 0.5) * Math.exp(-t / decay) * Math.min(1, t / 0.002)
  })
}

/** Çan: uyumsuz kısmi seslerle zenginleşmiş sinüs; başarı ve dokunuş seslerinin temeli. */
export function bell(note, decay = 0.9) {
  const base = midiHz(note)
  const partials = [
    [1, 1, 1],
    [2.01, 0.42, 0.55],
    [3.02, 0.2, 0.35],
    [4.17, 0.12, 0.2],
  ]
  return render(decay * 3, (t) => {
    const tone = partials.reduce((sum, [ratio, level, life]) => sum + Math.sin(TAU * base * ratio * t) * level * Math.exp(-t / (decay * life)), 0)
    return tone * 0.45 * Math.min(1, t / 0.0015)
  })
}

/** Gerilim: yükselen filtreli gürültü ve bir oktav tırmanan sinüs; düşüşten hemen önce biter. */
export function riser(length, seed = 5) {
  const source = noise(seed)
  const band = new Filter('bandpass', 300, 1.6)
  let phase = 0
  return render(length, (t, index) => {
    const amount = t / length
    if (index % 32 === 0) band.tune(300 * 20 ** amount)
    phase += (TAU * 220 * 2 ** (amount * 1.5)) / RATE
    return (band.run(source()) * 1.4 + Math.sin(phase) * 0.18) * amount ** 2.2
  })
}

/** Düşüş vuruşu: derin, yavaş sönen bir gümbürtü ve üstünde koyu bir çarpma. */
export function impact(seed = 9) {
  const source = noise(seed)
  const low = new Filter('lowpass', 2400, 0.7)
  let phase = 0
  return render(2.2, (t) => {
    phase += (TAU * (38 + 40 * Math.exp(-t / 0.12))) / RATE
    const boom = Math.sin(phase) * Math.exp(-t / 0.55)
    const crash = low.run(source()) * Math.exp(-t / 0.45) * 0.35
    return Math.tanh(boom * 1.3 + crash)
  })
}
