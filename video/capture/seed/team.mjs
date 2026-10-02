// Ekip ve şantiyeler: kişiler firmanın katılma bağlantısıyla gerçekten katılır, patron rollerini verir.
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { openContext } from '../lib/browser.mjs'
import { CACHE, api, secrets } from '../lib/stack.mjs'
import { literal, sql } from '../lib/sql.mjs'

export const PEOPLE = {
  ayse: { fullName: 'Ayşe Kara', phone: '0500 111 22 33', role: 'SITE_LEAD' },
  mehmet: { fullName: 'Mehmet Öztürk', phone: '0500 222 33 44', role: 'WAREHOUSE' },
  musa: { fullName: 'Musa Çetin', phone: '0500 333 44 55', role: 'WORKER' },
}

export const sessionFile = (key) => join(CACHE, 'sessions', `${key}.json`)

/** Her kişi kendi tarayıcı bağlamında katılır; oturumu sonraki çekimler için saklanır. */
export const joinTeam = async (browser, patron) => {
  const { url } = await api(patron, 'GET', '/api/company/join-link')
  const token = url.slice(url.lastIndexOf('/') + 1)
  const team = {}
  for (const [key, person] of Object.entries(PEOPLE)) {
    const context = await openContext(browser)
    await api(context, 'POST', `/api/join/${token}`, { fullName: person.fullName, phone: person.phone })
    const me = await api(context, 'GET', '/api/auth/me')
    await api(patron, 'PATCH', `/api/team/members/${me.id}`, { ...person, active: true })
    await context.storageState({ path: sessionFile(key) })
    team[key] = { context, id: me.id }
  }
  return team
}

export const createSites = async (patron) => {
  const extra = [
    { name: 'Kaşüstü Rezidans', address: 'Kaşüstü, Yomra / Trabzon' },
    { name: 'Sahil Evleri', address: 'Akçaabat / Trabzon' },
  ]
  for (const site of extra) await api(patron, 'POST', '/api/sites', site)
  const sites = await api(patron, 'GET', '/api/sites')
  return Object.fromEntries(sites.map((site) => [site.name, site.id]))
}

const MIME = { '.png': 'image/png', '.mp3': 'audio/mpeg' }

/** Şantiye sohbetine mesaj (fotoğraf, ses ya da metin); saati sonradan gerçekçi bir ana çekilir. */
export const post = async (context, siteId, message) => {
  const id = randomUUID()
  const multipart = { id, siteId, issue: String(Boolean(message.issue)), fieldUpdate: String(Boolean(message.field)) }
  if (message.body) multipart.body = message.body
  if (message.file) {
    const file = message.file
    multipart.files = { name: basename(file), mimeType: MIME[file.slice(file.lastIndexOf('.'))], buffer: readFileSync(file) }
  }
  const response = await context.request.post(`${secrets().web}/api/posts`, { multipart })
  if (!response.ok()) throw new Error(`Mesaj gönderilemedi: ${response.status()} ${await response.text()}`)
  if (message.at) sql(`update posts set created_at = ${literal(message.at)} where id = ${literal(id)};`)
  return id
}
