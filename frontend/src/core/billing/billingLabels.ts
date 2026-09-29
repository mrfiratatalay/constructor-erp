/**
 * Abonelik, ödeme ve firma durumlarının Türkçe adları ve renk tonları; firma sayfası ve platform yönetimi aynı
 * sözlüğü kullanır. Ton, Element Plus / Vant etiket türüdür (success, warning, danger, info, primary).
 */
export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'primary'

export const SUBSCRIPTION_STATES: Record<string, { label: string; tone: Tone }> = {
  ACTIVE: { label: 'Aktif', tone: 'success' },
  SCHEDULED: { label: 'Başlayacak', tone: 'primary' },
  EXPIRED: { label: 'Süresi doldu', tone: 'danger' },
  SUSPENDED: { label: 'Askıda', tone: 'warning' },
  CANCELLED: { label: 'İptal', tone: 'info' },
}

export const COMPANY_STATUSES: Record<string, { label: string; tone: Tone }> = {
  ACTIVE: { label: 'Aktif', tone: 'success' },
  SUSPENDED: { label: 'Askıda', tone: 'warning' },
  ARCHIVED: { label: 'Arşivde', tone: 'info' },
}

export const PAYMENT_METHODS: Record<string, string> = {
  CASH: 'Nakit',
  BANK_TRANSFER: 'Havale / EFT',
  OTHER: 'Diğer',
}

export function stateOf(state: string | null | undefined) {
  return SUBSCRIPTION_STATES[state ?? ''] ?? { label: 'Abonelik yok', tone: 'info' as Tone }
}

/** "3 / 15" ya da "3 / sınırsız". */
export function usageLabel(used: number, limit: number | null | undefined): string {
  return `${used} / ${limit == null ? 'sınırsız' : limit}`
}

/** Sınıra ne kadar yaklaşıldı (0-100); sınırsızda 0. */
export function usagePercent(used: number, limit: number | null | undefined): number {
  return limit ? Math.min(100, Math.round((used / limit) * 100)) : 0
}
