import { describe, expect, it } from 'vitest'
import { choosePlatform, type ScreenInfo } from '@/core/platform/choosePlatform'

const PHONE: ScreenInfo = { isNarrow: true, isTouchTablet: false }
const TABLET: ScreenInfo = { isNarrow: false, isTouchTablet: true }
const COMPUTER: ScreenInfo = { isNarrow: false, isTouchTablet: false }

describe('choosePlatform', () => {
  it.each([
    ['telefon', PHONE, 'mobile'],
    ['tablet', TABLET, 'mobile'],
    ['bilgisayar', COMPUTER, 'desktop'],
  ] as const)('tercih yoksa %s → %s', (_, screen, expected) => {
    expect(choosePlatform(null, screen)).toBe(expected)
  })

  it('kayıtlı tercih ekrandan önce gelir', () => {
    expect(choosePlatform('desktop', PHONE)).toBe('desktop')
    expect(choosePlatform('mobile', COMPUTER)).toBe('mobile')
  })
})
