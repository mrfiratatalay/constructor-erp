import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { DemoError } from './demoError'
import { bodyOf, pathOf, queryOf } from './demoRequest'
import { handle } from './demoServer'

// Gerçek ağdaki gibi kısa bir bekleme: yükleniyor durumları bir an görünür, sıra ve zamanlama gerçeğe yakın kalır.
const LATENCY_MS = 80

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown): AxiosResponse {
  return { data, status, statusText: String(status), headers: new AxiosHeaders(), config, request: {} }
}

/** Axios'un kendi hatası: arayüzdeki hata yakalama (401 → giriş, WORKSPACE_LOCKED → kilit) değişmeden çalışır. */
function failure(config: InternalAxiosRequestConfig, error: unknown): AxiosError {
  if (!(error instanceof DemoError)) console.error('[demo]', error)
  const demoError = error instanceof DemoError ? error : new DemoError(500, 'Demoda beklenmeyen bir hata oluştu.')
  const code = demoError.status < 500 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE
  return new AxiosError(demoError.message, code, config, {}, respond(config, demoError.status, demoError.body()))
}

/**
 * Axios'un ağ katmanının yerine geçer. Bütün istekler zaten tek kapıdan (core/api/http.ts) geçtiği için uygulamanın
 * geri kalanı backend'in gerçek mi sahte mi olduğunu bilmez.
 */
export const demoAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
  try {
    const method = (config.method ?? 'get').toUpperCase()
    const data = await handle(method, pathOf(config), { query: queryOf(config), ...bodyOf(config) })
    return respond(config, 200, data)
  } catch (error) {
    throw failure(config, error)
  }
}
