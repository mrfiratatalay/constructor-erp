// Puantaj: uygulaması olmayan ustalar ve taşeron ekipler; Eylül'ün tamamı ve 1 Ekim işaretli, bugün boş
// (bugünü şef filmde telefondan alır).
import { api } from '../lib/stack.mjs'

const PERSONS = [
  ['Ali Yılmaz', 'Kalıp Ustası'], ['Murat Demir', 'Demir Ustası'], ['Emre Kaya', 'Elektrik Ustası'],
  ['Hasan Çelik', 'Kalıpçı'], ['Kemal Aydın', 'Demirci'], ['Yusuf Şahin', 'Sıvacı'], ['İbrahim Koç', 'Düz İşçi'],
  ['Osman Kurt', 'Kaynakçı'], ['Mustafa Öz', 'Operatör'], ['Ramazan Ak', 'Düz İşçi'],
]
export const CREWS = [['Alçı Ekibi', 'Alçı'], ['Kalıp Ekibi', 'Kalıp'], ['Elektrik Ekibi', 'Elektrik'], ['Sıva Ekibi', 'Sıva']]

/** Ay içindeki gerçekçi istisnalar: [ad, gün, durum, fazla mesai]. Gerisi "Geldi". */
const EXCEPTIONS = [
  ['Ali Yılmaz', 11, 'HALF_DAY'], ['Ali Yılmaz', 18, 'LEAVE'], ['Ali Yılmaz', 25, 'HALF_DAY'],
  ['Murat Demir', 8, 'ABSENT'], ['Murat Demir', 22, 'HALF_DAY'], ['Emre Kaya', 14, 'LEAVE'], ['Emre Kaya', 15, 'LEAVE'],
  ['Emre Kaya', 16, 'LEAVE'], ['Hasan Çelik', 3, 'ABSENT'], ['Hasan Çelik', 29, 'ABSENT'], ['Yusuf Şahin', 5, 'HALF_DAY'],
  ['Yusuf Şahin', 19, 'HALF_DAY'], ['Osman Kurt', 23, 'LEAVE'], ['Osman Kurt', 24, 'LEAVE'], ['Ramazan Ak', 10, 'ABSENT'],
  ['Kemal Aydın', 12, 'PRESENT', 2], ['Kemal Aydın', 26, 'PRESENT', 2], ['Mustafa Öz', 17, 'PRESENT', 3],
]

const workdays = () => {
  const days = []
  for (let day = 1; day <= 30; day++) {
    if (new Date(Date.UTC(2026, 8, day)).getUTCDay() !== 0) days.push(`2026-09-${String(day).padStart(2, '0')}`)
  }
  return [...days, '2026-10-01']
}

export const seedPuantaj = async (owner) => {
  for (const [name, trade] of PERSONS) await api(owner, 'POST', '/api/puantaj/entries', { kind: 'PERSON', name, trade })
  for (const [name, trade] of CREWS) await api(owner, 'POST', '/api/puantaj/entries', { kind: 'CREW', name, trade })
  const roster = await api(owner, 'GET', '/api/puantaj?from=2026-09-01&to=2026-10-02')
  const ids = Object.fromEntries(roster.entries.map((entry) => [entry.name, entry.id]))
  for (const day of workdays()) {
    await api(owner, 'POST', `/api/puantaj/days/${day}/bulk`, { entryIds: Object.values(ids), status: 'PRESENT' })
  }
  for (const [name, day, status, overtimeHours = null] of EXCEPTIONS) {
    const date = `2026-09-${String(day).padStart(2, '0')}`
    await api(owner, 'PUT', `/api/puantaj/days/${date}/entries/${ids[name]}`, { status, overtimeHours, note: null })
  }
  return ids
}
