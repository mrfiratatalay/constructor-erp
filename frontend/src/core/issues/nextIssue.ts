import type { PostView } from '@/core/api/generated/model'

/**
 * Sorun çözülünce kuyrukta sıradaki: çözülenin hemen arkasındaki, o sonuncuysa bir öncekisi.
 * Patron listeyi yukarıdan aşağı tek tek bitirir.
 */
export function nextIssueId(issues: PostView[], resolvedId: string): string | null {
  const index = issues.findIndex((issue) => issue.id === resolvedId)
  const rest = issues.filter((issue) => issue.id !== resolvedId)
  if (!rest.length) return null
  return rest[Math.min(Math.max(index, 0), rest.length - 1)]!.id
}
