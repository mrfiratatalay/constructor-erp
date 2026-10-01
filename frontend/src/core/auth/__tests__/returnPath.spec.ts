import { describe, expect, it } from 'vitest'
import { returnPath } from '@/core/auth/returnPath'

describe('returnPath', () => {
  it('uygulamanın kendi yoluna, sorgusuyla birlikte döner', () => {
    expect(returnPath('/santiyeler/42?sekme=saha')).toBe('/santiyeler/42?sekme=saha')
  })

  it.each(['//kotu.example/giris', '/\\kotu.example', 'https://kotu.example', 'javascript:alert(1)', ''])(
    'dışarıya götüren ya da yol olmayan değeri yok sayar: %s',
    (next) => {
      expect(returnPath(next)).toBeNull()
    },
  )

  it('birden çok değer (dizi) gelirse yok sayar', () => {
    expect(returnPath(['/santiyeler', '/firma'])).toBeNull()
  })
})
