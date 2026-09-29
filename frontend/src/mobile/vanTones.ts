import type { StatusTone } from '@/core/materials/materialLabels'

/** Ortak durum tonunun Vant etiket tipi: Vant'ta "info" yoktur, gri etiket "default"tur. */
export const VAN_TAG: Record<StatusTone, 'success' | 'warning' | 'danger' | 'primary' | 'default'> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  primary: 'primary',
  info: 'default',
}
