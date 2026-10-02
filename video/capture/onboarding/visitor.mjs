// Ziyaretçi: fiyatlar → Professional'ı seç → başvuru formu (yazarak) → gönderildi.
import { settle, shoot } from '../lib/shoot.mjs'
import { secrets } from '../lib/stack.mjs'

const SCENE = 'onboarding'
export const LEAD = {
  companyName: 'Atalay Yapı',
  contactName: 'Selim Atalay',
  phone: '0500 123 45 67',
  email: 'selim@atalayyapi.local',
  city: 'Trabzon',
  siteCount: '3',
  message: 'Yomra, Kaşüstü ve Sahil şantiyelerimiz var.',
}

const FORM = {
  card: '.apply-card',
  company: 'input[name=companyName]',
  contact: 'input[name=contactName]',
  phone: 'input[name=phone]',
  email: 'input[name=email]',
  city: 'input[name=city]',
  sites: '.apply-card__number',
  plan: '.apply-card__plan',
  message: 'textarea[name=message]',
  submit: '.apply-card__submit',
}

/** Fiyatlar sayfası: önerilen paket ve butonu. */
const pricing = async (page) => {
  await page.goto(`${secrets().web}/fiyatlar`)
  await settle(page, 500)
  await shoot(page, SCENE, 'pricing', {
    professional: '.public-plan--highlighted',
    choose: '.public-plan--highlighted .public-plan__cta',
    pricingLink: '.marketing-top__links a:last-child',
  })
  await page.locator('.public-plan--highlighted .public-plan__cta').click()
  await page.waitForURL(/\/basvuru/)
  await settle(page, 400)
}

/** Firma adı harf harf: her harf bir kare (filmde gerçek yazma ritmiyle oynatılır). */
const typeCompany = async (page) => {
  const input = page.locator(FORM.company)
  await input.click()
  for (let length = 0; length <= LEAD.companyName.length; length++) {
    await input.fill(LEAD.companyName.slice(0, length))
    await shoot(page, SCENE, `apply-type-${String(length).padStart(2, '0')}`, length === 0 ? FORM : {})
  }
}

/** Kalan alanlar teker teker dolar; her alan bir kare. */
const fillRest = async (page) => {
  const steps = [
    ['contact', LEAD.contactName], ['phone', LEAD.phone], ['email', LEAD.email], ['city', LEAD.city],
  ]
  for (const [index, [field, value]] of steps.entries()) {
    await page.locator(FORM[field]).fill(value)
    await shoot(page, SCENE, `apply-fill-${index + 1}`)
  }
  await page.locator(`${FORM.sites} input`).fill(LEAD.siteCount)
  await page.locator(FORM.message).fill(LEAD.message)
  await page.locator(FORM.message).blur()
  await settle(page, 200)
  await shoot(page, SCENE, 'apply-filled', FORM)
}

export const visitorFlow = async (page) => {
  await pricing(page)
  await shoot(page, SCENE, 'apply-empty', FORM)
  await typeCompany(page)
  await fillRest(page)
  await page.locator(FORM.submit).click()
  await page.getByText('Talebiniz bize ulaştı').waitFor()
  await settle(page, 400)
  await shoot(page, SCENE, 'apply-sent', { card: FORM.card })
}
