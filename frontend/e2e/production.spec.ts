import { expect, test } from '@playwright/test'
import { createSite, joinToken, ownerApi, unique } from './support/attendance'
import { itemViaApi, memberAs, pageOf, productionParts } from './support/production'

// İmalat (TASARIM.md "İmalat"): şantiyenin üçüncü sekmesi. Şef imalat açar ve günlük girer ("bugün +3,5 ton");
// sunucu gerçekleşeni, kalanı, yüzdeyi ve durumu hesaplar. Patron, şef ve depo sorumlusu görür; veriyi yalnızca şef
// girer; çalışanın sekmesi yoktur. Şef isterse giriş Saha'ya yansır.

/** Kartlar kendi isteğiyle dolar; dört cihaz paralel koşarken 5 sn dar kalabiliyor. */
const SLOW = { timeout: 15_000 }

test('şef imalat açar ve günlük girer; yapılan, kalan ve yüzde hesaplanır; toplamı aşan giriş sorulur', async ({
  page,
  isMobile,
  baseURL,
}) => {
  test.setTimeout(90_000)
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'İmalat Şantiyesi')
  const token = await joinToken(owner)
  const lead = await memberAs(owner, baseURL!, token, {
    fullName: unique('Mehmet Şef'),
    role: 'SITE_LEAD',
  })
  await page.context().addCookies((await lead.api.storageState()).cookies)
  const production = productionParts(page, isMobile)
  const crew = unique('Kaya Demir')

  await page.goto(`/santiyeler/${site.id}/imalat`)
  await expect(page.getByText('Henüz imalat bulunmuyor')).toBeVisible(SLOW)
  await production.createItem('Demir İşleri', crew, '120')
  await expect(production.card('Demir İşleri')).toContainText('0 / 120 ton', SLOW)
  await expect(production.card('Demir İşleri')).toContainText(crew)

  await production.enter('Demir İşleri', '3,5')
  await expect(production.entry).toBeHidden()
  const card = production.card('Demir İşleri')
  await expect(card).toContainText('3,5 / 120 ton', SLOW)
  await expect(card).toContainText('%2,9')
  await expect(card).toContainText('Bugün +3,5 ton')
  await expect(card).toContainText('116,5 ton kaldı')

  await production.enter('Demir İşleri', '200')
  await expect(production.question).toContainText('Toplamı aşıyor')
  await expect(production.question).toContainText('203,5 ton olacak')
  await production.question.getByRole('button', { name: 'Vazgeç' }).click()
  await expect(production.entry).toBeVisible()
  await production.closeEntry()

  await production.openDetail('Demir İşleri')
  await expect(production.history.first()).toContainText('+3,5 ton', SLOW)
  const board = await (await owner.get(`/api/sites/${site.id}/production`)).json()
  expect(board.items[0]).toMatchObject({
    doneQuantity: 3.5,
    remainingQuantity: 116.5,
    status: 'IN_PROGRESS',
  })
})

test('depo sorumlusu imalatı görür ama giremez; çalışanın İmalat sekmesi yoktur', async ({
  page,
  browser,
  isMobile,
  baseURL,
}, testInfo) => {
  test.setTimeout(90_000)
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'Depo Şantiyesi')
  const token = await joinToken(owner)
  const lead = await memberAs(owner, baseURL!, token, {
    fullName: unique('Şef'),
    role: 'SITE_LEAD',
  })
  const keeper = await memberAs(owner, baseURL!, token, {
    fullName: unique('Depocu'),
    role: 'WAREHOUSE',
  })
  const worker = await memberAs(owner, baseURL!, token, {
    fullName: unique('Usta'),
    role: 'WORKER',
  })
  await itemViaApi(lead.api, site.id, 120)

  await page.context().addCookies((await keeper.api.storageState()).cookies)
  await page.goto(`/santiyeler/${site.id}/imalat`)
  const production = productionParts(page, isMobile)
  await expect(production.card('Demir İşleri')).toContainText('0 / 120 ton', SLOW)
  await expect(page.getByRole('button', { name: 'Güncelle' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'İmalat ekle' })).toHaveCount(0)

  const workerPage = await pageOf(browser, testInfo, worker.api)
  await workerPage.goto(`/santiyeler/${site.id}`)
  await expect(workerPage.getByText('Saha', { exact: true }).first()).toBeVisible(SLOW)
  await expect(workerPage.getByText('İmalat', { exact: true })).toHaveCount(0)
  await workerPage.goto(`/santiyeler/${site.id}/imalat`)
  await expect(workerPage).toHaveURL(/\/santiyeler$/, SLOW)
})

test("şef Saha'ya yansıtınca giriş çalışanın Saha akışında görünür", async ({
  page,
  browser,
  isMobile,
  baseURL,
}, testInfo) => {
  test.setTimeout(90_000)
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'Saha Şantiyesi')
  const token = await joinToken(owner)
  const lead = await memberAs(owner, baseURL!, token, {
    fullName: unique('Şef'),
    role: 'SITE_LEAD',
  })
  const worker = await memberAs(owner, baseURL!, token, {
    fullName: unique('Usta'),
    role: 'WORKER',
  })
  await itemViaApi(lead.api, site.id, 50)
  await page.context().addCookies((await lead.api.storageState()).cookies)
  const production = productionParts(page, isMobile)

  await page.goto(`/santiyeler/${site.id}/imalat`)
  await expect(production.card('Demir İşleri')).toBeVisible(SLOW)
  await production.enter('Demir İşleri', '2', true)
  await expect(production.card('Demir İşleri')).toContainText('2 / 50 ton', SLOW)

  const workerPage = await pageOf(browser, testInfo, worker.api)
  await workerPage.goto(`/santiyeler/${site.id}/saha`)
  await expect(
    // Masaüstünde soldaki şantiye listesi de önizlemesini yazar ("Şef: 📐 İmalat…"): Saha satırı tam yazısıyla.
    workerPage.getByText('📐 İmalat · Demir İşleri: +2 ton · 2 / 50 ton (%4)', { exact: true }),
  ).toBeVisible(SLOW)
})
