import { describe, expect, it } from 'vitest'
import type { SiteEventView } from '@/core/api/generated/model'
import { eventLine } from '@/core/sites/siteEvents'

describe('eventLine', () => {
  const joined: SiteEventView = {
    id: 'e', siteId: 's', kind: 'MEMBER_JOINED', actorId: 'u', actorName: 'Musa Kusbey',
    subjectId: 'u', subjectName: 'Musa Kusbey', createdAt: new Date().toISOString(),
  }

  it('davet bağlantısıyla katılanı WhatsApp gibi yazar', () => {
    expect(eventLine(joined, 'baskasi')).toBe('Musa Kusbey davet bağlantısıyla katıldı')
    expect(eventLine(joined, 'u')).toBe('Davet bağlantısıyla katıldın')
  })
})
