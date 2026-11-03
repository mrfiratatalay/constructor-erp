import { badRequest } from '@/core/demo/server/demoError'

/** Formdan gelen yazı: baştaki ve sondaki boşluk atılır, boş bırakılan alan hiç yazılmamış sayılır. */
export function tidy(text: unknown): string | null {
  if (typeof text !== 'string') return null
  return text.trim() || null
}

/** "ABC İnşaat" ile "abc inşaat" aynı addır; Türkçe harf kuralıyla (I/ı, İ/i) karşılaştırılır. */
export const sameName = (a: string, b: string) => a.toLocaleLowerCase('tr') === b.toLocaleLowerCase('tr')

/** Sınırı aşan yazıda kullanıcıya hangi alanın uzun olduğu söylenir. */
export function limited(text: string | null, max: number, field: string): string | null {
  if (text && text.length > max) throw badRequest(`${field} en çok ${max} harf olabilir.`)
  return text
}

const DAY = /^\d{4}-\d{2}-\d{2}$/

/** Sevkiyatın günü: '2026-11-03'. */
export function dayFrom(value: unknown): string {
  if (typeof value !== 'string' || !DAY.test(value) || Number.isNaN(Date.parse(value))) {
    throw badRequest('Geçerli bir tarih seç.')
  }
  return value
}
