import { describe, expect, it } from 'vitest'
import { newId } from '@/core/posts/newId'

describe('newId', () => {
  it('sunucunun kabul ettiği UUID v4 biçiminde, her seferinde farklı kimlik üretir', () => {
    const ids = Array.from({ length: 100 }, newId)
    for (const id of ids) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    }
    expect(new Set(ids).size).toBe(100)
  })
})
