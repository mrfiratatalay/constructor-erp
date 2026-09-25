import { expect, test } from '@playwright/test'
import { loginAsOwner, shellOf } from './support/app'
import { attendanceParts, postCount, seedSite, takeToday, todayOf } from './support/attendance'

// Yoklama (TASARIM.md "Yoklama"): menüden doğrudan bugünün yoklaması (şantiye seçilmez); sohbetteki ＋'dan da alınır
// ama sohbete düşmez; geçmişi Yoklama ekranındaki "Geçmiş"tedir.

test('sohbetteki ＋ → Yoklama: herkes Geldi başlar, gelmeyen nedeniyle kaydedilir, sohbete mesaj düşmez', async ({
  page,
  isMobile,
}) => {
  await loginAsOwner(page)
  const site = await seedSite(page.request, 'Sohbetten yoklama', ['Ali Usta', 'Veli Kaya'])
  const ui = attendanceParts(page, isMobile)
  const postsBefore = await postCount(page.request, site.id)
  await page.goto(`/santiyeler/${site.id}`)
  await ui.plus.click()
  await ui.menu.getByText('Yoklama', { exact: true }).click()
  await expect(ui.sheet.getByText('Geldi', { exact: true })).toHaveCount(2)

  await ui.rowsOf(ui.sheet).filter({ hasText: 'Ali Usta' }).click()
  const mark = ui.mark('Ali Usta')
  await mark.getByText('Gelmedi', { exact: true }).click()
  await mark.getByText('Habersiz', { exact: true }).click()
  await mark.getByRole('button', { name: 'Kaydet' }).click()
  await expect(ui.sheet.getByText('1 geldi · 1 gelmedi · 0 izinli')).toBeVisible()
  await ui.sheet.getByRole('button', { name: 'Yoklamayı Kaydet' }).click()

  const saved = page.getByRole('dialog').filter({ hasText: 'Yoklama kaydedildi' })
  await saved.getByRole('button', { name: 'Yoklama kayıtlarını görüntüle' }).click()
  await expect(page).toHaveURL(new RegExp(`/yoklama/${site.id}$`))
  await expect(ui.days.first()).toContainText('1 geldi · 1 gelmedi · 0 izinli')
  expect(await postCount(page.request, site.id)).toBe(postsBefore)
})

test('aynı gün ikinci yoklama olmaz: kayıtlı yoklama dolu açılır, yeni kişi eklense de işaretler korunur', async ({
  page,
  isMobile,
}) => {
  await loginAsOwner(page)
  const site = await seedSite(page.request, 'Tek yoklama', ['Ali Usta', 'Veli Kaya'])
  await takeToday(page.request, site, { fullName: 'Veli Kaya', reason: 'SICK', note: 'Sabah aradı' })
  const ui = attendanceParts(page, isMobile)
  await page.goto(`/santiyeler/${site.id}`)
  await ui.plus.click()
  await ui.menu.getByText('Yoklama', { exact: true }).click()

  await expect(ui.sheet).toContainText('yoklaması zaten alınmış')
  await expect(ui.sheet.getByText('Gelmedi · Hasta')).toBeVisible()

  await ui.sheet.getByRole('button', { name: /Personel ekle/ }).click()
  await ui.workerForm.getByPlaceholder('Ali Usta').fill('Hasan Demir')
  await ui.workerForm.getByRole('button', { name: 'Ekle', exact: true }).click()
  await expect(ui.rowsOf(ui.sheet).filter({ hasText: 'Hasan Demir' })).toContainText('Geldi')
  await expect(ui.sheet.getByText('Gelmedi · Hasta')).toBeVisible()
  await expect(ui.sheet.getByText('2 geldi · 1 gelmedi · 0 izinli')).toBeVisible()
})

test('Yoklama menüsü doğrudan bugünü açar: şantiye seçilmez, gelmeyene neden seçilip kaydedilir', async ({
  page,
  isMobile,
}) => {
  await loginAsOwner(page)
  const who = `Deniz ${Date.now() % 100000}`
  const site = await seedSite(page.request, 'Bugünün yoklaması', [who, `Ece ${Date.now() % 100000}`])
  const ui = attendanceParts(page, isMobile)

  await shellOf(page, isMobile).getByText('Yoklama', { exact: true }).click()
  await expect(page).toHaveURL(/\/yoklama$/)
  await expect(page.getByText(/^Gelenler \d+$/)).toBeVisible()
  await ui.rollRow(who).click()
  await ui.quickMenu.getByText('Hastalık', { exact: true }).click()
  await expect(ui.rollRow(who)).toContainText('Hasta')
  await expect(page.getByText(/^Gelmeyenler \d+$/)).toBeVisible()
  await page.getByRole('button', { name: 'Yoklamayı Kaydet' }).click()

  await expect.poll(async () => (await todayOf(page.request, site.id)).counts).toEqual({ present: 1, absent: 1, excused: 0 })
})

test('Yoklama geçmişi: Geçmiş → şantiye → gün → kişinin ayı', async ({ page, isMobile }) => {
  await loginAsOwner(page)
  const site = await seedSite(page.request, 'Yoklama geçmişi', ['Ali Usta', 'Veli Kaya'])
  await takeToday(page.request, site, { fullName: 'Veli Kaya', reason: 'SICK', note: 'Sabah aradı' })
  const ui = attendanceParts(page, isMobile)

  await shellOf(page, isMobile).getByText('Yoklama', { exact: true }).click()
  await expect(page).toHaveURL(/\/yoklama$/)
  await page.getByRole('button', { name: 'Geçmiş', exact: true }).click()
  await expect(page).toHaveURL(/\/yoklama\/gecmis$/)
  const siteRow = ui.sites.filter({ hasText: site.name })
  await expect(siteRow).toContainText('Bugün 1 geldi · 1 gelmedi · 0 izinli')
  await siteRow.click()
  await expect(page.getByText(/1 yoklama günü · %50 geldi/)).toBeVisible()

  await ui.days.first().click()
  await expect(ui.day).toContainText('Gelmedi · Hasta')
  await ui.rowsOf(ui.day).filter({ hasText: 'Veli Kaya' }).click()
  await expect(page).toHaveURL(/\/personel\//)
  await expect(page.getByText('1 gün gelmedi')).toBeVisible()
  await expect(page.getByText('Sabah aradı')).toBeVisible()
})
