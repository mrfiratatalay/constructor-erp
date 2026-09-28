import type { CurrentUserResponse, SiteView } from '@/core/api/generated/model'

export interface AssigneeChoice {
  id: string
  label: string
}

/**
 * Görev kime verilebilir: patron olmayan katılımcılar (şefler, depo sorumluları, çalışanlar), patron bakıyorsa
 * kendisi de.
 * Backend yalnızca şantiyeyi gören kişiyi kabul eder; buradaki liste de tam olarak onlardır.
 */
export function assigneeChoices(site: SiteView, user: CurrentUserResponse | undefined): AssigneeChoice[] {
  const team = [...site.leads, ...site.storekeepers, ...site.workers]
  const others = team
    .filter((person) => person.id !== user?.id)
    .map((person) => ({ id: person.id, label: person.fullName }))
  const canTakeItSelf = !!user && (user.role === 'OWNER' || team.some((person) => person.id === user.id))
  return canTakeItSelf ? [{ id: user.id, label: 'Ben' }, ...others] : others
}
