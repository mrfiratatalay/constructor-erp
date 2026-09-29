import { computed } from 'vue'
import {
  useListMaterialParties,
  useListMaterials,
  useListStockLocations,
} from '@/core/api/generated/materials/materials'
import type { LocationView } from '@/core/api/generated/model'

/**
 * Sevkiyat formunun seçenekleri: nereye gidilebilir, hangi malzemeler var, dışarıda kimler var.
 * Kullanıcı "nereden" sorusunu görmez; depo sorumlusu için çıkış her zaman ana depodur.
 */
export function useShipmentOptions() {
  const { data: locations } = useListStockLocations()
  const { data: materials } = useListMaterials()
  const { data: parties } = useListMaterialParties()
  const all = computed<LocationView[]>(() => locations.value ?? [])
  return {
    depots: computed(() => all.value.filter((place) => place.kind === 'DEPOT')),
    sites: computed(() => all.value.filter((place) => place.kind === 'SITE' && place.active)),
    /** Ana depo: firmanın ilk (çoğunlukla tek) deposu; sevkiyatın varsayılan çıkış yeri. */
    mainDepot: computed(() => all.value.find((place) => place.kind === 'DEPOT') ?? null),
    materials: computed(() => (materials.value ?? []).filter((material) => material.active)),
    parties: computed(() => parties.value ?? []),
  }
}
