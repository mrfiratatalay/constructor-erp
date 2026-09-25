import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test'

/** Backend "bugün"ü şantiyenin saatine göre sayar (app.timezone); test de aynı günü kullanır. */
const TODAY = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' })

export interface SeededSite {
  id: string
  name: string
  workers: Record<string, string>
}

interface Absence {
  fullName: string
  reason: 'SICK' | 'UNEXCUSED' | 'OTHER'
  note: string
}

/**
 * Şantiye ve personel API'den kurulur (girişli sayfanın çereziyle): test edilen şey yoklama, kurulum değil.
 * Ad her seferinde farklıdır; e2e veritabanı testler arasında boşaltılmaz.
 */
export async function seedSite(request: APIRequestContext, prefix: string, fullNames: string[]): Promise<SeededSite> {
  const name = `${prefix} ${Date.now() % 100000}`
  const site = await (await request.post('/api/sites', { data: { name } })).json()
  const workers: Record<string, string> = {}
  for (const fullName of fullNames) {
    const worker = await (await request.post(`/api/sites/${site.id}/workers`, { data: { fullName } })).json()
    workers[fullName] = worker.id
  }
  return { id: site.id, name, workers }
}

/** Bugünün yoklaması: bir kişi gelmedi, diğerleri geldi. */
export async function takeToday(request: APIRequestContext, site: SeededSite, absence: Absence) {
  const entries = Object.entries(site.workers).map(([fullName, workerId]) =>
    fullName === absence.fullName
      ? { workerId, status: 'ABSENT', reason: absence.reason, note: absence.note }
      : { workerId, status: 'PRESENT', reason: null, note: null },
  )
  const response = await request.post(`/api/sites/${site.id}/attendance/${TODAY}`, { data: { entries } })
  expect(response.status()).toBe(201)
}

/** Şantiyenin bugünkü kaydı: Yoklama ekranı bütün firmayı gösterdiği için sonuç ekrandan değil buradan okunur. */
export async function todayOf(request: APIRequestContext, siteId: string) {
  return (await request.get(`/api/sites/${siteId}/attendance/${TODAY}`)).json()
}

export async function postCount(request: APIRequestContext, siteId: string): Promise<number> {
  return (await (await request.get(`/api/posts?siteId=${siteId}`)).json()).items.length
}

/** Aynı akış iki kabukta; yalnızca parçaların yeri farklıdır (mobil Vant, masaüstü Element Plus). */
export function attendanceParts(page: Page, mobile: boolean) {
  const rowsOf = (scope: Locator) => scope.locator(mobile ? '.van-cell' : '.list-row')
  const composer = page.locator(mobile ? '.site-composer' : '.composer-bar')
  return {
    rowsOf,
    plus: composer.getByRole('button', { name: 'Ekle', exact: true }),
    menu: page.locator(mobile ? '.van-action-sheet' : '.el-dropdown-menu:visible'),
    sheet: mobile ? page.locator('.attendance') : page.getByRole('dialog', { name: /Yoklama — / }),
    mark: (fullName: string) => (mobile ? page.locator('.mark') : page.getByRole('dialog', { name: fullName })),
    workerForm: mobile ? page.locator('.worker-form') : page.getByRole('dialog', { name: 'Personel ekle' }),
    sites: rowsOf(page.locator(mobile ? '.mobile-page' : '.split-view__list')),
    days: rowsOf(page.locator(mobile ? '.mobile-page' : '.site-attendance__list')),
    day: page.locator(mobile ? '.day-sheet' : '.day-detail'),
    /** Yoklama ekranı (bugün): kişinin satırı ve ona dokununca açılan küçük seçim. */
    rollRow: (fullName: string) => rowsOf(page.locator('.roll-group')).filter({ hasText: fullName }),
    quickMenu: page.locator(mobile ? '.van-action-sheet:visible' : '.el-dropdown-menu:visible'),
  }
}
