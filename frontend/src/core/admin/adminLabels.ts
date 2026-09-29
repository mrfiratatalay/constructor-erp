import type { Tone } from '@/core/billing/billingLabels'

/** Platform işlem geçmişindeki işlemlerin Türkçe adları. */
export const AUDIT_ACTIONS: Record<string, string> = {
  TENANT_CREATED: 'Firma açıldı',
  TENANT_UPDATED: 'Firma bilgisi',
  TENANT_STATUS_CHANGED: 'Firma durumu',
  SUBSCRIPTION_EXTENDED: 'Abonelik dönemi',
  SUBSCRIPTION_PLAN_CHANGED: 'Paket değişti',
  SUBSCRIPTION_STATUS_CHANGED: 'Abonelik durumu',
  PAYMENT_RECORDED: 'Ödeme',
  INVITE_CREATED: 'Kurulum linki',
  INVITE_REVOKED: 'Link iptali',
  SETUP_COMPLETED: 'Kurulum tamamlandı',
  PLAN_UPDATED: 'Paket güncellendi',
  SALES_REQUEST_UPDATED: 'Başvuru',
}

/** İşlemin zaman çizelgesindeki rengi: para yeşil, kilit sarı, kurulum mavi. */
export function auditTone(action: string): Tone {
  if (action === 'PAYMENT_RECORDED' || action === 'SETUP_COMPLETED') return 'success'
  if (action.endsWith('STATUS_CHANGED') || action === 'INVITE_REVOKED') return 'warning'
  if (action === 'TENANT_CREATED' || action === 'SUBSCRIPTION_EXTENDED') return 'primary'
  return 'info'
}

export const SALES_REQUEST_STATUSES: Record<string, { label: string; tone: Tone }> = {
  NEW: { label: 'Yeni', tone: 'danger' },
  CONTACTED: { label: 'Arandı', tone: 'warning' },
  WON: { label: 'Kazanıldı', tone: 'success' },
  LOST: { label: 'Kaybedildi', tone: 'info' },
}

export const INVITE_STATUSES: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: 'Bekliyor', tone: 'primary' },
  USED: { label: 'Kullanıldı', tone: 'success' },
  REVOKED: { label: 'İptal', tone: 'info' },
  EXPIRED: { label: 'Süresi doldu', tone: 'warning' },
}

export const MONTH_CHOICES = [1, 3, 6, 12] as const
