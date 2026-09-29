/**
 * Serinin şarkıları. Bütün videolar aynı iskeleti çalar (music.mjs: 16 ölçü, düşüşler 120, 480 ve 840. karede) ve
 * aynı enstrümanları kullanır: seri tek bir sesten çıkmış gibi durur. Her videonun kendi akor dizisi ve melodisi
 * vardır: her biri ayrı bir şarkıdır. Hepsi Do majör / La minör dizisindedir; son Do akoruna çözülür.
 */

/** Akor: akor tabakasının notaları, bas notası, arpejin dört notası (MIDI: 60 = orta Do). */
export const CHORDS = {
  Am: { pad: [57, 60, 64, 69], bass: 33, arp: [69, 72, 76, 81] },
  F: { pad: [53, 57, 60, 65], bass: 29, arp: [65, 69, 72, 77] },
  C: { pad: [55, 60, 64, 67], bass: 36, arp: [67, 72, 76, 79] },
  G: { pad: [55, 59, 62, 67], bass: 31, arp: [67, 71, 74, 79] },
}

/**
 * progression: ölçü ölçü dönen akorlar. tune: dolu akışta her akorun üstünde çalınan melodi, sekizlik notalarla
 * (null = sus). Nefes ölçüsünün (7.) akoru ikinci düşüşe gerilim taşır; son iki ölçünün akoru Do'ya çözülür.
 */
export const SCORES = {
  /** Lam – Fa – Do – Sol: iyimser, tanıdık; son Fa'dan Do'ya ("amin" kadansı). */
  yoklama: {
    progression: ['Am', 'F', 'C', 'G'],
    tune: {
      Am: [76, null, 76, 74, 72, null, 69, null],
      F: [72, null, 72, 74, 76, null, 72, null],
      C: [79, null, 79, 76, 74, null, 72, null],
      G: [74, null, 74, 76, 74, 72, 71, null],
    },
  },
  /** Lam – Sol – Fa – Sol: kararlı, yola çıkan kamyon; son Sol'den Do'ya (en güçlü çözülüş). */
  malzeme: {
    progression: ['Am', 'G', 'F', 'G'],
    tune: {
      Am: [69, null, 72, 76, 74, null, 72, null],
      G: [71, null, 74, 79, 77, null, 74, null],
      F: [72, null, 77, 76, 74, null, 72, null],
    },
  },
}
