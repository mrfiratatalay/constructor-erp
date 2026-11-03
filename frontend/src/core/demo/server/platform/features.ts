import type { FeatureInfo, PlanFeatureView } from '@/core/api/generated/model'
import type { PlanRecord } from './platformRecords'

/** Paketle açılıp kapanan modüller (backend'deki features tablosu, V28). */
export const FEATURES: FeatureInfo[] = [
  { key: 'tasks', name: 'Görevler', description: 'Şantiyede iş takibi: kim, neyi, ne zamana kadar yapacak.' },
  {
    key: 'attendance',
    name: 'Yoklama ve puantaj',
    description: 'Günlük yoklama, aylık puantaj cetveli ve Excel dökümü.',
  },
  {
    key: 'materials',
    name: 'Malzeme ve sevkiyat',
    description: 'Depo ve şantiyeler arası sevkiyat defteri, irsaliye belgeleri, stok.',
  },
  {
    key: 'production',
    name: 'İlerleme takibi',
    description: 'Taşeron iş kalemleri, günlük imalat girişleri ve ilerleme raporu.',
  },
]

export const planFeatures = (plan: PlanRecord | undefined): PlanFeatureView[] =>
  FEATURES.map((feature) => ({ ...feature, included: plan?.features.includes(feature.key) ?? false }))

export const ALL_FEATURE_KEYS = FEATURES.map((feature) => feature.key)
