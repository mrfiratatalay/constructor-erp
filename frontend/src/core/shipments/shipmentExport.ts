/**
 * Excel dökümünün adresi. Tarayıcı bu bağlantıya doğrudan gider (oturum çerezle taşınır), dosyayı indirir;
 * ekrandaki arama döküme de geçer.
 */
export function shipmentExportUrl(search: string): string {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
  return `/api/shipment-reports/export${query}`
}
