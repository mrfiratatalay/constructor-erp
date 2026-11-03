import type {
  CompleteSetupRequest,
  LogoUploaded,
  PublicPlanView,
  SalesRequestSubmission,
  SessionContextView,
  SetupInviteView,
  SubmittedSalesRequest,
} from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { get, post } from '@/core/demo/server/demoRouter'
import { companyById } from '@/core/demo/server/demoSession'
import { uploadedMedia } from '@/core/demo/server/posts/media'
import { planFeatures } from './features'
import type { OnboardingInviteRecord, PlanRecord } from './platformRecords'
import { completeSetup } from './setupCompletion'
import { featuresOf, planOf } from './subscriptions'

function publicPlanOf(plan: PlanRecord): PublicPlanView {
  const { id, code, name, tagline, monthlyPrice, currency, maxUsers, maxSites, highlighted } = plan
  return { id, code, name, tagline, monthlyPrice, currency, maxUsers, maxSites, highlighted, features: planFeatures(plan) }
}

function publicPlans(): PublicPlanView[] {
  return db()
    .platform.plans.filter((plan) => plan.visible && plan.status === 'ACTIVE')
    .map(publicPlanOf)
}

function checkSubmission(form: SalesRequestSubmission): void {
  if (!form.companyName.trim() || !form.contactName.trim()) throw badRequest('Firma adını ve adınızı yazın.')
  if (form.planId && !db().platform.plans.some((plan) => plan.id === form.planId)) throw notFound('Paket')
}

/** Ödeme yok: "Paketi seç" başvuruya gelir, satış ekibi arar. Gizli alan (website) dolduran bot sessizce geçiştirilir. */
function submitSalesRequest({ body }: DemoRequest): SubmittedSalesRequest {
  const form = body as SalesRequestSubmission
  if (form.website) return { id: newId() }
  checkSubmission(form)
  const { companyName, contactName, phone, email = null, city = null, siteCount = null, planId = null, message = null } = form
  const request = { companyName, contactName, phone, email, city, siteCount, planId, message }
  const record = { id: newId(), ...request, status: 'NEW' as const, notes: null, companyId: null, createdAt: nowIso() }
  db().platform.salesRequests.push(record)
  return { id: record.id }
}

export function pendingInvite(token: string): OnboardingInviteRecord {
  const invite = db().platform.onboardingInvites.find((item) => item.token === token)
  if (!invite || invite.status !== 'PENDING' || invite.expiresAt <= nowIso()) throw notFound('Kurulum linki')
  return invite
}

function setupInvite({ params }: DemoRequest): SetupInviteView {
  const company = companyById(pendingInvite(params.token!).companyId)
  if (!company) throw notFound('Firma')
  const { name, phone, email, city, logoUrl } = company
  const plan = planOf(company.id)
  const endsOn = db().platform.subscriptions.find((item) => item.companyId === company.id)?.endsOn ?? null
  return { companyName: name, phone, email, city, logoUrl, planName: plan?.name ?? null, endsOn, features: featuresOf(company) }
}

async function setupLogo({ params, form }: DemoRequest): Promise<LogoUploaded> {
  const company = companyById(pendingInvite(params.token!).companyId)
  const file = form.files.file?.[0]
  if (!company || !file || !file.type.startsWith('image/')) throw badRequest('Logo PNG, JPEG ya da WEBP olmalı.')
  const [logo] = await uploadedMedia([file], nowIso())
  company.logoUrl = logo?.url ?? null
  return { logoUrl: company.logoUrl ?? '' }
}

function setup({ params, body }: DemoRequest): SessionContextView {
  return completeSetup(pendingInvite(params.token!), body as CompleteSetupRequest)
}

export const publicRoutes = [
  get('/api/public/plans', publicPlans),
  post('/api/public/sales-requests', submitSalesRequest),
  get('/api/setup/:token', setupInvite),
  post('/api/setup/:token/logo', setupLogo),
  post('/api/setup/:token', setup),
]
