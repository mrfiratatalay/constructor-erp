/**
 * Ayın başından düne kadarki puantaj. Rastgele değil, bir hikâyesi var: bir yağmur günü herkes yarım gün,
 * iki beton dökümünde kalıpçılar mesaide, Yusuf üç gün memlekette, Selim bir gün haber vermeden gelmedi.
 * Geri kalan günlerdeki küçük sapmalar da her çalıştırmada aynı çıkar: tohum kişinin anahtarı ile gündür.
 */
const POUR_TRADES = ['Kalıpçı', 'Operatör', 'Düz işçi']

/** Ayın ilk gününden dünkü güne kadar Pazar dışındaki günler (YYYY-AA-GG). */
export function pastWorkdays(today) {
  const days = []
  for (let day = 1; day < Number(today.slice(8)); day++) {
    const iso = `${today.slice(0, 8)}${String(day).padStart(2, '0')}`
    if (new Date(`${iso}T12:00:00Z`).getUTCDay() !== 0) days.push(iso)
  }
  return days
}

/** Her kalem için her iş gününün işareti: { entry, day, status, overtimeHours?, note? }. */
export function planMonth(entries, workdays) {
  const story = storyDays(workdays)
  return entries.flatMap((entry) =>
    workdays.map((day) => ({ entry, day, ...(storyMark(entry, day, story) ?? everydayMark(entry, day)) })),
  )
}

/**
 * Hikâyenin günleri sondan sayılır: ay kısa da olsa olaylar dünden geriye doğru yerleşir. İlerlemenin girişleri de
 * bunları okur: yağmur günü demirde yarım gün, beton dökümünden önce donatı teslimi.
 */
export function storyDays(workdays) {
  const back = (count) => workdays[workdays.length - count]
  return {
    rain: back(8),
    pours: [back(4), back(14)],
    leave: [back(11), back(10), back(9)],
    noShow: back(3),
  }
}

function storyMark(entry, day, story) {
  if (entry.kind === 'CREW') return null
  if (day === story.rain) {
    return { status: 'HALF_DAY', note: entry.key === 'huseyin' ? 'Yağmur: öğleden sonra paydos' : undefined }
  }
  if (entry.key === 'yusuf' && story.leave.includes(day)) {
    return { status: 'LEAVE', note: day === story.leave[0] ? 'Memleket izni, 3 gün' : undefined }
  }
  if (entry.key === 'selim' && day === story.noShow) {
    return { status: 'ABSENT', note: 'Haber vermedi, arandı' }
  }
  if (story.pours.includes(day) && POUR_TRADES.includes(entry.trade)) {
    return { status: 'PRESENT', overtimeHours: 3, note: entry.key === 'huseyin' ? 'Beton dökümü, 21:00’e kadar' : undefined }
  }
  return null
}

function everydayMark(entry, day) {
  const roll = chance(`${entry.key}|${day}`)
  if (entry.kind === 'CREW') return { status: roll < 0.12 ? 'ABSENT' : 'PRESENT' }
  if (roll < 0.03) return { status: 'ABSENT' }
  if (roll < 0.05) return { status: 'HALF_DAY' }
  if (roll > 0.94) return { status: 'PRESENT', overtimeHours: 2 }
  return { status: 'PRESENT' }
}

/**
 * 0 ile 1 arasında, aynı yazı için hep aynı sayı: FNV-1a özeti, ardından MurmurHash3'ün karıştırma adımı.
 * Karıştırma şart: yalnızca son harfi farklı yazılarda (aynı kişi, ardışık günler) FNV'nin üst bitleri neredeyse
 * aynı kalıyor, bir ekip ayın her günü "Gelmedi" çıkıyordu.
 */
function chance(text) {
  let hash = 2166136261
  for (const char of text) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b)
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35)
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296
}
