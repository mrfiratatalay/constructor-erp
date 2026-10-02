// Yomra Park'ın görev listesi: bir kısmı bitmiş, bir kısmı sürüyor. "3. kat elektrik tesisatı kontrolü" çekimde
// canlı oluşturulup tamamlanır.
import { dayOffset } from './clock.mjs'

const TASKS = [
  { title: 'Beton pompası saatini teyit et', assignee: 'ayse', due: 0, priority: 'HIGH', status: 'IN_PROGRESS' },
  { title: 'Kalıp panellerinin sayımı', assignee: 'mehmet', due: 2, priority: 'NORMAL', status: 'TODO' },
  { title: 'İskele güvenlik kontrolü', assignee: 'burak', due: 1, priority: 'HIGH', status: 'TODO' },
  { title: '2. kat kolon donatı kontrolü', assignee: 'ayse', due: -1, priority: 'HIGH', status: 'DONE' },
  { title: '1. kat duvar örümü kontrolü', assignee: 'musa', due: -2, priority: 'NORMAL', status: 'DONE' },
]

export async function seedTasks(lead, siteId, people) {
  for (const task of TASKS) {
    const body = { title: task.title, note: null, assigneeId: people[task.assignee].id, dueDate: dayOffset(task.due), priority: task.priority }
    const created = await lead.post(`/api/sites/${siteId}/tasks`, { ...body, postId: null })
    if (task.status !== 'TODO') await lead.put(`/api/tasks/${created.id}`, { ...body, status: task.status })
  }
}
