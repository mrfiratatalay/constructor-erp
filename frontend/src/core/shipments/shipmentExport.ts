import type { MovementFilter } from '@/core/shipments/movementFilters'

/** Excel, sayfalamadan bağımsız olarak arama ve tüm etkin süzgeçlerdeki hareketleri içerir. */
export function shipmentExportUrl(search: string, filter?: MovementFilter): string {
  const query = new URLSearchParams()
  if (search.trim()) query.set('search', search.trim())
  if (filter) addFilter(query, filter)
  return `/api/shipment-reports/export${query.size ? `?${query}` : ''}`
}

/** Ekrandaki süzgeçler dökümün sorgusuna; "tümü" kapsamı varsayılan olduğu için yazılmaz. */
function addFilter(query: URLSearchParams, filter: MovementFilter) {
  if (filter.scope && filter.scope !== 'all') query.set('scope', filter.scope)
  if (filter.type) query.set('type', filter.type)
  if (filter.point) query.set('point', filter.point)
  if (filter.dates) {
    query.set('fromDay', filter.dates[0])
    query.set('toDay', filter.dates[1])
  }
}
