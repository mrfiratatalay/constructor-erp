import { randomUUID } from 'node:crypto'
import { FLOOR_TONS, ITEMS, POUR_NOTE, floorName } from './progress.mjs'

/**
 * İlerlemenin geçmişi, şefin hesabından (detayda "Ahmet Kaya" yazsın): önce iş kalemleri, sonra her birinin günlük
 * girişleri eskiden yeniye. Saha'ya yansıtılmaz (uygulamanın varsayılanı). Saatleri progress-retime.sql kaydırır.
 *
 * calendar: { today, rain, pours }; yağmur ve beton dökümü günleri puantajın hikâyesinden gelir.
 */
export async function seedProgress(chief, siteId, calendar) {
  const crews = Object.fromEntries((await chief.get('/production/crews')).map((crew) => [crew.name, crew.id]))
  let count = 0
  for (const item of ITEMS) {
    const days = entryDays(item, calendar)
    const created = await chief.post(`/sites/${siteId}/production/items`, itemRequest(item, crews, days, calendar.today))
    for (const entry of entriesOf(item, days, calendar)) {
      await chief.postForm(`/production/items/${created.id}/entries`, { id: randomUUID(), ...entry, onField: false })
      count++
    }
  }
  return count
}

function itemRequest(item, crews, days, today) {
  return {
    trade: item.trade,
    title: item.title ?? null,
    crewId: crews[item.crew],
    totalQuantity: item.total,
    unit: item.unit,
    startDate: days[0],
    plannedEnd: item.beforeMonth ? days.at(-1) : shiftDay(today, item.plannedEnd),
    note: item.note ?? null,
  }
}

/** Girişlerin günleri: dünden (temelde ayın başından) geriye iş günleri; yağmur gününde yalnızca demir çalışmıştır. */
function entryDays(item, calendar) {
  const until = item.beforeMonth ? `${calendar.today.slice(0, 8)}01` : calendar.today
  const needed = item.amounts.length + (item.rain ? 1 : 0)
  const days = []
  for (let day = shiftDay(until, -1); days.length < needed; day = shiftDay(day, -1)) {
    if (isSunday(day) || (day === calendar.rain && !item.rain)) continue
    days.unshift(day)
  }
  return days
}

function entriesOf(item, days, calendar) {
  const amounts = [...item.amounts]
  let done = 0
  return days.map((day, index) => {
    const quantity = day === calendar.rain && item.rain ? item.rain.quantity : amounts.shift()
    const floor = item.floors ? floorFinished(done, done + quantity) : null
    done += quantity
    const note = rainNote(item, day, calendar) ?? floor ?? pourNote(item, day, calendar) ?? item.notes?.[index] ?? null
    return { day, quantity, workerCount: item.workers[index % item.workers.length], note }
  })
}

/** Gerçekleşen bu girişle bir katın tonunu geçtiyse o kat biter: "2. kat donatısı tamamlandı". */
function floorFinished(before, after) {
  const floor = Math.floor(after / FLOOR_TONS)
  return floor > Math.floor(before / FLOOR_TONS) ? `${floorName(floor - 1)} donatısı tamamlandı.` : null
}

const rainNote = (item, day, calendar) => (day === calendar.rain && item.rain ? item.rain.note : null)
const pourNote = (item, day, calendar) => (item.floors && calendar.pours.includes(day) ? POUR_NOTE : null)

function shiftDay(day, offset) {
  const date = new Date(`${day}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

const isSunday = (day) => new Date(`${day}T12:00:00Z`).getUTCDay() === 0
