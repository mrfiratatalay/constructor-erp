import type { Tone } from '@/core/puantaj/puantajLabels'

/** Vant'ın etiket ve düğme "type" adları; gri Vant'ta "default"tur. */
export type VanType = 'success' | 'warning' | 'danger' | 'primary' | 'default'

/** İşaret tonunun Vant etiketi ve düğmesindeki karşılığı (yumuşak tonları mobile/styles/theme.css'te). */
export const vanType = (tone: Tone): VanType => (tone === 'info' ? 'default' : tone)

/** Rozet ve halkanın rengi: Vant'ın bunlarda "type"ı yok, rengi tema değişkeninden verilir, kendi kodumuzdan değil. */
const COLORS: Record<Tone, string> = {
  success: 'var(--van-success-color)',
  warning: 'var(--van-warning-color)',
  danger: 'var(--van-danger-color)',
  primary: 'var(--van-primary-color)',
  info: 'var(--van-gray-6)',
}

export const vanColor = (tone: Tone): string => COLORS[tone]
