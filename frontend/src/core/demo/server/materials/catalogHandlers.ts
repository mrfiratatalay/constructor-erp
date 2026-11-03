import type { DepotRequest, LocationView, MaterialRequest, MaterialView, PartyView } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError, notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { allow, ledgerFor } from './materialAccess'
import { byName, type Ledger, type Place } from './materialLedger'
import type { MaterialRecord } from './materialRecords'
import { limited, sameName, tidy } from './materialTexts'

type Card = Pick<MaterialRecord, 'name' | 'unit' | 'active'>

const materialView = ({ id, name, unit, active }: MaterialRecord): MaterialView => ({ id, name, unit, active })

const locationView = ({ id, kind, name, siteId, active }: Place): LocationView => ({ id, kind, name, siteId, active })

/** Önce aktif kartlar, sonra pasifler; her grup ada göre. */
function catalogOrder(a: MaterialRecord, b: MaterialRecord): number {
  if (a.active !== b.active) return a.active ? -1 : 1
  return byName(a, b)
}

export function listMaterials(): MaterialView[] {
  return [...ledgerFor(allow('VIEW_MATERIALS')).materials].sort(catalogOrder).map(materialView)
}

/** Kart yalnızca ad ve birimdir. Ad firmada tekildir; aynı ad ikinci kez yazılırsa var olan söylenir. */
function cardOf(ledger: Ledger, body: unknown, exceptId?: string): Card {
  const request = (body ?? {}) as Partial<MaterialRequest>
  const name = limited(tidy(request.name), 120, 'Malzeme adı')
  const unit = limited(tidy(request.unit), 20, 'Birim')
  if (!name) throw badRequest('Malzemenin adını yaz.')
  if (!unit) throw badRequest('Birimini seç: torba, adet, ton…')
  if (ledger.materials.some((material) => material.id !== exceptId && sameName(material.name, name))) {
    throw new DemoError(409, `Bu adla bir malzeme zaten var: ${name}.`)
  }
  return { name, unit, active: request.active === true }
}

/**
 * POST /api/materials: listede olmayan malzeme sevkiyat formundan çıkılmadan açılır. Şef de açabilir; ayrı bir
 * ekrana gitmek gerekseydi sevkiyat hiç girilmezdi.
 */
export function createMaterial({ body }: DemoRequest): MaterialView {
  const member = allow('MANAGE_MATERIAL_CATALOG')
  const card = cardOf(ledgerFor(member), body)
  const material: MaterialRecord = { id: newId(), companyId: member.company.id, ...card, createdAt: nowIso() }
  db().materials.materials.push(material)
  return materialView(material)
}

/** PUT /api/materials/:materialId: kart silinmez, pasifleşir; yeni sevkiyatta seçilmez, geçmişte adı yerinde kalır. */
export function updateMaterial({ params, body }: DemoRequest): MaterialView {
  const ledger = ledgerFor(allow('MANAGE_MATERIAL_CATALOG'))
  const material = ledger.materials.find((candidate) => candidate.id === params.materialId)
  if (!material) throw notFound('Malzeme')
  return materialView(Object.assign(material, cardOf(ledger, body, material.id)))
}

export function listParties(): PartyView[] {
  return [...ledgerFor(allow('VIEW_MATERIALS')).parties].sort(byName).map(({ id, name }) => ({ id, name }))
}

/**
 * GET /api/stock-locations: depolar ve şantiyeler. Firmanın hiç deposu yoksa ilk okumada "Ana Depo" açılır; sevkiyat
 * formu çıkış yerini sormaz, her zaman ana depodur.
 */
export function listLocations(): LocationView[] {
  const member = allow('VIEW_MATERIALS')
  const depots = db().materials.depots
  if (!depots.some((depot) => depot.companyId === member.company.id)) {
    depots.push({ id: newId(), companyId: member.company.id, name: 'Ana Depo', createdAt: nowIso() })
  }
  return ledgerFor(member).places.map(locationView)
}

/** POST /api/stock-locations: yeni depo. Şantiyeler lokasyon olarak kendiliğinden gelir. */
export function createDepot({ body }: DemoRequest): LocationView {
  const member = allow('MANAGE_MATERIAL_CATALOG')
  const name = limited(tidy((body as Partial<DepotRequest> | undefined)?.name), 120, 'Depo adı')
  if (!name) throw badRequest('Deponun adını yaz.')
  if (ledgerFor(member).places.some((place) => place.kind === 'DEPOT' && sameName(place.name, name))) {
    throw new DemoError(409, 'Bu adla bir depo zaten var.')
  }
  const depot = { id: newId(), companyId: member.company.id, name, createdAt: nowIso() }
  db().materials.depots.push(depot)
  return locationView({ id: depot.id, kind: 'DEPOT', name, siteId: null, active: true })
}
