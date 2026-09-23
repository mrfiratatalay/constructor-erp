import type { CurrentUserResponse, SiteView } from '@/core/api/generated/model'

export interface AssigneeChoice {
  id: string
  label: string
}

/**
 * Görev kime verilebilir: şantiyenin sorumluları, patron bakıyorsa kendisi de. Backend yalnızca şantiyeyi
 * gören kişiyi kabul eder; buradaki liste de tam olarak onlardır.
 */
export function assigneeChoices(site: SiteView, user: CurrentUserResponse | undefined): AssigneeChoice[] {
  const others = site.leads
    .filter((lead) => lead.id !== user?.id)
    .map((lead) => ({ id: lead.id, label: lead.fullName }))
  const canTakeItSelf = !!user && (user.role === 'OWNER' || site.leads.some((lead) => lead.id === user.id))
  return canTakeItSelf ? [{ id: user.id, label: 'Ben' }, ...others] : others
}
