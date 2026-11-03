import type { TaskViewPriority, TaskViewStatus } from '@/core/api/generated/model'
import { addDays, at, today } from '@/core/demo/server/demoClock'
import { fixedId, ID_GROUP, type PersonKey, type Seed, type SiteKey } from '@/core/demo/server/seed/seedContext'

type TaskRow = [SiteKey, string, PersonKey, TaskViewPriority, TaskViewStatus, number, string | null]

// [şantiye, başlık, sorumlu, öncelik, durum, termin (bugüne göre gün), not]
const TASKS: TaskRow[] = [
  ['yomra', 'Beton pompasının saatini netleştir', 'kemal', 'HIGH', 'IN_PROGRESS', 0, 'Döküm pompa gelince başlayacak.'],
  ['yomra', '2. kat kolon kalıplarını sök', 'musa', 'NORMAL', 'TODO', 2, 'Beton prizini aldıktan sonra.'],
  ['yomra', 'İskele güvenlik kontrolü', 'ayse', 'HIGH', 'DONE', -1, null],
  ['yomra', 'Kalıp yağı siparişi', 'mehmet', 'LOW', 'DONE', -3, null],
  ['kasustu', '6. kat elektrik tavaları', 'emre', 'NORMAL', 'DONE', 0, null],
  ['kasustu', 'Döşeme betonunu 7 gün sula (kür)', 'ayse', 'NORMAL', 'IN_PROGRESS', 5, 'Sabah ve akşam.'],
  ['kasustu', 'Asansör firmasıyla keşif randevusu', 'kemal', 'LOW', 'TODO', 7, null],
  ['sahil', 'Son kat boyası', 'burak', 'HIGH', 'IN_PROGRESS', 3, 'B blok 4. kat kaldı.'],
  ['sahil', 'İskele elemanlarını depoya gönder', 'mehmet', 'NORMAL', 'DONE', -1, null],
  ['sahil', 'Çatı derelerini temizle', 'serkan', 'LOW', 'TODO', -2, 'Yağmurdan önce yapılmalıydı.'],
  ['sahil', 'Daire teslim listesini hazırla', 'kemal', 'NORMAL', 'TODO', 10, null],
]

/** Şantiyelerin yapılacakları: biri gecikmiş, biri bugün, biri bir mesajdan açılmış (pompa sorunu). */
export const seedTasks: Seed = (draft, context) => {
  const pumpIssue = draft.posts.find((post) => post.issue && !post.resolution && post.siteId === context.sites.yomra.id)
  TASKS.forEach(([site, title, assignee, priority, status, due, note], index) => {
    const fromIssue = index === 0 ? pumpIssue : undefined
    const createdAt = fromIssue?.createdAt ?? at(Math.min(due, 0) - 2, '09:10')
    draft.tasks.push({
      id: fixedId(ID_GROUP.task, index + 1),
      companyId: context.company.id,
      siteId: context.sites[site].id,
      title,
      note,
      status,
      priority,
      dueDate: addDays(today(), due),
      assigneeId: context.people[assignee].id,
      createdById: context.people[site === 'sahil' ? 'burak' : 'ayse'].id,
      postId: fromIssue?.id ?? null,
      createdAt,
      completedAt: status === 'DONE' ? at(Math.min(due, -1), '16:30') : null,
    })
  })
}
