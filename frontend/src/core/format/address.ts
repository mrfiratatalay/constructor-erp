/** Adrese dokununca telefonun harita uygulaması (ya da tarayıcıda harita) açılır. */
export function mapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
