import type {
  CompanyProfileView,
  CompanySubscriptionView,
  JoinLink,
  UpdateCompanyProfileRequest,
} from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import { badRequest } from '@/core/demo/server/demoError'
import { newToken } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { del, get, post, put } from '@/core/demo/server/demoRouter'
import { companyPeople, requireMember, requireRole } from '@/core/demo/server/demoSession'
import { planFeatures } from '@/core/demo/server/platform/features'
import { accessOf, currentSubscription, planById, stateOf } from '@/core/demo/server/platform/subscriptions'
import { uploadedMedia } from '@/core/demo/server/posts/media'
import type { CompanyRecord } from './peopleRecords'
import { teamRoutes } from './teamRoutes'

const LOGO_LIMIT = 2 * 1024 * 1024

function profileOf(company: CompanyRecord): CompanyProfileView {
  const { id, name, slug, phone, email, city, logoUrl } = company
  return { id, name, slug, phone, email, city, logoUrl }
}

function updateProfile({ body }: DemoRequest): CompanyProfileView {
  const { company } = requireRole('OWNER')
  const form = body as UpdateCompanyProfileRequest
  if (!form.name.trim()) throw badRequest('Firmanın adını yaz.')
  Object.assign(company, { name: form.name.trim(), phone: form.phone ?? null, email: form.email ?? null, city: form.city ?? null })
  return profileOf(company)
}

async function uploadLogo({ form }: DemoRequest): Promise<CompanyProfileView> {
  const { company } = requireRole('OWNER')
  const file = form.files.file?.[0]
  if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type)) throw badRequest('Logo PNG, JPEG ya da WEBP olmalı.')
  if (file.size > LOGO_LIMIT) throw badRequest('Logo en fazla 2 MB bir resim olmalı.')
  const [media] = await uploadedMedia([file], new Date().toISOString())
  company.logoUrl = media?.url ?? null
  return profileOf(company)
}

function removeLogo(): CompanyProfileView {
  const { company } = requireRole('OWNER')
  company.logoUrl = null
  return profileOf(company)
}

function periodsOf(companyId: string) {
  return db()
    .platform.subscriptions.filter((subscription) => subscription.companyId === companyId)
    .sort((a, b) => b.startsOn.localeCompare(a.startsOn))
    .map((subscription) => ({
      planName: planById(subscription.planId)?.name ?? 'Paket',
      state: stateOf(subscription),
      startsOn: subscription.startsOn,
      endsOn: subscription.endsOn,
      monthlyPrice: subscription.priceSnapshot,
    }))
}

function paymentsOf(companyId: string) {
  return db()
    .platform.payments.filter((payment) => payment.companyId === companyId)
    .sort((a, b) => b.paidOn.localeCompare(a.paidOn))
    .map(({ amount, currency, method, paidOn, description }) => ({ amount, currency, method, paidOn, description }))
}

/** Şu anki dönem: hangi paket, ne zaman bitiyor, kaç gün kaldı. */
function currentPeriodOf(company: CompanyRecord) {
  const current = currentSubscription(company.id)
  const access = accessOf(company)
  return {
    state: access.subscriptionState ?? null,
    startsOn: current?.startsOn ?? null,
    endsOn: current?.endsOn ?? null,
    daysLeft: access.daysLeft ?? null,
    monthlyPrice: current?.priceSnapshot ?? null,
  }
}

/** Firma ekranındaki abonelik: paket, kalan gün, kullanım sınırları, dönemler ve ödemeler. */
function subscription(): CompanySubscriptionView {
  const { company } = requireRole('OWNER')
  const current = currentSubscription(company.id)
  const plan = current ? planById(current.planId) : undefined
  const activeSites = db().sites.filter((site) => site.companyId === company.id && site.status === 'ACTIVE').length
  return {
    planName: plan?.name ?? null,
    ...currentPeriodOf(company),
    activeUsers: companyPeople(company.id).length,
    maxUsers: plan?.maxUsers ?? null,
    activeSites,
    maxSites: plan?.maxSites ?? null,
    features: planFeatures(plan),
    periods: periodsOf(company.id),
    payments: paymentsOf(company.id),
  }
}

const joinLinkOf = (company: CompanyRecord): JoinLink => ({ url: `${location.origin}/katil/${company.joinToken}` })

/** Bağlantı yenilenince eskisi çalışmaz: yanlış ele geçen bağlantıya karşı patronun tek düğmesi. */
function resetJoinLink(): JoinLink {
  const { company } = requireRole('OWNER')
  company.joinToken = newToken()
  return joinLinkOf(company)
}

export const companyRoutes = [
  get('/api/company/profile', () => profileOf(requireMember().company)),
  put('/api/company/profile', updateProfile),
  post('/api/company/logo', uploadLogo),
  del('/api/company/logo', removeLogo),
  get('/api/company/subscription', subscription),
  get('/api/company/join-link', () => joinLinkOf(requireMember().company)),
  post('/api/company/join-link/reset', resetJoinLink),
  ...teamRoutes,
]
