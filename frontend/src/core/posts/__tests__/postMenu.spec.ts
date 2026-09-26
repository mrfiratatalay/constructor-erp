import { describe, expect, it } from 'vitest'
import type { CurrentUserResponse, PostView } from '@/core/api/generated/model'
import { postMenu } from '@/core/posts/postMenu'
import { postSummary } from '@/core/posts/postPreview'

const lead = { id: 'lead', role: 'SITE_LEAD' } as CurrentUserResponse

const post = (fields: Partial<PostView> = {}): PostView => ({
  id: 'p',
  site: { id: 's', name: 'Çamlıca' },
  author: { id: 'lead', fullName: 'Musa' },
  body: 'Beton geldi',
  issue: false,
  createdAt: '2026-09-27T08:00:00',
  media: [],
  forwarded: false,
  seenByAll: false,
  fieldUpdate: false,
  ...fields,
})

describe('yoklama mesajı', () => {
  it('menüsünde yalnızca sabitle, bilgi ve sil: yazısı yok, iletilmez, sahaya girmez', () => {
    const actions = postMenu(post({ body: null, rollCallDay: '2026-09-27' }), lead).map(
      (item) => item.action,
    )
    expect(actions).toEqual(['pin', 'info', 'delete'])
  })

  it('düz mesajın menüsü değişmez', () => {
    const actions = postMenu(post(), lead).map((item) => item.action)
    expect(actions).toEqual([
      'reply',
      'copy',
      'forward',
      'pin',
      'field',
      'info',
      'correct',
      'delete',
    ])
  })

  it('listede ve sabit şeritte adıyla görünür', () => {
    expect(postSummary(post({ body: null, rollCallDay: '2026-09-27' }))).toBe('📋 Yoklama')
  })
})
