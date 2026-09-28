import type { QueryClient } from '@tanstack/vue-query'

/**
 * Malzemenin bütün sorguları bu öneklerle başlar (üretilen anahtarlar). Bir hareket kaydedilince, iptal edilince ya
 * da teslim alınınca liste, özet, stok, iadeler ve Saha kartları birlikte tazelenir: hepsi aynı defteri okur.
 */
const MATERIAL_QUERY_PREFIXES = [
  ['api', 'material-movements'],
  ['api', 'material-stock'],
  ['api', 'materials'],
  ['api', 'material-parties'],
  ['api', 'stock-locations'],
  ['api', 'posts'],
]

export function refreshMaterials(queryClient: QueryClient) {
  return Promise.all(
    MATERIAL_QUERY_PREFIXES.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  )
}
