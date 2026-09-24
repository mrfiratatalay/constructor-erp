import { describe, expect, it } from 'vitest'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { seenLine, siteLine } from '@/core/team/memberLines'

const MEMBER: MemberView = { id: '1', fullName: 'Ahmet Usta', role: 'SITE_LEAD', active: true, siteIds: ['b', 'a'] }
const SITES: SiteView[] = [
  { id: 'a', name: 'Namık Kemal', status: 'ACTIVE', leads: [] },
  { id: 'b', name: 'Kartal B Blok', status: 'ACTIVE', leads: [] },
]

describe('siteLine', () => {
  it('kişinin şantiyelerini liste sırasıyla yazar, şantiyesi yoksa susar', () => {
    expect(siteLine(MEMBER, SITES)).toBe('Namık Kemal, Kartal B Blok')
    expect(siteLine({ ...MEMBER, siteIds: [] }, SITES)).toBe('')
  })

  it('patron her şantiyenin içindedir, şantiye saymaz', () => {
    expect(siteLine({ ...MEMBER, role: 'OWNER' }, SITES)).toBe('Patron')
  })
})

describe('seenLine', () => {
  it('linki hiç açmamış kişi için "Henüz girmedi" yazar', () => {
    expect(seenLine(MEMBER)).toBe('Henüz girmedi')
  })

  it('giren kişinin son görülmesini yazar', () => {
    expect(seenLine({ ...MEMBER, lastSeenAt: new Date().toISOString() })).toMatch(/^son görülme /)
  })
})
