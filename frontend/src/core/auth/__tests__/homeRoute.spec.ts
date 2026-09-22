import { describe, expect, it } from 'vitest'
import { homeRouteFor } from '@/core/auth/homeRoute'

describe('homeRouteFor', () => {
  it('patronu ve şantiye sorumlusunu kendi ana sayfasına gönderir', () => {
    expect(homeRouteFor('OWNER')).toBe('today')
    expect(homeRouteFor('SITE_LEAD')).toBe('feed')
  })
})
