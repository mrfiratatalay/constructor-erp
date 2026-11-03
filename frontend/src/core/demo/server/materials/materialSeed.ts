import { at } from '@/core/demo/server/demoClock'
import type { Seed } from '@/core/demo/server/seed/seedContext'
import { seedCatalog } from './seedCatalog'
import { seedShipments } from './seedShipments'

/**
 * Atalay Yapı'nın sevkiyat defteri: tek ana depo, kartlar, tedarikçiler ile öbür müteahhitler ve son üç haftanın
 * sevkiyatları. Şantiyeye dokunan sevkiyatlar, gerçek backend'deki gibi o şantiyenin Saha akışına da gönderi bırakır.
 */
export const seedMaterials: Seed = (draft, context) => {
  seedCatalog(draft.materials, context.company.id, at(-100, '10:00'))
  seedShipments(draft, context)
}
