import type { MemberViewRole } from '@/core/api/generated/model'

export type CompanyStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

/** Firma (tenant). Platform listesinde görünen örnek firmaların içi doldurulmaz; sayıları `figures`'tan gelir. */
export interface CompanyRecord {
  id: string
  name: string
  slug: string
  phone: string | null
  email: string | null
  city: string | null
  logoUrl: string | null
  status: CompanyStatus
  lockReason: string | null
  joinToken: string
  setupCompleted: boolean
  createdAt: string
  figures?: { users: number; sites: number; lastActivityAt: string | null }
}

/**
 * Bir kişinin bir firmadaki hali. Gerçek backend kimlik ile üyeliği ayırır; demoda herkes tek firmada olduğu için
 * ikisi tek kayıttır ve kişi kimliği üyelik kimliğiyle aynıdır. Platform yöneticisinin firması yoktur.
 */
export interface PersonRecord {
  id: string
  companyId: string | null
  fullName: string
  phone: string | null
  email: string | null
  role: MemberViewRole | null
  platformAdmin: boolean
  active: boolean
  createdAt: string
  lastSeenAt: string | null
  /** Patronun gönderdiği tek kullanımlık giriş linkinin token'ı; kullanılınca silinir. */
  loginToken: string | null
  /**
   * Yalnızca demoda kurulum sihirbazıyla açılan patronun yazdığı şifre: yalnızca bu tarayıcıda durur. Örnek
   * hesaplar ortak demo şifresiyle girer.
   */
  password: string | null
}

/** Oturum: kim girdi, hangi firmada çalışıyor. */
export interface SessionRecord {
  personId: string
}
