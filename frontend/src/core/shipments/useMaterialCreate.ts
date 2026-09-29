import { useQueryClient } from '@tanstack/vue-query'
import {
  getListMaterialsQueryKey,
  useCreateMaterial,
} from '@/core/api/generated/materials/materials'

/**
 * Listede olmayan malzemeyi oracıkta açar. Sahada en sık olan şey budur: kamyona yüklenen malzemenin kartı
 * henüz yoktur ve depo sorumlusu bunun için ayrı bir ekrana gidemez — akış orada tıkanır, kayıt hiç girilmez.
 * Ad firmada tekildir; aynı ad ikinci kez yazılırsa sunucu var olanı söyler.
 */
export function useMaterialCreate() {
  const create = useCreateMaterial()
  const queryClient = useQueryClient()

  async function addMaterial(name: string, unit: string) {
    const material = await create.mutateAsync({ data: { name: name.trim(), unit: unit.trim(), active: true } })
    await queryClient.invalidateQueries({ queryKey: getListMaterialsQueryKey() })
    return material
  }

  return { addMaterial, isAdding: create.isPending }
}

/**
 * Şantiyede en çok kullanılan birimler; yeni malzeme açılırken tek dokunuşla seçilir. Listede olmayan birim
 * elle yazılır — birim serbesttir, bu liste yalnızca kısayoldur.
 */
export const COMMON_UNITS = ['Torba', 'Adet', 'Ton', 'Kg', 'm³', 'Metre', 'Paket', 'Kutu']
