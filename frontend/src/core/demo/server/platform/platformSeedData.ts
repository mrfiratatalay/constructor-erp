import type { PlanRecord, SalesRequestRecord } from './platformRecords'

type PlanRow = Omit<PlanRecord, 'id'>

/** Paketler (backend'deki V28): Starter yalnızca görev ve yoklamayı açar, diğerleri bütün modülleri. */
export const PLANS: PlanRow[] = [
  {
    code: 'starter',
    name: 'Starter',
    tagline: 'Küçük ekipler için: sahadan haber, görev ve yoklama.',
    monthlyPrice: 2490,
    currency: 'TRY',
    maxUsers: 15,
    maxSites: 3,
    highlighted: false,
    visible: true,
    status: 'ACTIVE',
    features: ['tasks', 'attendance'],
  },
  {
    code: 'professional',
    name: 'Professional',
    tagline: 'Mevcut bütün ERP modülleri dahil.',
    monthlyPrice: 4990,
    currency: 'TRY',
    maxUsers: null,
    maxSites: null,
    highlighted: true,
    visible: true,
    status: 'ACTIVE',
    features: ['tasks', 'attendance', 'materials', 'production'],
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    tagline: 'Çok şantiyeli firmalar için özel kurulum, eğitim ve destek.',
    monthlyPrice: null,
    currency: 'TRY',
    maxUsers: null,
    maxSites: null,
    highlighted: false,
    visible: true,
    status: 'ACTIVE',
    features: ['tasks', 'attendance', 'materials', 'production'],
  },
]

/** Platform listesindeki diğer firmalar: içleri boş, yalnızca platform ekranlarını dolduruyorlar. */
export interface OtherTenant {
  name: string
  city: string
  plan: 'starter' | 'professional' | 'enterprise'
  /** Abonelik dönemi, bugüne göre gün: [başlangıç, bitiş]. null: henüz abonelik yok. */
  period: [number, number]
  price: number | null
  status: 'ACTIVE' | 'SUSPENDED'
  lockReason: string | null
  people: string[]
  sites: number
  createdDaysAgo: number
  setupCompleted: boolean
}

export const OTHER_TENANTS: OtherTenant[] = [
  { name: 'Karadeniz Yapı Taahhüt', city: 'Rize', plan: 'professional', period: [-356, 9], price: 4990, status: 'ACTIVE', lockReason: null, people: ['Hüseyin Kalkan', 'Selma Yurt', 'Oğuz Tekin'], sites: 4, createdDaysAgo: 360, setupCompleted: true },
  { name: 'Doğu Karadeniz İnşaat', city: 'Giresun', plan: 'starter', period: [-40, 140], price: 2490, status: 'ACTIVE', lockReason: null, people: ['Ramazan Ekinci', 'Gül Aksu'], sites: 2, createdDaysAgo: 45, setupCompleted: true },
  { name: 'Sürmene Konut', city: 'Trabzon', plan: 'starter', period: [-95, -5], price: 2490, status: 'ACTIVE', lockReason: null, people: ['Nuri Baysal'], sites: 1, createdDaysAgo: 100, setupCompleted: true },
  { name: 'Of Yapı', city: 'Trabzon', plan: 'professional', period: [-60, 120], price: 4990, status: 'SUSPENDED', lockReason: 'İki aylık ödeme gecikti.', people: ['Cemal Uzun', 'Derya Kılınç'], sites: 3, createdDaysAgo: 70, setupCompleted: true },
  { name: 'Rize Çay Yapı', city: 'Rize', plan: 'enterprise', period: [-40, 325], price: 12500, status: 'ACTIVE', lockReason: null, people: ['Tamer Şen', 'Elif Dönmez', 'Kerem Ateş', 'Bora Çınar'], sites: 7, createdDaysAgo: 41, setupCompleted: true },
  { name: 'Akyazı Mimarlık', city: 'Trabzon', plan: 'professional', period: [0, 365], price: 4990, status: 'ACTIVE', lockReason: null, people: [], sites: 0, createdDaysAgo: 2, setupCompleted: false },
]

type SalesRow = Omit<SalesRequestRecord, 'id' | 'planId' | 'companyId' | 'createdAt'> & {
  plan: string
  daysAgo: number
}

export const SALES_REQUESTS: SalesRow[] = [
  { companyName: 'Çaykara Yapı', contactName: 'Hakan Demirci', phone: '0500 000 20 01', email: null, city: 'Trabzon', siteCount: 2, plan: 'starter', message: 'Puantajı defterden kurtarmak istiyoruz.', status: 'NEW', notes: null, daysAgo: 1 },
  { companyName: 'Maçka İnşaat', contactName: 'Serdar Yavuz', phone: '0500 000 20 02', email: 'serdar@macka.test', city: 'Trabzon', siteCount: 4, plan: 'professional', message: 'Malzeme takibi en büyük derdimiz.', status: 'NEW', notes: null, daysAgo: 3 },
  { companyName: 'Vakfıkebir Yapı', contactName: 'Ayten Koç', phone: '0500 000 20 03', email: null, city: 'Trabzon', siteCount: 3, plan: 'professional', message: null, status: 'CONTACTED', notes: 'Perşembe yerinde demo yapılacak.', daysAgo: 6 },
  { companyName: 'Akyazı Mimarlık', contactName: 'Levent Aydın', phone: '0500 000 20 04', email: 'levent@akyazi.test', city: 'Trabzon', siteCount: 2, plan: 'professional', message: 'Yeni projemizde baştan kullanmak istiyoruz.', status: 'WON', notes: 'Yıllık anlaşıldı, kurulum linki gönderildi.', daysAgo: 4 },
  { companyName: 'Beşikdüzü Konut', contactName: 'Fatih Erdem', phone: '0500 000 20 05', email: null, city: 'Trabzon', siteCount: 1, plan: 'starter', message: null, status: 'LOST', notes: 'Şimdilik Excel ile devam edecekler.', daysAgo: 15 },
]
