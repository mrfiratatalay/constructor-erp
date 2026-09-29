/**
 * Paketle açılıp kapanan modüllerin anahtarları; backend'deki features tablosu ve Features sınıfıyla aynıdır.
 * Yeni modül: anahtar buraya, adresine meta.feature, menü öğesine route (MIMARI-SAAS.md Bölüm 6).
 */
export type FeatureKey = 'tasks' | 'attendance' | 'materials' | 'production'

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  tasks: 'Görevler',
  attendance: 'Yoklama ve puantaj',
  materials: 'Malzeme ve sevkiyat',
  production: 'İlerleme takibi',
}

/** Sunucudan gelen anahtarın adı; bu sürümün tanımadığı yeni bir modül anahtarıyla görünür. */
export const featureLabel = (key: string) => FEATURE_LABELS[key as FeatureKey] ?? key
