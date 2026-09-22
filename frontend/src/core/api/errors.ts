import { isAxiosError } from 'axios'

const FALLBACK = 'Bir şeyler ters gitti. İnternet bağlantını kontrol edip tekrar dene.'

/** Backend hataları RFC 9457 formatında gelir; kullanıcıya `detail` alanındaki Türkçe mesajı gösteririz. */
export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string' && detail.length > 0) return detail
  }
  return FALLBACK
}

export function isUnauthorized(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401
}
