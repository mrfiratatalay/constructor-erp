import { describe, expect, it } from 'vitest'
import type { CurrentUserResponse, PostView } from '@/core/api/generated/model'
import { postMenu } from '@/core/posts/postMenu'

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

describe('mesaj menüsü', () => {
  it('kendi mesajında WhatsApp sırasıyla bütün işler', () => {
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
})

describe('iş teslimi mesajının menüsü', () => {
  it('yanıtla, sabitle, sahaya ekle ve bilgi; kanıt olduğu için kopyalanmaz, iletilmez, düzeltilmez, silinmez', () => {
    const delivery = post({ deliveryId: 'd', media: [{ id: 'm' } as PostView['media'][number]] })
    expect(postMenu(delivery, lead).map((item) => item.action)).toEqual([
      'reply',
      'pin',
      'field',
      'info',
    ])
  })

  it("şefin yazılı cevabı Saha'ya eklenmez", () => {
    const reply = post({ deliveryId: 'd', author: { id: 'sef', fullName: 'Şef' } })
    expect(postMenu(reply, lead).map((item) => item.action)).toEqual(['reply', 'pin'])
  })
})
