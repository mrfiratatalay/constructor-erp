/**
 * Demo dünyasını kuran küçük API istemcisi. Her örnek bir kişinin telefonu gibidir: kendi oturum çerezini taşır,
 * böylece şefin yazdığı şefin adıyla, patronunki patronun adıyla kaydedilir.
 */
export class Session {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.cookie = ''
  }

  get(path) {
    return this.request('GET', path)
  }

  post(path, body) {
    return this.request('POST', path, body)
  }

  put(path, body) {
    return this.request('PUT', path, body)
  }

  patch(path, body) {
    return this.request('PATCH', path, body)
  }

  delete(path) {
    return this.request('DELETE', path)
  }

  /** Dosya yükler (multipart): files = [{ name, type, data }], hepsi aynı alan adıyla. */
  async upload(path, field, files) {
    const form = new FormData()
    for (const file of files) form.append(field, new Blob([file.data], { type: file.type }), file.name)
    const response = await fetch(`${this.baseUrl}${path}`, { method: 'POST', headers: { cookie: this.cookie }, body: form })
    if (!response.ok) throw new Error(`POST ${path} → ${response.status}: ${await response.text()}`)
    return response.json()
  }

  async request(method, path, body) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'content-type': 'application/json', cookie: this.cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    this.remember(response)
    if (!response.ok) {
      throw new Error(`${method} ${path} → ${response.status}: ${await response.text()}`)
    }
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }

  remember(response) {
    const cookies = response.headers.getSetCookie()
    if (cookies.length > 0) {
      this.cookie = cookies.map((cookie) => cookie.split(';')[0]).join('; ')
    }
  }
}

export async function signIn(baseUrl, credentials) {
  const session = new Session(baseUrl)
  await session.post('/auth/login', credentials)
  return session
}

/** Patron kişiye giriş linki üretir, kişi linki açar: uygulamadaki "Giriş linki gönder" yolunun aynısı. */
export async function signInAs(owner, memberId) {
  const link = await owner.post(`/team/members/${memberId}/login-link`)
  const session = new Session(owner.baseUrl)
  await session.post('/auth/invites/accept', { token: link.url.slice(link.url.lastIndexOf('/') + 1) })
  return session
}

/** Kişi, patronun WhatsApp grubuna attığı firma bağlantısını açıp adını ve numarasını yazarak katılır. */
export async function joinCompany(baseUrl, token, person) {
  const session = new Session(baseUrl)
  await session.post(`/join/${token}`, { fullName: person.name, phone: person.phone })
  const me = await session.get('/auth/me')
  return { session, id: me.id }
}
