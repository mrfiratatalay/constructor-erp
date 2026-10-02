// İmalat panosu (Yomra Park): iş kalemleri, taşeron ekipleri ve günlük girişler. Alçı ekibinin bugünkü girişi
// çekimde canlı yapılır: ilerleme yüzdesi o an değişir.
import { randomUUID } from 'node:crypto'
import { form } from './api.mjs'
import { dayOffset, weekday } from './clock.mjs'
import { rng } from './random.mjs'

/** done: bugüne kadar yapılan; perDay: günlük ortalama. Girişler startDay'den dünkü iş gününe kadar dağılır. */
export const ITEMS = [
  { trade: 'Alçı', title: '3. kat iç cephe', crew: 'Alçı Ekibi', total: 1240, unit: 'm²', startDay: -10, endDay: 9, perDay: 64, workers: 6 },
  { trade: 'Kalıp', title: '2. kat kolon kalıpları', crew: 'Kalıp Ekibi', total: 24, unit: 'adet', startDay: -8, endDay: 0, perDay: 3, workers: 5 },
  { trade: 'Demir', title: '3. kat döşeme donatısı', crew: null, total: 18, unit: 'ton', startDay: -6, endDay: 4, perDay: 2.2, workers: 4 },
  { trade: 'Elektrik', title: '1. kat tesisat', crew: 'Elektrik Ekibi', total: 2400, unit: 'm', startDay: -16, endDay: 6, perDay: 120, workers: 3 },
  { trade: 'Seramik', title: 'Zemin kat ıslak hacimler', crew: 'Seramik Ekibi', total: 420, unit: 'm²', startDay: -5, endDay: 12, perDay: 32, workers: 3 },
  { trade: 'Duvar', title: '1. kat tuğla duvar örümü', crew: null, total: 860, unit: 'm²', startDay: -19, endDay: -2, perDay: 60, workers: 5 },
]

const NOTES = ['Malzeme yeterli, ekip tam.', 'Öğleden sonra yağmur nedeniyle yavaşladı.', 'İskele taşındı, ön cephe tamamlandı.', null, null]

async function addEntries(lead, itemId, item, random) {
  let done = 0
  for (let n = item.startDay; n < 0 && done < item.total; n++) {
    const day = dayOffset(n)
    if (weekday(day) === 0) continue
    const quantity = Math.min(item.total - done, Math.round(item.perDay * (0.75 + random() * 0.5) * 10) / 10)
    done += quantity
    await lead.post(`/api/production/items/${itemId}/entries`, form({
      id: randomUUID(), day, quantity: String(quantity), workerCount: String(item.workers),
      note: NOTES[Math.floor(random() * NOTES.length)], onField: 'false',
    }))
  }
}

export async function seedProduction(lead, siteId) {
  const crews = await lead.get('/api/production/crews')
  const random = rng(77)
  const ids = {}
  for (const item of ITEMS) {
    const crew = crews.find((candidate) => candidate.name === item.crew)
    const created = await lead.post(`/api/sites/${siteId}/production/items`, {
      trade: item.trade, title: item.title, crewId: crew?.id ?? null, totalQuantity: item.total, unit: item.unit,
      startDate: dayOffset(item.startDay), plannedEnd: dayOffset(item.endDay), note: null,
    })
    await addEntries(lead, created.id, item, random)
    ids[item.trade] = created.id
  }
  return ids
}
