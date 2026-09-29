import { computed } from 'vue'
import {
  useListMaterialParties,
  useListMaterials,
  useListStockLocations,
} from '@/core/api/generated/materials/materials'
import type { LocationView, MaterialView } from '@/core/api/generated/model'

const byName = (left: string, right: string) => left.localeCompare(right, 'tr')

/**
 * Formların ve süzgeçlerin seçenekleri: malzemeler, lokasyonlar (önce depolar, sonra şantiyeler; tamamlanmış
 * şantiye sonda), firmalar ve kullanılan kategoriler. Adlar kimlikten okunur: süzgeç etiketleri ve tablo için.
 */
export function useMaterialOptions() {
  const materials = useListMaterials()
  const locations = useListStockLocations()
  const parties = useListMaterialParties()

  const allMaterials = computed<MaterialView[]>(() => materials.data.value ?? [])
  const allLocations = computed<LocationView[]>(() => locations.data.value ?? [])
  const categories = computed(() =>
    [...new Set(allMaterials.value.map((material) => material.category))].sort(byName),
  )

  return {
    materials: allMaterials,
    activeMaterials: computed(() => allMaterials.value.filter((material) => material.active)),
    locations: allLocations,
    siteLocations: computed(() =>
      allLocations.value.filter((location) => location.kind === 'SITE'),
    ),
    parties: computed(() => parties.data.value ?? []),
    categories,
    materialOf: (id: string | null | undefined) =>
      allMaterials.value.find((material) => material.id === id),
    locationOf: (id: string | null | undefined) =>
      allLocations.value.find((location) => location.id === id),
    partyName: (id: string | null) => parties.data.value?.find((party) => party.id === id)?.name,
    isPending: computed(() => materials.isPending.value || locations.isPending.value),
  }
}
