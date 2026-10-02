// Video yığınının adresi ve hesapları (scripts/stack.mjs reset'in ürettiği .cache/stack.json).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const VIDEO = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

export const CACHE = join(VIDEO, '.cache')

/** Hesaplar ve şifreler: yalnızca yerel, git'e girmez. */
export const secrets = () => JSON.parse(readFileSync(join(CACHE, 'stack.json'), 'utf8'))

/** Bir tarayıcı bağlamını API üzerinden oturum açtırır: aynı bağlamdaki sayfalar da o kişi olarak açılır. */
export const login = async (context, account) => {
  const response = await context.request.post(`${secrets().web}/api/auth/login`, {
    data: { email: account.email, password: account.password },
  })
  if (!response.ok()) throw new Error(`Giriş olmadı (${account.email}): ${response.status()}`)
}

/** Sayfa dışı API çağrısı: hata olursa ayrıntısıyla durur, sessizce devam etmez. */
export const api = async (context, method, path, data) => {
  const response = await context.request.fetch(`${secrets().web}${path}`, { method, data })
  const text = await response.text()
  if (!response.ok()) throw new Error(`${method} ${path} → ${response.status()}: ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}
