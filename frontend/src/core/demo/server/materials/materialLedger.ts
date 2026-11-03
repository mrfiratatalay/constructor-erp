import type { LocationViewKind } from '@/core/api/generated/model'
import type { SiteRecord } from '@/core/demo/server/sites/siteRecords'
import type { MaterialRecord, MaterialsState, PartyRecord, ShipmentRecord } from './materialRecords'

/** Stoğun durduğu yer: depo ya da şantiye. Tamamlanmış şantiye seçeneklerin sonunda durur (active: false). */
export interface Place {
  id: string
  kind: LocationViewKind
  name: string
  siteId: string | null
  active: boolean
}

/**
 * Bir firmanın malzeme defteri: yerler, kartlar, taraflar ve sevkiyatlar yalnızca o firmanındır. Çalışan demo da
 * tohumlama da (db() henüz yokken taslak veritabanıyla) aynı hesabı kullanır.
 */
export interface Ledger {
  companyId: string
  places: Place[]
  materials: MaterialRecord[]
  parties: PartyRecord[]
  shipments: ShipmentRecord[]
}

/** Sevkiyatın bir ucu, okunur haliyle: depo ve şantiye kendi adıyla, dışarısı tarafın adıyla (EXTERNAL). */
export interface End {
  name: string | null
  kind: string | null
}

export const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'tr')

/** Önce açık yerler; her grupta önce depolar, sonra ada göre (backend'deki sıra). */
function placeOrder(a: Place, b: Place): number {
  if (a.active !== b.active) return a.active ? -1 : 1
  if (a.kind !== b.kind) return a.kind === 'DEPOT' ? -1 : 1
  return byName(a, b)
}

function placesOf(state: MaterialsState, sites: SiteRecord[], companyId: string): Place[] {
  const depots = state.depots
    .filter((depot) => depot.companyId === companyId)
    .map((depot): Place => ({ id: depot.id, kind: 'DEPOT', name: depot.name, siteId: null, active: true }))
  const sitePlaces = sites
    .filter((site) => site.companyId === companyId)
    .map((site): Place => {
      const active = site.status === 'ACTIVE'
      return { id: site.id, kind: 'SITE', name: site.name, siteId: site.id, active }
    })
  return [...depots, ...sitePlaces].sort(placeOrder)
}

export function ledgerOf(state: MaterialsState, sites: SiteRecord[], companyId: string): Ledger {
  const own = <T extends { companyId: string }>(rows: T[]) => rows.filter((row) => row.companyId === companyId)
  return {
    companyId,
    places: placesOf(state, sites, companyId),
    materials: own(state.materials),
    parties: own(state.parties),
    shipments: own(state.shipments),
  }
}

export const placeIn = (ledger: Ledger, id: string | null): Place | undefined =>
  id ? ledger.places.find((place) => place.id === id) : undefined

export const materialIn = (ledger: Ledger, id: string): MaterialRecord | undefined =>
  ledger.materials.find((material) => material.id === id)

export function endOf(ledger: Ledger, shipment: ShipmentRecord, side: 'from' | 'to'): End {
  const locationId = side === 'from' ? shipment.sourceId : shipment.destinationId
  if (locationId) {
    const place = placeIn(ledger, locationId)
    return { name: place?.name ?? null, kind: place?.kind ?? null }
  }
  const party = ledger.parties.find((candidate) => candidate.id === shipment.partyId)
  return { name: party?.name ?? null, kind: party ? 'EXTERNAL' : null }
}
