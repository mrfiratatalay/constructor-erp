import { describe, expect, it } from 'vitest'
import type { MemberView } from '@/core/api/generated/model'
import { memberStatus } from '@/core/team/memberStatus'

const MEMBER: MemberView = { id: '1', fullName: 'Ahmet Usta', role: 'SITE_LEAD', active: true, siteIds: [] }

describe('memberStatus', () => {
  it('linki açmamış kişiyi uyarı olarak gösterir', () => {
    expect(memberStatus(MEMBER)).toEqual({ tone: 'warning', label: 'Linki henüz açmadı' })
  })

  it('giriş yapmış kişinin son görülmesini yazar', () => {
    const seen = memberStatus({ ...MEMBER, lastSeenAt: new Date().toISOString() })
    expect(seen.tone).toBe('success')
    expect(seen.label).toMatch(/^Son görülme /)
  })

  it('pasif kişi, giriş yapmış olsa bile pasif görünür', () => {
    const inactive = { ...MEMBER, active: false, lastSeenAt: new Date().toISOString() }
    expect(memberStatus(inactive)).toEqual({ tone: 'neutral', label: 'Pasif' })
  })
})
