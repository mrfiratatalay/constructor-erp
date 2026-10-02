// İmalat (iş kalemleri ve günlük girişler) ve görevler: Yomra Park'ta şef Ayşe'nin kayıtları.
import { randomUUID } from 'node:crypto'
import { api, secrets } from '../lib/stack.mjs'
import { literal, sql } from '../lib/sql.mjs'

const ITEMS = [
  { trade: 'Alçı', title: '3. kat iç cephe', crew: 'Alçı Ekibi', total: 600, unit: 'm²', start: 16, end: '2026-10-20', daily: 26 },
  { trade: 'Kalıp', title: '2. kat kolonlar', crew: 'Kalıp Ekibi', total: 48, unit: 'adet', start: 10, end: '2026-10-03', daily: 2.4 },
  { trade: 'Elektrik', title: '2. kat tesisat', crew: 'Elektrik Ekibi', total: 1200, unit: 'm', start: 21, end: '2026-10-25', daily: 48 },
  { trade: 'Sıva', title: '1. kat iç sıva', crew: 'Sıva Ekibi', total: 900, unit: 'm²', start: 1, end: '2026-09-30', daily: 33 },
]

const days = (from) => {
  const list = []
  for (let day = from; day <= 30; day++) {
    if (new Date(Date.UTC(2026, 8, day)).getUTCDay() !== 0) list.push(`2026-09-${String(day).padStart(2, '0')}`)
  }
  return [...list, '2026-10-01']
}

const entry = async (lead, itemId, day, quantity) => {
  const id = randomUUID()
  const response = await lead.request.post(`${secrets().web}/api/production/items/${itemId}/entries`, {
    multipart: { id, day, quantity: String(quantity), workerCount: '4', onField: 'false' },
  })
  if (!response.ok()) throw new Error(`İmalat girişi: ${response.status()} ${await response.text()}`)
  sql(`update production_entries set created_at = ${literal(`${day} 17:10:00+03`)} where id = ${literal(id)};`)
}

export const seedProduction = async (lead, siteId) => {
  const crews = Object.fromEntries((await api(lead, 'GET', '/api/production/crews')).map((crew) => [crew.name, crew.id]))
  for (const item of ITEMS) {
    const created = await api(lead, 'POST', `/api/sites/${siteId}/production/items`, {
      trade: item.trade, title: item.title, crewId: crews[item.crew], totalQuantity: item.total, unit: item.unit,
      startDate: `2026-09-${String(item.start).padStart(2, '0')}`, plannedEnd: item.end, note: null,
    })
    for (const [index, day] of days(item.start).entries()) {
      const wobble = 0.75 + ((index * 37) % 50) / 100
      await entry(lead, created.id, day, Math.round(item.daily * wobble * 10) / 10)
    }
  }
}

export const seedTasks = async (lead, siteId, team) => {
  const tasks = [
    ['Pompa firmasıyla saat teyidi', team.ayse.id, '2026-10-02', 'HIGH', 'DONE'],
    ['Demir teslimat irsaliyesini depoya ilet', team.mehmet.id, '2026-10-03', 'NORMAL', 'IN_PROGRESS'],
    ['2. kat kolon kalıplarının kontrolü', team.musa.id, '2026-10-02', 'NORMAL', 'DONE'],
    ['Kaşüstü’ye iskele borusu sayımı', team.mehmet.id, '2026-10-05', 'LOW', 'TODO'],
  ]
  for (const [title, assigneeId, dueDate, priority, status] of tasks) {
    const task = await api(lead, 'POST', `/api/sites/${siteId}/tasks`, { title, note: null, assigneeId, dueDate, priority, postId: null })
    if (status !== 'TODO') await api(lead, 'PUT', `/api/tasks/${task.id}`, { title, note: null, assigneeId, dueDate, priority, status })
  }
}
