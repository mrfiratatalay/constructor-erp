import type { ShipmentRowType } from '@/core/api/generated/model'
import { badRequest } from '@/core/demo/server/demoError'
import type { Place } from './materialLedger'

export interface Route {
  type: ShipmentRowType
  sourceId: string | null
  destinationId: string | null
}

export interface Ends {
  source: Place | null
  destination: Place | null
}

function requireParty(hasParty: boolean, problem: string): void {
  if (!hasParty) throw badRequest(problem)
}

/** Çıkış yeri yoksa malzeme dışarıdan geliyordur; çıkışa bağlı bir iadeyse adı "iade"dir. */
function inbound(destination: Place | null, hasParty: boolean, back: boolean): Route {
  if (!destination) throw badRequest('Sevkiyatın en az bir ucu depo ya da şantiye olmalı.')
  requireParty(hasParty, 'Malzemenin kimden geldiği yazılmalı.')
  return { type: back ? 'RETURN' : 'INBOUND', sourceId: null, destinationId: destination.id }
}

/**
 * Sevkiyatın adı iki ucundan çıkar (backend'deki ShipmentRoute): kullanıcıya "hangi tür hareket?" diye sorulmaz, o
 * yalnızca nereye gittiğini söyler. Şantiyeye giden "şantiyeye gönderildi", depoya dönen "transfer" olur.
 */
export function routeOf({ source, destination }: Ends, hasParty: boolean, back: boolean): Route {
  if (!source) return inbound(destination, hasParty, back)
  if (!destination) {
    requireParty(hasParty, 'Malzemenin kime verildiği yazılmalı.')
    return { type: 'OUTBOUND', sourceId: source.id, destinationId: null }
  }
  if (source.id === destination.id) throw badRequest('Sevkiyatın çıkış ve varış yeri aynı olamaz.')
  const type = destination.kind === 'SITE' ? 'TO_SITE' : 'TRANSFER'
  return { type, sourceId: source.id, destinationId: destination.id }
}
