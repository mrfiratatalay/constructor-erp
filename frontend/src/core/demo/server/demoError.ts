/**
 * Sahte backend'in hata cevabı. Gerçek backend gibi RFC 9457 gövdesiyle döner: arayüz `detail`'i gösterir
 * (core/api/errors), kilitli çalışma alanını `code`'dan tanır.
 */
export class DemoError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
  ) {
    super(message)
  }

  body() {
    return { status: this.status, detail: this.message, ...(this.code ? { code: this.code } : {}) }
  }
}

export const notFound = (what = 'Kayıt') => new DemoError(404, `${what} bulunamadı.`)
export const forbidden = (message = 'Bu işlem için yetkin yok.') => new DemoError(403, message)
export const badRequest = (message: string) => new DemoError(400, message)
export const unauthorized = () => new DemoError(401, 'Oturum açman gerekiyor.')
