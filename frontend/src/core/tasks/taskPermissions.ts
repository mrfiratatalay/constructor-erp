import type { CurrentUserResponse, TaskView } from '@/core/api/generated/model'

/** Görevi şantiyeyi gören herkes günceller; silmek yalnızca açanın ve patronun işidir (backend ile aynı kural). */
export function canDeleteTask(task: TaskView, user: CurrentUserResponse | undefined): boolean {
  return !!user && (task.createdBy.id === user.id || user.role === 'OWNER')
}

/**
 * Sohbetin ＋'sındaki "📋 Görev" patronda ve şefte durur: görevi onlar verir, çalışan görevi karttan teslim eder.
 * Görevler sayfasının kuralı değişmedi (şantiyeyi gören herkes görev açar).
 */
export function canAssignTasks(user: CurrentUserResponse | undefined): boolean {
  return user?.role === 'OWNER' || user?.role === 'SITE_LEAD'
}
