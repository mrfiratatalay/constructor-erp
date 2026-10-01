import { describe, expect, it, vi } from 'vitest'
import { compressPhoto } from '@/core/posts/photoCompression'

interface CompressionOptions {
  useWebWorker: boolean
  libURL: string
}

const compress = vi.hoisted(() => vi.fn<(file: File, options: CompressionOptions) => Promise<Blob>>())
vi.mock('browser-image-compression', () => ({ default: compress }))

describe('compressPhoto', () => {
  it('küçültme kütüphanesini CDN yerine uygulamanın kendi adresinden yükletir', async () => {
    compress.mockResolvedValue(new Blob(['x'], { type: 'image/jpeg' }))

    await compressPhoto(new File(['foto'], 'saha.png', { type: 'image/png' }))

    const options = compress.mock.calls[0]?.[1]
    expect(options?.useWebWorker).toBe(true)
    expect(new URL(options?.libURL ?? '').origin).toBe(window.location.origin)
    expect(options?.libURL).toContain('browser-image-compression')
    expect(options?.libURL).not.toContain('jsdelivr')
  })

  it('küçültme başarısız olursa asıl dosya gider', async () => {
    compress.mockRejectedValue(new Error('okunamadı'))
    const file = new File(['foto'], 'saha.heic', { type: 'image/heic' })

    expect(await compressPhoto(file)).toBe(file)
  })
})
