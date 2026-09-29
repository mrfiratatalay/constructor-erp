import type { Cue } from '../kit/Soundtrack'

/**
 * Ana videonun zamanlaması (30 kare = 1 sn, toplam 72 sn). Müzik "tanitim" biçimindedir (audio/forms.mjs): her bölüm
 * bir düşüşte açılır (120, 480, 840, 1200, 1560. kare), 1920'de toplu söz, 2040'ta kapanış. Bölümler modül
 * videolarından 12 saniyelik parçalardır: telefondaki doruk, telefondan laptopa geçiş, patronun ilk anı. Sıra bir
 * şantiye günüdür: sabah yoklama, 09:32 sevkiyat, 14:20 sorun, 17:38 ilerleme; sonda ekibe yeni biri.
 */
export const DURATION = 2160
export const CHAPTER_LENGTH = 360

export const INTRO = [
  { text: "Kızılkan Yapı'nın *şantiyeleri.*", from: 4, to: 58 },
  { text: "WhatsApp'ta değil, *tek yerde.*", from: 60, to: 112 },
]

/** source: modül videosunda parçanın başladığı kare. Yoklamada "Geldi" dalgası, ekipte bağlantının kopyalanması. */
export const CHAPTERS = [
  { name: 'Yoklama', source: 312 },
  { name: 'Malzeme', source: 300 },
  { name: 'Saha', source: 236 },
  { name: 'İlerleme', source: 256 },
  { name: 'Ekip', source: 222 },
].map((chapter, index) => ({ ...chapter, from: 120 + index * CHAPTER_LENGTH }))

export const FINALE = { text: 'Yoklama, malzeme, saha, ilerleme, ekip: *tek uygulama.*', from: 1926, to: 2036 }
export const END_CARD = 2040
export const CLOSING = { line: 'Sahada telefon, ofiste *tek ekran.*', note: "Kızılkan Yapı'nın şantiyeleri için." }

export const CUES: Cue[] = [
  { at: INTRO[1].from - 8, sound: 'whoosh', volume: 0.28 },
  ...CHAPTERS.map((chapter) => ({ at: chapter.from - 6, sound: 'whoosh', volume: 0.32 })),
  { at: FINALE.from - 6, sound: 'whoosh', volume: 0.3 },
  { at: END_CARD + 12, sound: 'shine', volume: 0.45 },
]
export const MUSIC = { name: 'tanitim-muzik', volume: 0.74 }
