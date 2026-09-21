import { expect, test } from '@playwright/test'

const EXPECTED = {
  mobile: { shell: 'Mobil (Vant)', switchButton: 'Masaüstü görünüme geç', afterSwitch: 'Masaüstü (Element Plus)' },
  desktop: { shell: 'Masaüstü (Element Plus)', switchButton: 'Mobil görünüme geç', afterSwitch: 'Mobil (Vant)' },
} as const

type ProjectName = keyof typeof EXPECTED

test('cihaza uygun kabuk açılır', async ({ page }, testInfo) => {
  const expected = EXPECTED[testInfo.project.name as ProjectName]
  await page.goto('/')
  await expect(page.getByText(expected.shell)).toBeVisible()
})

test('kullanıcı diğer görünüme geçebilir ve tercihi hatırlanır', async ({ page }, testInfo) => {
  const expected = EXPECTED[testInfo.project.name as ProjectName]
  await page.goto('/')
  await page.getByRole('button', { name: expected.switchButton }).click()
  await expect(page.getByText(expected.afterSwitch)).toBeVisible()

  await page.reload()
  await expect(page.getByText(expected.afterSwitch)).toBeVisible()
})
