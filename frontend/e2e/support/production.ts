import {
  expect,
  request as playwrightRequest,
  type APIRequestContext,
  type Browser,
  type Page,
  type TestInfo,
} from '@playwright/test'

const uniquePhone = () => `05${String(Math.floor(Math.random() * 1e9)).padStart(9, '0')}`

/**
 * Firmanın bağlantısıyla katılan (API) ve patronun rol verdiği biri: şef (SITE_LEAD), depo sorumlusu (WAREHOUSE)
 * ya da çalışan olarak kalan (WORKER). Oturumu ve kimliği döner.
 */
export async function memberAs(
  owner: APIRequestContext,
  baseURL: string,
  token: string,
  member: MemberSpec,
) {
  const api = await playwrightRequest.newContext({ baseURL })
  const phone = uniquePhone()
  expect(
    (await api.post(`/api/join/${token}`, { data: { fullName: member.fullName, phone } })).ok(),
  ).toBe(true)
  const id: string = (await (await api.get('/api/auth/me')).json()).id
  if (member.role !== 'WORKER') {
    const data = { fullName: member.fullName, phone, role: member.role, active: true }
    expect((await owner.patch(`/api/team/members/${id}`, { data })).ok()).toBe(true)
  }
  return { api, id }
}

interface MemberSpec {
  fullName: string
  role: 'SITE_LEAD' | 'WAREHOUSE' | 'WORKER'
}

/** Başka birinin telefonu: aynı cihaz türünde ayrı bir tarayıcı, o kişinin oturumuyla. */
export async function pageOf(
  browser: Browser,
  testInfo: TestInfo,
  api: APIRequestContext,
): Promise<Page> {
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, baseURL } =
    testInfo.project.use
  const storageState = await api.storageState()
  const context = await browser.newContext({
    viewport,
    userAgent,
    deviceScaleFactor,
    isMobile,
    hasTouch,
    baseURL,
    storageState,
  })
  return context.newPage()
}

/** Şef API'den imalat açar ve günlük girer (ekran dışı kurulum). */
export async function itemViaApi(lead: APIRequestContext, siteId: string, total: number) {
  const data = { trade: 'Demir İşleri', totalQuantity: total, unit: 'ton' }
  const response = await lead.post(`/api/sites/${siteId}/production/items`, { data })
  expect(response.status()).toBe(201)
  return (await response.json()).id as string
}

/**
 * İmalat iki kabukta aynı akıştır; yalnızca parçaların yeri farklıdır: masaüstünde Element Plus (sağdan çekmece,
 * açılır liste, anahtar), telefonda Vant (alttan pencere, çip, anahtar).
 */
export function productionParts(page: Page, mobile: boolean) {
  const panel = (title: string) =>
    mobile
      ? page.locator('.van-action-sheet:visible').filter({ hasText: title })
      : page.getByRole('dialog', { name: title })
  const card = (name: string) => page.getByTestId('production-item').filter({ hasText: name })
  const newItem = panel('Yeni İş Kalemi')
  const entry = panel('Günlük İlerleme')
  return {
    card,
    entry,
    history: page.getByTestId('production-history-entry'),
    /** "Yeni İş Kalemi": tür (hazır seçenek), yeni taşeron (yazılarak), toplam miktar; birim "ton" gelir. */
    createItem: async (trade: string, crew: string, total: string) => {
      await page
        .getByRole('button', { name: /İş kalemi ekle|İlk iş kalemini ekle/ })
        .first()
        .click()
      if (mobile) {
        await newItem.getByRole('button', { name: trade, exact: true }).click()
        await newItem.getByPlaceholder('Seç ya da yeni taşeron yaz').fill(crew)
      } else {
        await pickOrType(page, newItem.locator('.el-select').nth(0), trade)
        await pickOrType(page, newItem.locator('.el-select').nth(1), crew)
      }
      await newItem.getByPlaceholder('120').fill(total)
      await newItem.getByRole('button', { name: 'İş kalemini oluştur' }).click()
      await expect(newItem).toBeHidden()
    },
    /** Kartın "Güncelle"si → bugün yapılan → (istenirse Saha'ya yansıt) → kaydet. */
    enter: async (name: string, quantity: string, onField = false) => {
      await card(name).getByRole('button', { name: 'Güncelle' }).click()
      await entry.getByPlaceholder('3,5').fill(quantity)
      if (onField) await entry.locator(mobile ? '.van-switch' : '.el-switch').click()
      await entry.getByRole('button', { name: 'Güncellemeyi kaydet' }).click()
    },
    /** Günlük giriş penceresini kaydetmeden kapatır (Vant'ın alttan penceresi Escape'i dinlemez). */
    closeEntry: async () => {
      if (mobile) await entry.locator('.van-action-sheet__close').click()
      else await page.keyboard.press('Escape')
      await expect(entry).toBeHidden()
    },
    openDetail: async (name: string) => {
      const target = card(name)
      await (
        mobile ? target.locator('.van-cell').first() : target.getByRole('button', { name: 'Detay' })
      ).click()
    },
    /** Toplamı aşan girişin sorusu (masaüstünde ElMessageBox, telefonda Vant Dialog). */
    question: page.locator(mobile ? '.van-dialog:visible' : '.el-message-box:visible'),
  }
}

/** Element Plus'ın yazılabilir açılır listesi: yazılır, Enter ile seçilir (listede yoksa yeni değer olur). */
async function pickOrType(page: Page, select: ReturnType<Page['locator']>, text: string) {
  await select.click()
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
}
