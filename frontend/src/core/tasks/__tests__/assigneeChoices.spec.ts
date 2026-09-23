import { describe, expect, it } from 'vitest'
import type { CurrentUserResponse, SiteView } from '@/core/api/generated/model'
import { assigneeChoices } from '@/core/tasks/assigneeChoices'

const SITE: SiteView = {
  id: 's',
  name: 'Çamlıca',
  status: 'ACTIVE',
  leads: [
    { id: 'ahmet', fullName: 'Ahmet Usta' },
    { id: 'mehmet', fullName: 'Mehmet Kalfa' },
  ],
}
const OWNER: CurrentUserResponse = { id: 'patron', fullName: 'Patron', role: 'OWNER', companyName: 'Kızılkan' }
const AHMET: CurrentUserResponse = { id: 'ahmet', fullName: 'Ahmet Usta', role: 'SITE_LEAD', companyName: 'Kızılkan' }

describe('assigneeChoices', () => {
  it('patron görevi kendine ya da şantiyenin sorumlularına verebilir', () => {
    expect(assigneeChoices(SITE, OWNER).map((c) => c.label)).toEqual(['Ben', 'Ahmet Usta', 'Mehmet Kalfa'])
  })

  it('sorumlu kendini bir kez "Ben" olarak görür, öteki sorumlular adıyla gelir', () => {
    expect(assigneeChoices(SITE, AHMET)).toEqual([
      { id: 'ahmet', label: 'Ben' },
      { id: 'mehmet', label: 'Mehmet Kalfa' },
    ])
  })
})
