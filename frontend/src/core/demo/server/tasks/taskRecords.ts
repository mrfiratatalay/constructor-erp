import type { TaskViewPriority, TaskViewStatus } from '@/core/api/generated/model'

export interface TaskRecord {
  id: string
  companyId: string
  siteId: string
  title: string
  note: string | null
  status: TaskViewStatus
  priority: TaskViewPriority
  dueDate: string | null
  assigneeId: string | null
  createdById: string
  postId: string | null
  createdAt: string
  completedAt: string | null
}
