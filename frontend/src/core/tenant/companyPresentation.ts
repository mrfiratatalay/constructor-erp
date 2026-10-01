import type { PlanFeatureView } from '@/core/api/generated/model'

const MODULE_COPY: Record<string, { title: string; description: string }> = {
  tasks: { title: 'Görevler', description: 'Sorumluları, teslim tarihlerini ve şantiyedeki işlerin durumunu takip edin.' },
  attendance: { title: 'Yoklama ve puantaj', description: 'Günlük yoklamayı kaydedin, aylık puantajı ve Excel dökümünü hazırlayın.' },
  materials: { title: 'Malzeme yönetimi', description: 'Depo ve şantiyeler arasındaki malzeme hareketlerini, sevkiyatları ve iadeleri izleyin.' },
  production: { title: 'İlerleme takibi', description: 'İş kalemlerini, günlük imalatı ve taşeronların ilerlemesini takip edin.' },
}

/** Bilinen modüller aynı dille anlatılır; yeni paket özellikleri sunucudaki açıklamalarıyla görünür. */
export function featureCards(features: readonly PlanFeatureView[]) {
  return features.map((feature) => ({
    key: feature.key,
    title: MODULE_COPY[feature.key]?.title ?? feature.name,
    description: MODULE_COPY[feature.key]?.description ?? feature.description,
    included: feature.included,
  }))
}
