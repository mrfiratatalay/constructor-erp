// Demo verisini ürünün kendi API'si üzerinden kuran küçük istemci. Her kişi kendi oturumuyla (çereziyle) yazar:
// kayıtlar gerçek kullanımdaki gibi doğru yazarla ve doğru izinle oluşur. Tarayıcıdan geçmez, Vite vekiline gider.
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

export const BASE = process.env.DEMO_BASE ?? 'http://localhost:5173'

async function failed(response, method, path) {
  const text = await response.text().catch(() => '')
  return new Error(`${method} ${path} → ${response.status} ${text.slice(0, 300)}`)
}

export class Session {
  constructor(label) {
    this.label = label
    this.cookie = ''
  }

  remember(response) {
    const cookies = response.headers.getSetCookie?.() ?? []
    const session = cookies.map((value) => value.split(';')[0]).find((pair) => pair.includes('='))
    if (session) this.cookie = session
  }

  async call(method, path, body) {
    const isForm = body instanceof FormData
    const headers = { Accept: 'application/json', ...(this.cookie ? { Cookie: this.cookie } : {}) }
    if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
    const payload = body === undefined ? undefined : isForm ? body : JSON.stringify(body)
    const response = await fetch(BASE + path, { method, headers, body: payload, redirect: 'manual' })
    this.remember(response)
    if (!response.ok) throw await failed(response, method, path)
    const type = response.headers.get('content-type') ?? ''
    return type.includes('json') ? response.json() : null
  }

  get = (path) => this.call('GET', path)
  post = (path, body) => this.call('POST', path, body)
  put = (path, body) => this.call('PUT', path, body)
  patch = (path, body) => this.call('PATCH', path, body)

  async login(email, password) {
    await this.post('/api/auth/login', { email, password })
    return this
  }
}

/** Diskteki dosyayı çok parçalı formun dosya alanına koyar; tür uzantıdan okunur. */
export async function fileOf(path) {
  const types = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', mp4: 'video/mp4',
    m4a: 'audio/mp4', ogg: 'audio/ogg', webm: 'audio/webm', pdf: 'application/pdf' }
  const extension = path.split('.').pop().toLowerCase()
  return new File([await readFile(path)], basename(path), { type: types[extension] ?? 'application/octet-stream' })
}

export function form(fields) {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue
    for (const item of Array.isArray(value) ? value : [value]) data.append(key, item)
  }
  return data
}
