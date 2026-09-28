import type { QueryClient } from '@tanstack/vue-query'
import { FEED_QUERY_PREFIX } from '@/core/posts/useFeed'

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
  // Saha'ya yansıyan hareket şantiyenin akışına (Sohbet ve Saha) düşer.
  [FEED_QUERY_PREFIX],
]

export function refreshMaterials(queryClient: QueryClient) {
  return Promise.all(
    MATERIAL_QUERY_PREFIXES.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  )
}
