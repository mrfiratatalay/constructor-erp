import { describe, expect, it } from 'vitest'
import { whatsappShareUrl } from '@/core/team/loginLink'

describe('whatsappShareUrl', () => {
  it('Türkçe karakterleri ve linki bozmadan WhatsApp mesajına koyar', () => {
    const url = whatsappShareUrl('Şükrü Usta', 'http://localhost:5173/davet/abc')
    const message = decodeURIComponent(url.replace('https://wa.me/?text=', ''))
    expect(message).toBe("Merhaba Şükrü Usta, Kızılkan Şantiye'ye girmek için bu linke dokun: http://localhost:5173/davet/abc")
  })
})
