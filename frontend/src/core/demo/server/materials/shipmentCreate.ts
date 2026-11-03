import type { ShipmentDetail, ShipmentLineRequest, ShipmentRequest } from '@/core/api/generated/model'
import { nowIso, today } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import type { Member } from '@/core/demo/server/demoSession'
import { addPost } from '@/core/demo/server/posts/postStore'
import { fieldNotes } from './fieldTexts'
import { allow, ledgerFor, requireShipment } from './materialAccess'
import { placeIn, type Ledger, type Place } from './materialLedger'
import type { PartyRecord, ShipmentLineRecord, ShipmentRecord } from './materialRecords'
import { dayFrom, limited, sameName, tidy } from './materialTexts'
import { newShipment, nextNumber } from './shipmentChanges'
import { routeOf } from './shipmentRoute'
import { detailOf } from './shipmentViews'

/** Listede olmayan ad: sevkiyat geçerliyse yeni taraf olarak açılır. */
type PartyChoice = PartyRecord | { name: string }

// Miktar sıfırdan büyüktür ve en çok üç ondalıklıdır (1,250 ton); backend'deki @Positive @Digits(fraction = 3).
const isQuantity = (value: unknown): value is number =>
  typeof value === 'number' && value > 0 && value < 1e11 && Math.abs(value * 1000 - Math.round(value * 1000)) < 1e-6

function linesOf(ledger: Ledger, lines: ShipmentLineRequest[] | undefined): ShipmentLineRecord[] {
  if (!lines?.length) throw badRequest('En az bir malzeme ve miktar gir.')
  return lines.map((line) => {
    if (!isQuantity(line.quantity)) throw badRequest('Miktar sıfırdan büyük, en çok üç ondalıklı bir sayı olmalı.')
    if (!ledger.materials.some((material) => material.id === line.materialId)) throw notFound('Malzeme')
    return { materialId: line.materialId, quantity: line.quantity }
  })
}

function placeOf(ledger: Ledger, locationId: string | null | undefined): Place | null {
  if (!locationId) return null
  const place = placeIn(ledger, locationId)
  if (!place) throw notFound('Lokasyon')
  return place
}

/** Seçilen taraf ya da yazılan ad; ikisi de boşsa taraf yok. "ABC İnşaat" ile "abc inşaat" aynı taraftır. */
function partyOf(ledger: Ledger, request: ShipmentRequest): PartyChoice | null {
  if (request.partyId) {
    const chosen = ledger.parties.find((party) => party.id === request.partyId)
    if (!chosen) throw notFound('Firma')
    return chosen
  }
  const name = limited(tidy(request.partyName), 120, 'Firma adı')
  if (!name) return null
  return ledger.parties.find((party) => sameName(party.name, name)) ?? { name }
}

/** Ayrı bir firma ekranı yoktur: formda yazılan yeni ad burada, sevkiyat geçerli çıktıktan sonra kaydedilir. */
function partyIdOf(choice: PartyChoice, companyId: string): string {
  if ('id' in choice) return choice.id
  const party: PartyRecord = { id: newId(), companyId, name: choice.name, createdAt: nowIso() }
  db().materials.parties.push(party)
  return party.id
}

/** İade kaydı yalnızca bu firmanın dışarı verilmiş bir sevkiyatına bağlanır. */
function returnedOf(ledger: Ledger, returnOfId: string | null | undefined): string | null {
  if (!returnOfId) return null
  const out = requireShipment(ledger, returnOfId)
  if (out.type !== 'OUTBOUND') throw badRequest('İade yalnızca dışarı verilen bir sevkiyata bağlanır.')
  return out.id
}

/** Her şey doğrulanır, sonra yazılır: backend işlemi geri alırdı, demoda yarım kalmış taraf kaydı kalmasın. */
function shipmentOf(member: Member, ledger: Ledger, request: ShipmentRequest): ShipmentRecord {
  const lines = linesOf(ledger, request.lines)
  const description = limited(tidy(request.description), 500, 'Açıklama')
  const day = request.day ? dayFrom(request.day) : today()
  const party = partyOf(ledger, request)
  const ends = { source: placeOf(ledger, request.sourceId), destination: placeOf(ledger, request.destinationId) }
  const route = routeOf(ends, party !== null, !!request.returnOfId)
  const returnOfId = returnedOf(ledger, request.returnOfId)
  return newShipment({
    id: request.id,
    companyId: member.company.id,
    number: nextNumber(ledger.shipments),
    route,
    partyId: party ? partyIdOf(party, member.company.id) : null,
    lines,
    day,
    description,
    // "Geri gelecek mi?" yalnızca dışarı verilende sorulur; kendi şantiyemize giden mal zaten bizimdir.
    expectsReturn: route.type === 'OUTBOUND' && request.expectsReturn === true,
    returnOfId,
    createdById: member.person.id,
    createdAt: nowIso(),
  })
}

/** Şantiyeye dokunan sevkiyat o şantiyenin Saha akışına düşer; gönderi yalnızca izdir, verinin sahibi sevkiyattır. */
function reflect(shipment: ShipmentRecord, ledger: Ledger): void {
  for (const { siteId, body } of fieldNotes(shipment, ledger)) {
    const { createdById: authorId, createdAt } = shipment
    const post = addPost({ siteId, authorId, body, fieldUpdate: true, createdAt })
    shipment.fieldPosts.push({ postId: post.id, siteId })
  }
}

/**
 * POST /api/shipments. Kimliği istemci üretir: aynı istek iki kez gelirse (kopan bağlantı, iki kez basılan düğme)
 * ikinci kayıt açılmaz, ilki döner.
 */
export function createShipment({ body }: DemoRequest): ShipmentDetail {
  const member = allow('CREATE_MATERIAL_MOVEMENT')
  const request = (body ?? {}) as ShipmentRequest
  if (!request.id) throw badRequest('Sevkiyatın kimliği eksik.')
  const ledger = ledgerFor(member)
  const existing = ledger.shipments.find((shipment) => shipment.id === request.id)
  if (existing) return detailOf(existing, ledger)
  const shipment = shipmentOf(member, ledger, request)
  db().materials.shipments.push(shipment)
  // Yeni taraf ve sevkiyatın kendisi okunurken de görünsün diye defter yeniden kurulur.
  const updated = ledgerFor(member)
  reflect(shipment, updated)
  return detailOf(shipment, updated)
}
