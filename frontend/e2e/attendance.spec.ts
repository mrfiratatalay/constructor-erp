import { expect, test } from '@playwright/test'
import { loginAsOwner, shellOf } from './support/app'
import {
  createSite,
  joinFromLink,
  joinMember,
  joinToken,
  ownerApi,
  rollCallParts,
  TODAY,
  todayRecordOf,
  unique,
} from './support/attendance'

// Yoklama (TASARIM.md "Yoklama"): şef sohbete günün yoklama mesajını atar, çalışan kendi telefonundan katılır,
// patron katılmayanı işaretler, kişinin takvimini görür ve ayı Excel olarak indirir.

test('şef ＋ → Yoklama ile sohbete yoklama mesajı atar; ikinci kez basınca yenisi atılmaz', async ({
  page,
  isMobile,
  baseURL,
}) => {
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'Yoklama mesajı')
  await joinFromLink(page, await joinToken(owner), unique('Sabah Şefi'))
  const ui = rollCallParts(page, isMobile)
  await page.goto(`/santiyeler/${site.id}`)

  for (let attempt = 0; attempt < 2; attempt++) {
    await ui.plus.click()
    await ui.menu.getByText('Yoklama', { exact: true }).click()
    await expect(ui.cards).toHaveCount(1)
  }
  await expect(ui.cards).toContainText('Yoklama · ')
  await expect(ui.cards.getByRole('button', { name: 'Yoklamaya Katıl' })).toBeVisible()
})

test('çalışan yoklama mesajındaki düğmeye kendi telefonundan basar ve Geldi olur', async ({
  page,
  isMobile,
  baseURL,
}) => {
  const owner = await ownerApi(baseURL!)
  const site = await createSite(owner, 'Katılım')
  const token = await joinToken(owner)
  const lead = await joinMember(baseURL!, token, unique('Şef'))
  expect((await lead.api.post(`/api/sites/${site.id}/roll-calls`)).ok()).toBe(true)
  await joinFromLink(page, token, unique('Kalıpçı Ali'))
  const workerId = (await (await page.request.get('/api/auth/me')).json()).id
  const ui = rollCallParts(page, isMobile)

  await page.goto(`/santiyeler/${site.id}`)
  await ui.cards.getByRole('button', { name: 'Yoklamaya Katıl' }).click()

  await expect(ui.cards).toContainText('✓ Katıldın')
  await expect(ui.cards).toContainText('1 kişi katıldı')
  expect(await todayRecordOf(owner, workerId)).toMatchObject({
    status: 'PRESENT',
    siteName: site.name,
  })
})

test('patron katılmayanı işaretler, kişinin takviminde görür ve ayı Excel olarak indirir', async ({
  page,
  isMobile,
  baseURL,
}) => {
  const owner = await ownerApi(baseURL!)
  const name = unique('Veli Kaya')
  const member = await joinMember(baseURL!, await joinToken(owner), name)
  const ui = rollCallParts(page, isMobile)
  await loginAsOwner(page)
  await page.goto('/yoklama')

  await ui.row('roll-missing', name).getByRole('button', { name: 'İşaretle' }).click()
  await ui.choice('Hastalık').click()
  await expect(ui.row('roll-absent', name)).toContainText('Gelmedi · Hastalık')
  expect(await todayRecordOf(owner, member.id)).toMatchObject({ status: 'ABSENT', reason: 'SICK' })

  await ui.row('roll-absent', name).getByText(name).click()
  await expect(page).toHaveURL(new RegExp(`/yoklama/kisi/${member.id}`))
  await expect(ui.todayCell).toHaveClass(/roll-day--absent/)

  const download = await ui.downloadExcel()
  expect(download.suggestedFilename()).toBe(`yoklama-${TODAY.slice(0, 7)}.xlsx`)
})

test('şef Yoklama menüsünü görmez ve adresine giremez: kimin geldiği patronun işi', async ({
  page,
  isMobile,
  baseURL,
}) => {
  const owner = await ownerApi(baseURL!)
  await joinFromLink(page, await joinToken(owner), unique('Meraklı Şef'))

  await expect(shellOf(page, isMobile).getByText('Şantiyeler')).toBeVisible()
  await expect(shellOf(page, isMobile).getByText('Yoklama')).toHaveCount(0)
  await page.goto('/yoklama')
  await expect(page).toHaveURL(/\/santiyeler$/)
})
