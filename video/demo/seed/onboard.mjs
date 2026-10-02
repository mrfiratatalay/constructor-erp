// Satıştan kuruluma, API ile (yalnızca geliştirme denemeleri için): reklamda aynı akış arayüzden çekilir
// (capture/onboarding.mjs). Başvuru → platform firmayı açar, ödemeyi kaydeder → patron kurulum linkiyle firmayı kurar.
import { Session } from './api.mjs'
import { demoToday } from './clock.mjs'
import { COMPANY, LEAD, OWNER, SITES } from './content.mjs'

export const ADMIN = { email: 'destek@iskele-demo.test', password: 'demo-destek-2026' }

export async function professionalPlan(session) {
  const plans = await session.get('/api/public/plans')
  return plans.find((plan) => plan.code === 'professional')
}

export async function submitLead(guest = new Session('guest')) {
  const plan = await professionalPlan(guest)
  return guest.post('/api/public/sales-requests', {
    companyName: COMPANY.name, contactName: LEAD.contactName, phone: LEAD.phone, email: OWNER.email,
    city: COMPANY.city, siteCount: LEAD.siteCount, planId: plan.id, message: LEAD.message,
  })
}

export async function openTenant() {
  const admin = await new Session('admin').login(ADMIN.email, ADMIN.password)
  const plan = await professionalPlan(admin)
  const requests = await admin.get('/api/platform/sales-requests?status=open')
  const lead = (requests.items ?? requests).find((request) => request.companyName === COMPANY.name)
  const today = demoToday()
  return admin.post('/api/platform/tenants', {
    name: COMPANY.name, phone: LEAD.phone, email: OWNER.email, city: COMPANY.city, planId: plan.id, months: 12,
    startsOn: today, salesRequestId: lead?.id ?? null,
    payment: { amount: plan.monthlyPrice * 12, method: 'BANK_TRANSFER', paidOn: today, description: 'Havale/EFT' },
  })
}

export async function completeSetup(inviteUrl) {
  const token = inviteUrl.split('/kurulum/')[1]
  const owner = new Session('owner')
  await owner.post(`/api/setup/${token}`, {
    company: { name: COMPANY.name, phone: COMPANY.phone, email: COMPANY.email, city: COMPANY.city },
    owner: OWNER,
    firstSite: SITES.yomra,
  })
  return owner
}

export async function onboardByApi() {
  await submitLead()
  const created = await openTenant()
  await completeSetup(created.invite.url)
  return created.companyId
}
