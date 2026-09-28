import {
  expect,
  request as playwrightRequest,
  type APIRequestContext,
  type Page,
} from '@playwright/test'
import { OWNER } from './app'

/** e2e veritabanı testler arasında boşaltılmaz: adlar ve numaralar her seferinde farklıdır. */
export const unique = (prefix: string) => `${prefix} ${Math.floor(Math.random() * 1e6)}`
const uniquePhone = () => `05${String(Math.floor(Math.random() * 1e9)).padStart(9, '0')}`

/**
 * Sayfadan bağımsız bir API oturumu: başka birinin telefonu gibi. Kurulum ve doğrulama bununla yapılır;
 * test edilen şey sayfadaki kişinin ekranıdır.
 */
export async function ownerApi(baseURL: string): Promise<APIRequestContext> {
  const api = await playwrightRequest.newContext({ baseURL })
  expect((await api.post('/api/auth/login', { data: OWNER })).ok()).toBe(true)
  return api
}

export async function createSite(api: APIRequestContext, prefix: string) {
  const name = unique(prefix)
  const site = await (await api.post('/api/sites', { data: { name } })).json()
  return { id: site.id as string, name }
}

/** Patronun WhatsApp grubuna attığı firma bağlantısının anahtarı. */
export async function joinToken(api: APIRequestContext): Promise<string> {
  const url: string = (await (await api.get('/api/company/join-link')).json()).url
  return url.slice(url.lastIndexOf('/') + 1)
}

/** Başka bir kişi kendi telefonundan katılır (API; bağlantıyla gelen çalışandır): oturumu ve kimliği döner. */
export async function joinMember(baseURL: string, token: string, fullName: string) {
  const api = await playwrightRequest.newContext({ baseURL })
  const phone = uniquePhone()
  const joined = await api.post(`/api/join/${token}`, { data: { fullName, phone } })
  expect(joined.ok()).toBe(true)
  const me = await (await api.get('/api/auth/me')).json()
  return { api, id: me.id as string, fullName, phone }
}

/** Patron bir çalışanı şef yapar (Katılımcılar'daki "Şef yap"). */
export async function makeLead(
  owner: APIRequestContext,
  member: { id: string; fullName: string; phone: string },
) {
  const data = { fullName: member.fullName, phone: member.phone, role: 'SITE_LEAD', active: true }
  expect((await owner.patch(`/api/team/members/${member.id}`, { data })).ok()).toBe(true)
}

/** Sayfadaki kişi firmanın bağlantısını açar, adını ve numarasını yazıp katılır (ekrandan). */
export async function joinFromLink(page: Page, token: string, fullName: string) {
  await page.goto(`/katil/${token}`)
  await page.getByPlaceholder('Ahmet Yılmaz').fill(fullName)
  await page.getByPlaceholder('0532 123 45 67').fill(uniquePhone())
  await page.getByRole('button', { name: 'Katıl' }).click()
  // Katılma isteği bütün takım dört cihazda paralel koşarken bir kez 4 sn sürdü (200 döndü); varsayılan 5 sn
  // bekleme, ardından sayfanın yüklenmesiyle birlikte dar kalıyor.
  await expect(page).toHaveURL(/\/santiyeler$/, { timeout: 15_000 })
}

/** Patron şantiyede bir iş açar ve birine verir. */
export async function createTask(
  api: APIRequestContext,
  siteId: string,
  title: string,
  assigneeId: string,
) {
  const response = await api.post(`/api/sites/${siteId}/tasks`, {
    data: { title, assigneeId, priority: 'NORMAL' },
  })
  expect(response.status()).toBe(201)
  return (await response.json()).id as string
}
