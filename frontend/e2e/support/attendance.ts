import {
  expect,
  request as playwrightRequest,
  type APIRequestContext,
  type Page,
} from '@playwright/test'
import { OWNER } from './app'

/** Backend "bugün"ü şantiyenin saatine göre sayar (app.timezone); test de aynı günü kullanır. */
export const TODAY = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' })

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

/** Başka bir çalışan kendi telefonundan katılır (API): oturumu ve kimliği döner. */
export async function joinMember(baseURL: string, token: string, fullName: string) {
  const api = await playwrightRequest.newContext({ baseURL })
  const joined = await api.post(`/api/join/${token}`, { data: { fullName, phone: uniquePhone() } })
  expect(joined.ok()).toBe(true)
  const me = await (await api.get('/api/auth/me')).json()
  return { api, id: me.id as string }
}

/** Sayfadaki kişi firmanın bağlantısını açar, adını ve numarasını yazıp katılır (ekrandan). */
export async function joinFromLink(page: Page, token: string, fullName: string) {
  await page.goto(`/katil/${token}`)
  await page.getByPlaceholder('Ahmet Yılmaz').fill(fullName)
  await page.getByPlaceholder('0532 123 45 67').fill(uniquePhone())
  await page.getByRole('button', { name: 'Katıl' }).click()
  await expect(page).toHaveURL(/\/santiyeler$/)
}

/** Patronun gördüğü bugünkü kaydı: kişi katılmadıysa ve işaretlenmediyse null. */
export async function todayRecordOf(api: APIRequestContext, memberId: string) {
  const day = await (await api.get(`/api/roll-calls/days/${TODAY}`)).json()
  const row = day.members.find(
    (member: { member: { id: string } }) => member.member.id === memberId,
  )
  return row?.record ?? null
}

/** Aynı akış iki kabukta; yalnızca parçaların yeri farklıdır (mobil Vant, masaüstü Element Plus). */
export function rollCallParts(page: Page, mobile: boolean) {
  const composer = page.locator(mobile ? '.site-composer' : '.composer-bar')
  return {
    plus: composer.getByRole('button', { name: 'Ekle', exact: true }),
    menu: page.locator(mobile ? '.van-action-sheet' : '.el-dropdown-menu:visible'),
    cards: page.locator('.roll-call-card'),
    /** Patronun küçük seçimindeki bir seçenek (mobilde alttan, masaüstünde açılır menü). */
    choice: (label: string) =>
      mobile
        ? page.locator('.van-action-sheet__item', { hasText: label })
        : page.getByRole('menuitem', { name: label }),
    /** Yoklama listesinde bir kişinin satırı; bölüm: roll-missing, roll-absent ya da roll-present. */
    row: (section: string, fullName: string) =>
      page
        .getByTestId(section)
        .locator(mobile ? '.van-cell' : '.roll-member-row', { hasText: fullName }),
    /** Kişinin takviminde bugünün hücresi. */
    todayCell: mobile
      ? page.locator('.van-calendar__day', { hasText: new RegExp(`^${Number(TODAY.slice(8))}`) })
      : page.locator(`[data-day="${TODAY}"]`),
    /**
     * Ayın Excel dosyasını indirir. Düğme listenin başlığındadır: mobilde takvim ayrı sayfa olduğu için önce
     * listeye dönülür, masaüstünde liste zaten solda durur.
     */
    downloadExcel: async () => {
      if (mobile) await page.goto('/yoklama')
      await page.getByRole('button', { name: 'Excel' }).click()
      const downloading = page.waitForEvent('download')
      const button = mobile
        ? page.getByRole('button', { name: 'İndir' })
        : page.getByRole('link', { name: 'İndir' })
      await button.click()
      return downloading
    },
  }
}
