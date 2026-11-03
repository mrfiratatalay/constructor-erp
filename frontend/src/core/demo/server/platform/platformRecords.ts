/** Paket. Fiyatı boş olan teklifle satılır; kullanıcı ve şantiye sınırı boşsa sınırsızdır. */
export interface PlanRecord {
  id: string
  code: string
  name: string
  tagline: string | null
  monthlyPrice: number | null
  currency: string
  maxUsers: number | null
  maxSites: number | null
  highlighted: boolean
  visible: boolean
  status: 'ACTIVE' | 'ARCHIVED'
  features: string[]
}

/** Abonelik dönemi. "Süresi doldu" saklanmaz, bitiş tarihinden hesaplanır (gerçek backend'deki gibi). */
export interface SubscriptionRecord {
  id: string
  companyId: string
  planId: string
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
  startsOn: string
  endsOn: string
  priceSnapshot: number | null
  currency: string
  note: string | null
  createdAt: string
}

export interface PaymentRecord {
  id: string
  companyId: string
  subscriptionId: string | null
  amount: number
  currency: string
  method: string
  paidOn: string
  description: string | null
  createdById: string | null
  createdAt: string
}

export interface OnboardingInviteRecord {
  id: string
  companyId: string
  token: string
  status: 'PENDING' | 'USED' | 'REVOKED'
  createdAt: string
  expiresAt: string
  usedAt: string | null
  usedById: string | null
  createdById: string | null
}

export interface SalesRequestRecord {
  id: string
  companyName: string
  contactName: string
  phone: string
  email: string | null
  city: string | null
  siteCount: number | null
  planId: string | null
  message: string | null
  status: 'NEW' | 'CONTACTED' | 'WON' | 'LOST'
  notes: string | null
  companyId: string | null
  createdAt: string
}

export interface AuditRecord {
  id: string
  action: string
  companyId: string | null
  summary: string
  actorId: string | null
  createdAt: string
}

export interface PlatformState {
  plans: PlanRecord[]
  subscriptions: SubscriptionRecord[]
  payments: PaymentRecord[]
  onboardingInvites: OnboardingInviteRecord[]
  salesRequests: SalesRequestRecord[]
  audit: AuditRecord[]
}
