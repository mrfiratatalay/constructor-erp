import type { SiteViewStatus } from '@/core/api/generated/model'
import type { StatusTone } from '@/core/format/statusTone'

export const SITE_STATUS: Record<SiteViewStatus, { label: string; tone: StatusTone }> = {
  ACTIVE: { label: 'Devam ediyor', tone: 'success' },
  COMPLETED: { label: 'Tamamlandı', tone: 'neutral' },
}

export const SITE_STATUS_OPTIONS = (Object.keys(SITE_STATUS) as SiteViewStatus[]).map((status) => ({
  value: status,
  label: SITE_STATUS[status].label,
}))
