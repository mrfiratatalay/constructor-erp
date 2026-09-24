import { describe, expect, it } from 'vitest'
import { whatsappShareUrl } from '@/core/team/loginLink'

const LINK = 'http://localhost:5173/davet/abc'

describe('whatsappShareUrl', () => {
  it('Türkçe karakterleri ve linki bozmadan WhatsApp mesajına koyar', () => {
    const url = new URL(whatsappShareUrl({ fullName: 'Şükrü Usta', phone: null }, LINK))
    expect(url.searchParams.get('text')).toBe(
      `Merhaba Şükrü Usta, Kızılkan Şantiye'ye girmek için bu linke dokun: ${LINK}`,
    )
  })

  it('numara varsa WhatsApp doğrudan o kişinin sohbetinde açılır', () => {
    const url = new URL(whatsappShareUrl({ fullName: 'Şükrü Usta', phone: '0532 123 45 67' }, LINK))
    expect(url.pathname).toBe('/905321234567')
  })
})
