import type { CreateTaskRequest, TaskView, UpdateTaskRequest } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, forbidden, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { del, get, post, put } from '@/core/demo/server/demoRouter'
import { personById, requireFeature, type Member } from '@/core/demo/server/demoSession'
import { findPost } from '@/core/demo/server/posts/postStore'
import { requireSite } from '@/core/demo/server/sites/siteViews'
import type { TaskRecord } from './taskRecords'

const personRef = (id: string) => ({ id, fullName: personById(id)?.fullName ?? 'Eski çalışan' })

function taskViewOf(task: TaskRecord): TaskView {
  const { id, siteId, title, note, status, priority, dueDate, postId, createdAt, completedAt } = task
  const assignee = task.assigneeId ? personRef(task.assigneeId) : undefined
  return { id, siteId, title, note, status, priority, dueDate, assignee, createdBy: personRef(task.createdById), postId, createdAt, completedAt }
}

function checkAssignee(member: Member, assigneeId: string | null | undefined): string | null {
  if (!assigneeId) return null
  if (personById(assigneeId)?.companyId !== member.company.id) throw badRequest('Görevin sorumlusu bulunamadı.')
  return assigneeId
}

function siteTasks({ params }: DemoRequest): TaskView[] {
  requireFeature('tasks')
  const { site } = requireSite(params.siteId!)
  return db()
    .tasks.filter((task) => task.siteId === site.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(taskViewOf)
}

/** Görev bir mesajdan da açılabilir ("Bu mesajdan görev oluştur"); mesaj aynı şantiyenin olmalı. */
function createTask({ params, body }: DemoRequest): TaskView {
  requireFeature('tasks')
  const { member, site } = requireSite(params.siteId!)
  const form = body as CreateTaskRequest
  if (!form.title.trim()) throw badRequest('Görevin başlığını yaz.')
  if (form.postId && findPost(form.postId)?.siteId !== site.id) {
    throw badRequest('Görev yalnızca bu şantiyenin bir gönderisine bağlanabilir.')
  }
  const task: TaskRecord = {
    id: newId(),
    companyId: member.company.id,
    siteId: site.id,
    title: form.title.trim(),
    note: form.note?.trim() || null,
    status: 'TODO',
    priority: form.priority,
    dueDate: form.dueDate ?? null,
    assigneeId: checkAssignee(member, form.assigneeId),
    createdById: member.person.id,
    postId: form.postId ?? null,
    createdAt: nowIso(),
    completedAt: null,
  }
  db().tasks.push(task)
  return taskViewOf(task)
}

function requireTask(member: Member, taskId: string): TaskRecord {
  const task = db().tasks.find((candidate) => candidate.id === taskId && candidate.companyId === member.company.id)
  if (!task) throw notFound('Görev')
  return task
}

function updateTask({ params, body }: DemoRequest): TaskView {
  const member = requireFeature('tasks')
  const task = requireTask(member, params.taskId!)
  const form = body as UpdateTaskRequest
  if (!form.title.trim()) throw badRequest('Görevin başlığını yaz.')
  const completedAt = form.status === 'DONE' ? (task.completedAt ?? nowIso()) : null
  const changes = { title: form.title.trim(), note: form.note?.trim() || null, status: form.status, priority: form.priority }
  Object.assign(task, changes, { dueDate: form.dueDate ?? null, assigneeId: checkAssignee(member, form.assigneeId), completedAt })
  return taskViewOf(task)
}

function deleteTask({ params }: DemoRequest): void {
  const member = requireFeature('tasks')
  const task = requireTask(member, params.taskId!)
  if (task.createdById !== member.person.id && member.role !== 'OWNER') {
    throw forbidden('Görevi yalnızca açan kişi ya da patron silebilir.')
  }
  db().tasks = db().tasks.filter((candidate) => candidate.id !== task.id)
}

export const taskRoutes = [
  get('/api/sites/:siteId/tasks', siteTasks),
  post('/api/sites/:siteId/tasks', createTask),
  put('/api/tasks/:taskId', updateTask),
  del('/api/tasks/:taskId', deleteTask),
]
