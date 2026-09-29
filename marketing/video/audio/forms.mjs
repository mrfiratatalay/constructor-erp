/**
 * Müziğin biçimi, saniyeyle: bölümler sırayla kaç ölçü sürer (bir ölçü 2 sn = 60 kare), gerilimler [başlangıç, süre],
 * düşüşlerin gümbürtüsü, Do akoruna çözülüş, sesin kısılmaya başladığı an ve toplam süre. Modül videoları hep aynı
 * biçimi çalar (düşüşler 120, 480, 840. kare); ana video daha uzundur, her bölümü bir düşüşle açılır.
 */
export const FORMS = {
  modul: {
    length: 32,
    sections: [['intro', 2], ['groove', 5], ['breath', 1], ['full', 6]],
    risers: [[2.5, 1.5], [14.4, 1.6]],
    impacts: [4, 16],
    resolve: 28,
    fade: 30.6,
  },
  tanitim: {
    length: 72,
    sections: [
      ['intro', 2], ['groove', 6], ['full', 6], ['full', 6], ['full', 6], ['full', 5], ['breath', 1], ['full', 2],
    ],
    risers: [[2.5, 1.5], [62.4, 1.6]],
    impacts: [4, 16, 28, 40, 52, 64],
    resolve: 68,
    fade: 70.6,
  },
}
