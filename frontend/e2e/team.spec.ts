import { expect, test } from '@playwright/test'
import { addMember, loginAsOwner, memberRow } from './support/app'

test('patron ekibe kişi ekler, kişi linkle kendi telefonundan girer', async ({ page, browser }) => {
  const fullName = `Deneme Usta ${Date.now()}`
  await loginAsOwner(page)
  const loginLink = await addMember(page, fullName)

  // Başka bir cihaz: çerezsiz yeni bir tarayıcı bağlamı.
  const memberPhone = await browser.newContext()
  const memberPage = await memberPhone.newPage()
  await memberPage.goto(loginLink)
  await expect(memberPage).toHaveURL(/\/santiyeler$/)
  await memberPage.goto('/ben')
  // Masaüstünde isim hem kullanıcı menüsünde hem profil kartında görünür.
  await expect(memberPage.getByText(fullName).first()).toBeVisible()
  await memberPhone.close()

  await page.reload()
  await expect(memberRow(page, fullName)).toContainText('Son görülme')
})
