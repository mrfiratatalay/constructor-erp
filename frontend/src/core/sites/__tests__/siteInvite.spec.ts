import { describe, expect, it } from 'vitest'
import type { SiteEventView } from '@/core/api/generated/model'
import { eventLine } from '@/core/sites/siteEvents'
import { siteInviteShareUrl } from '@/core/sites/useSiteInviteLink'

describe('siteInviteShareUrl', () => {
  it('WhatsApp kişi seçtirerek açılır, mesajda şantiye ve bağlantı bozulmadan durur', () => {
    const url = new URL(siteInviteShareUrl('Namık Kemal', 'http://localhost:5173/katil/abc'))
    expect(url.pathname).toBe('/')
    expect(url.searchParams.get('text')).toBe(
      'Merhaba, seni Namık Kemal şantiyesine davet ediyorum. Katılmak için bu bağlantıya dokun: http://localhost:5173/katil/abc',
    )
  })
})

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
