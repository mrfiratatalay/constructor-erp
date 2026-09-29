import { master, mixInto, place, RATE, samples, stereo } from './dsp.mjs'
import { bass, clap, hat, impact, kick, pad, pluck, riser } from './instruments.mjs'
import { pingPong, reverb } from './space.mjs'

/**
 * Yoklama videosunun müziği: 120 BPM, 16 ölçü, tam 32 saniye. Bir vuruş yarım saniye = videoda 15 kare, bir ölçü
 * 60 kare. Bölümler videonun zamanlamasıyla (src/yoklama/timeline.ts) aynıdır: 2. ölçüde (kare 120) telefon gelir,
 * 8. ölçüde (kare 480) laptop, 14. ölçüde (kare 840) logo. Akorlar Lam – Fa – Do – Sol; son, Fa'dan Do'ya çözülür.
 */
const BAR = 2
const LENGTH = 32

const CHORDS = {
  Am: { pad: [57, 60, 64, 69], bass: 33, arp: [69, 72, 76, 81], tune: [76, null, 76, 74, 72, null, 69, null] },
  F: { pad: [53, 57, 60, 65], bass: 29, arp: [65, 69, 72, 77], tune: [72, null, 72, 74, 76, null, 72, null] },
  C: { pad: [55, 60, 64, 67], bass: 36, arp: [67, 72, 76, 79], tune: [79, null, 79, 76, 74, null, 72, null] },
  G: { pad: [55, 59, 62, 67], bass: 31, arp: [67, 71, 74, 79], tune: [74, null, 74, 76, 74, 72, 71, null] },
}
const PROGRESSION = ['Am', 'F', 'C', 'G']
/**
 * Karışımın dengesi: ölçülerek ayarlandı (her bandın toplama oranı). Davul ve alt bas telefonda duyulmaz ama
 * enerjiyi yutar; kısık tutulur ki akorlar ve melodi (dinleyenin asıl duyduğu) önde kalsın.
 */
const LEVEL = { kick: 0.5, clap: 0.4, hat: 0.2, ghost: 0.07, bass: 0.26, pad: 0.6, introPad: 0.55, arp: 0.3, introArp: 0.34, tune: 0.5, impact: 0.42, riser: 0.4 }
const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 1, 0, 1]

/** Ölçünün bölümü: giriş, ilk akış, nefes, dolu akış, kapanış. */
function sectionOf(bar) {
  if (bar < 2) return 'intro'
  if (bar < 7) return 'groove'
  if (bar < 8) return 'breath'
  if (bar < 14) return 'full'
  return 'outro'
}

export function composeYoklama() {
  const length = samples(LENGTH)
  const bus = { drums: stereo(length), low: stereo(length), pads: stereo(length), keys: stereo(length), fx: stereo(length) }
  const kicks = []
  for (let bar = 0; bar < 14; bar++) {
    const section = sectionOf(bar)
    const chord = CHORDS[PROGRESSION[bar % 4]]
    const start = bar * BAR
    writePad(bus, chord, start, section, bar)
    writeKeys(bus, chord, start, section)
    if (section === 'groove' || section === 'full') writeGroove(bus, chord, start, section, kicks)
  }
  writeMoments(bus)
  duck(bus.low, kicks, 0.45)
  duck(bus.pads, kicks, 0.55)
  return mixDown(bus, length)
}

function writePad(bus, chord, start, section, bar) {
  const brightness = { intro: 700 + bar * 700, breath: 1100, groove: 1800, full: 2300 }[section]
  place(bus.pads, pad(chord.pad, BAR, { brightness }), start, section === 'intro' ? LEVEL.introPad : LEVEL.pad)
}

/** Arpej: girişte vuruşlarda seyrek, ilk akışta sekizlik, nefeste ve dolu akışta onaltılık; dolu akışta melodi. */
function writeKeys(bus, chord, start, section) {
  const step = { intro: 0.5, groove: 0.25, breath: 0.125, full: 0.125 }[section]
  const gain = section === 'intro' ? LEVEL.introArp : LEVEL.arp
  const decay = section === 'intro' ? 0.5 : 0.18
  for (let index = 0; index * step < BAR; index++) {
    const note = chord.arp[ARP[index % ARP.length]]
    place(bus.keys, pluck(note, { decay, brightness: 4800 }), start + index * step, gain, index % 2 ? 0.35 : -0.35)
  }
  if (section !== 'full') return
  chord.tune.forEach((note, index) => {
    if (note !== null) place(bus.keys, pluck(note, { decay: 0.3, brightness: 5200 }), start + index * 0.25, LEVEL.tune)
  })
}

/** Davul ve bas: her vuruşta davul, aralarda hi-hat, 2 ve 4'te el çırpma (dolu akışta tam), sekizlik bas. */
function writeGroove(bus, chord, start, section, kicks) {
  const kickSound = kick()
  for (let beat = 0; beat < 4; beat++) {
    const at = start + beat * 0.5
    place(bus.drums, kickSound, at, LEVEL.kick)
    kicks.push(at)
    place(bus.drums, hat(false, 11 + beat), at + 0.25, LEVEL.hat, 0.2)
    if (beat % 2 === 1) place(bus.drums, clap(3 + beat), at, section === 'full' ? LEVEL.clap : LEVEL.clap * 0.55)
    if (section === 'full') {
      place(bus.drums, hat(false, 31 + beat), at + 0.125, LEVEL.ghost, -0.25)
      place(bus.drums, hat(false, 41 + beat), at + 0.375, LEVEL.ghost, -0.25)
    }
  }
  if (section === 'full') place(bus.drums, hat(true, 51), start + 1.75, LEVEL.hat * 0.7, 0.3)
  const octaves = [0, 0, 12, 0, 0, 0, 12, 0]
  octaves.forEach((jump, index) => place(bus.low, bass(chord.bass + jump, 0.2), start + index * 0.25, LEVEL.bass))
}

/** Bölüm geçişleri: düşüşlerden önce gerilim, düşüşte gümbürtü; sonda Do akoruna çözülüş. */
function writeMoments(bus) {
  place(bus.fx, riser(1.5, 5), 2.5, LEVEL.riser)
  place(bus.fx, riser(1.6, 6), 14.4, LEVEL.riser)
  for (const at of [4, 16, 28]) place(bus.fx, impact(9 + at), at, LEVEL.impact)
  place(bus.pads, pad([48, 55, 60, 64, 67, 72], 3.2, { attack: 0.05, release: 2.6, brightness: 2600 }), 28, LEVEL.pad)
  place(bus.low, bass(36, 2.6), 28, LEVEL.bass)
  ;[60, 64, 67, 72, 76, 79, 84].forEach((note, index) => place(bus.keys, pluck(note, { decay: 0.5 }), 28 + index * 0.125, LEVEL.arp))
}

/** Yan zincir sıkıştırma: davul vurunca bas ve akorlar bir an çekilir, müzik "nefes alır" gibi atar. */
function duck(buffer, kicks, depth) {
  let next = 0
  let last = -Infinity
  for (let index = 0; index < buffer[0].length; index++) {
    const t = index / RATE
    while (next < kicks.length && kicks[next] <= t) last = kicks[next++]
    const gain = 1 - depth * Math.exp(-(t - last) / 0.13)
    buffer[0][index] *= gain
    buffer[1][index] *= gain
  }
}

function mixDown(bus, length) {
  const mix = stereo(length)
  mixInto(mix, bus.drums, 1)
  mixInto(mix, bus.low, 1)
  mixInto(mix, bus.pads, 1)
  mixInto(mix, bus.keys, 1)
  mixInto(mix, bus.fx, 1)
  mixInto(mix, pingPong(bus.keys, { time: 0.375, feedback: 0.3 }), 0.28)
  mixInto(mix, reverb(sum(bus.pads, bus.keys, bus.fx, bus.drums, 0.25)), 0.55)
  fadeOut(mix, 30.6, LENGTH)
  return master(mix)
}

/** Yankıya gönderilen karışım: davuldan az (çamurlaşmasın), akor ve tuşlardan çok. */
function sum(pads, keys, fx, drums, drumShare) {
  const out = stereo(pads[0].length)
  mixInto(out, pads, 0.7)
  mixInto(out, keys, 0.9)
  mixInto(out, fx, 0.6)
  mixInto(out, drums, drumShare)
  return out
}

function fadeOut(buffer, from, to) {
  for (let index = samples(from); index < buffer[0].length; index++) {
    const gain = Math.max(0, 1 - (index / RATE - from) / (to - from)) ** 2
    buffer[0][index] *= gain
    buffer[1][index] *= gain
  }
}
