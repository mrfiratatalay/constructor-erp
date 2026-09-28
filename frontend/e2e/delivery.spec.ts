import { expect, test, type APIRequestContext, type Browser, type TestInfo } from '@playwright/test'
import { deliveryParts, WORK_PHOTO } from './support/delivery'
import {
  createSite,
  createTask,
  joinFromLink,
  joinMember,
  joinToken,
  makeLead,
  ownerApi,
  unique,
} from './support/people'

// Görev ve iş teslimi (TASARIM.md "Görev kartı", "İş teslimi"): şef görevi sohbetin ＋'sından verir, sohbete görev
// kartı düşer; çalışan işi karttan fotoğrafla teslim eder; şef onaylar ya da eksiğini fotoğrafın üstünde gösterip
// geri gönderir; çalışan tamamlayıp yeniden teslim eder. Görevler sayfasından açılan görev de aynı kartı düşürür.

/**
 * Kart, görevin ve teslimin ayrıntısını ayrı bir istekle okur. Bütün takım dört cihazda paralel koşarken bu istek
 * sayfa yenilendikten sonra 5 sn'yi aştı (mesajlar gelmişti, kartlar henüz dolmamıştı): kart beklemeleri daha uzun.
 */
const CARD = { timeout: 15_000 }

/** Şefin telefonu: aynı cihaz türünde ayrı bir tarayıcı, şefin oturumuyla. */
async function phoneOf(browser: Browser, testInfo: TestInfo, api: APIRequestContext) {
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

test('şef ＋ → Görev verir; çalışan karttan teslim eder; şef eksik der; çalışan tamamlar; şef onaylar', async ({
  page,
  browser,
  isMobile,
  baseURL,
}, testInfo) => {
  // İki telefon, iki teslim ve her birinde fotoğrafın sunucuda işlenmesi: dört cihaz paralel koşarken 30 sn'yi
  // aşıyor (Android'de 22 sn sürdü, öbürleri 30 sn sınırında kesildi; hata yoktu, süre yetmedi).
  test.setTimeout(90_000)
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'C Blok')
  const token = await joinToken(owner)
  const lead = await joinMember(baseURL!, token, unique('Mehmet Şef'))
  await makeLead(owner, lead)
  const workerName = unique('Ali Usta')
  await joinFromLink(page, token, workerName)
  const worker = deliveryParts(page, isMobile)

  const leadPage = await phoneOf(browser, testInfo, lead.api)
  const chief = deliveryParts(leadPage, isMobile)
  await leadPage.goto(`/santiyeler/${site.id}`)
  await chief.openFromPlus('📋 Görev')
  await chief.assignTask('Kalıp sökülecek', workerName)
  await expect(chief.taskCards.first()).toContainText('Kalıp sökülecek', CARD)
  await expect(chief.taskCards.first()).toContainText(`👤 ${workerName}`)
  await expect(chief.taskCards.first()).toContainText('🕐 Yarın')
  await expect(chief.taskCards.first()).toContainText('Bekliyor')
  await expect(chief.taskCards.getByRole('button', { name: '✅ İŞİ TESLİM ET' })).toHaveCount(0)

  await page.goto(`/santiyeler/${site.id}`)
  await worker.taskCards.first().getByRole('button', { name: '✅ İŞİ TESLİM ET' }).click(CARD)
  await expect(worker.deliverPanel).toContainText('Kalıp sökülecek')
  await worker.deliverPanel.locator('input[type=file]').setInputFiles(WORK_PHOTO)
  await worker.deliverPanel.getByRole('button', { name: '✅ İŞİ TESLİM ET' }).click()
  await expect(worker.cards.first()).toContainText('Kontrol bekliyor', CARD)
  await expect(worker.taskCards.first()).toContainText('Kontrol bekliyor', CARD)
  await expect(worker.cards.getByRole('button', { name: 'İNCELE' })).toHaveCount(0)

  await leadPage.reload()
  await chief.cards.getByRole('button', { name: 'İNCELE' }).click(CARD)
  await chief.reviewPanel.getByRole('button', { name: '❌ EKSİK VAR' }).click()
  await chief.missingPanel.getByTestId('markable-photo').click({ position: { x: 40, y: 30 } })
  await chief.noteField.fill('Köşedeki kalıp duruyor')
  await chief.missingPanel.getByRole('button', { name: 'GÖNDER' }).click()
  await expect(chief.cards.filter({ hasText: 'İŞ TAMAMLANMADI' })).toBeVisible(CARD)

  await page.reload()
  const returned = worker.cards.filter({ hasText: 'İŞ TAMAMLANMADI' })
  await expect(returned).toContainText('Eksik: Köşedeki kalıp duruyor', CARD)
  await expect(returned.locator('.markable-photo__dot')).toBeVisible()
  await expect(worker.taskCards.first()).toContainText('Eksik var', CARD)
  await returned.getByRole('button', { name: '✅ İŞİ TESLİM ET' }).click()
  await worker.deliverPanel.locator('input[type=file]').setInputFiles(WORK_PHOTO)
  await worker.deliverPanel.getByRole('button', { name: '✅ İŞİ TESLİM ET' }).click()
  await expect(worker.cards.filter({ hasText: 'Kontrol bekliyor' })).toHaveCount(1, CARD)

  await leadPage.reload()
  await chief.cards.getByRole('button', { name: 'İNCELE' }).click(CARD)
  await chief.reviewPanel.getByRole('button', { name: '✅ ONAYLA' }).click()
  await expect(chief.cards.filter({ hasText: '✅ TAMAMLANDI' })).toBeVisible(CARD)
  await expect(chief.taskCards.first()).toContainText('Tamamlandı', CARD)
  const tasks = await (await owner.get(`/api/sites/${site.id}/tasks`)).json()
  expect(tasks.find((task: { title: string }) => task.title === 'Kalıp sökülecek')).toMatchObject({
    status: 'DONE',
  })
})

test("Görevler'den açılan görev sohbette kart olur; çalışan ＋ → İş Teslim Et ile de teslim eder", async ({
  page,
  isMobile,
  baseURL,
}) => {
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'D Blok')
  const token = await joinToken(owner)
  await joinFromLink(page, token, unique('Ali Usta'))
  const workerId = (await (await page.request.get('/api/auth/me')).json()).id
  await createTask(owner, site.id, 'Beton dökülecek', workerId)
  const worker = deliveryParts(page, isMobile)

  await page.goto(`/santiyeler/${site.id}`)
  await expect(worker.taskCards.first()).toContainText('Beton dökülecek', CARD)
  await expect(
    worker.taskCards.first().getByRole('button', { name: '✅ İŞİ TESLİM ET' }),
  ).toBeVisible()
  const menu = await worker.plusMenu()
  await expect(menu.getByText('✅ İş Teslim Et')).toBeVisible()
  await expect(menu.getByText('📋 Görev')).toHaveCount(0)
  await menu.getByText('✅ İş Teslim Et').click()
  await worker.deliverPanel.locator('input[type=file]').setInputFiles(WORK_PHOTO)
  await worker.deliverPanel.getByRole('button', { name: '✅ İŞİ TESLİM ET' }).click()
  await expect(worker.cards.first()).toContainText('Kontrol bekliyor', CARD)
  await expect(worker.taskCards.first()).toContainText('Kontrol bekliyor', CARD)
})

test('açık işi olmayan çalışan "İş Teslim Et"te boş liste görür', async ({
  page,
  isMobile,
  baseURL,
}) => {
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'Boş iş')
  const token = await joinToken(owner)
  const other = await joinMember(baseURL!, token, unique('Başka Usta'))
  await createTask(owner, site.id, 'Boya', other.id)
  await joinFromLink(page, token, unique('İşsiz Usta'))
  const worker = deliveryParts(page, isMobile)

  await page.goto(`/santiyeler/${site.id}`)
  await worker.openFromPlus()

  await expect(page.getByText('Sana verilmiş açık iş yok.')).toBeVisible()
})
