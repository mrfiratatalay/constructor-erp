import { expect, test } from '@playwright/test'
import { addMember, createSite, loginAsOwner } from './support/app'

test('şantiye sorumlusu yalnızca kendisine atanan şantiyeyi görür', async ({ page, browser }) => {
  const stamp = Date.now()
  const assigned = `Çamlıca ${stamp}`
  const other = `Kartal ${stamp}`
  await loginAsOwner(page)
  await createSite(page, assigned)
  await createSite(page, other)
  const loginLink = await addMember(page, `Sorumlu ${stamp}`)

  const leadPhone = await browser.newContext()
  const leadPage = await leadPhone.newPage()
  await leadPage.goto(loginLink)

  await expect(leadPage).toHaveURL(/\/santiyeler$/)
  await expect(leadPage.getByText(assigned)).toBeVisible()
  await expect(leadPage.getByText(other)).toHaveCount(0)
  await leadPhone.close()
})
