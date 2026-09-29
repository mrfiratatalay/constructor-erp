import { describe, expect, it } from 'vitest'
import type { PostView, SiteEventView } from '@/core/api/generated/model'
import { buildTimeline, feedBottomKey } from '@/core/posts/timeline'

const post = (id: string, createdAt: string) => ({ id, createdAt }) as PostView
const event = (id: string, createdAt: string) => ({ id, createdAt }) as SiteEventView
const joined = event('katildi', '2026-09-30T09:05:00Z')

describe('feedBottomKey', () => {
  it('son mesajdan sonra gelen sistem satırını dip sayar', () => {
    expect(feedBottomKey(buildTimeline([post('mesaj', '2026-09-27T08:34:00Z')], [joined], true))).toBe('katildi:2')
  })

  it('üste eski mesaj eklenince dip aynı kalsa da imza değişir', () => {
    const before = feedBottomKey(buildTimeline([], [joined], true))
    const after = feedBottomKey(buildTimeline([post('eski', '2026-09-22T08:44:00Z')], [joined], true))
    expect(after).not.toBe(before)
  })

  it('akış boşsa dip yoktur', () => {
    expect(feedBottomKey(buildTimeline([], [], true))).toBeUndefined()
  })
})
