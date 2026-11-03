import { fixedId, ID_GROUP } from '@/core/demo/server/seed/seedContext'
import type { MaterialsState } from './materialRecords'

/**
 * Bu modülün kimlik grupları (20–29). Örnek veri her gün yeniden üretilir; kimlikler sabit kaldığı için adresteki
 * açık sevkiyat (?hareket=…) ertesi gün de aynı kayda gider.
 */
export const ID = {
  material: ID_GROUP.materials,
  depot: ID_GROUP.materials + 1,
  party: ID_GROUP.materials + 2,
  shipment: ID_GROUP.materials + 3,
  document: ID_GROUP.materials + 4,
  fieldPost: ID_GROUP.materials + 5,
} as const

// [ad, birim]. Birimler formdaki hazır düğmelerle aynı yazılır (Torba, Adet, Ton…); kalıp yağı bidonla gelir.
const MATERIALS = {
  panel: ['Kalıp paneli', 'Adet'],
  cement: ['Çimento', 'Torba'],
  rebar16: ['İnşaat demiri Ø16', 'Ton'],
  rebar12: ['İnşaat demiri Ø12', 'Ton'],
  prop: ['Teleskopik dikme', 'Adet'],
  plaster: ['Saten alçı', 'Torba'],
  cable: ['NYM kablo 3x2,5', 'Metre'],
  scaffold: ['İskele elemanı', 'Adet'],
  wire: ['Bağ teli', 'Kg'],
  formOil: ['Kalıp yağı', 'Bidon'],
  brick: ['Yatay delikli tuğla', 'Adet'],
  sand: ['Kum', 'm³'],
} as const

// Tedarikçiler malzemeyi depoya getirir; öbür müteahhitlere malzeme ödünç verilir ya da satılır.
const PARTIES = {
  karadeniz: 'Karadeniz Demir Çelik',
  akyazi: 'Akyazı Yapı Market',
  trabzon: 'Trabzon Hazır Beton',
  degirmendere: 'Değirmendere İnşaat',
  surmene: 'Sürmene Yapı',
  arsin: 'Arsin Yapı',
} as const

export type MaterialKey = keyof typeof MATERIALS
export type PartyKey = keyof typeof PARTIES

const materialKeys = Object.keys(MATERIALS) as MaterialKey[]
const partyKeys = Object.keys(PARTIES) as PartyKey[]

export const isPartyKey = (key: string): key is PartyKey => key in PARTIES
export const materialId = (key: MaterialKey) => fixedId(ID.material, materialKeys.indexOf(key) + 1)
export const partyId = (key: PartyKey) => fixedId(ID.party, partyKeys.indexOf(key) + 1)
export const depotId = () => fixedId(ID.depot, 1)

/** Atalay Yapı'nın tek ana deposu, malzeme kartları ve dışarıdaki taraflar. */
export function seedCatalog(state: MaterialsState, companyId: string, createdAt: string): void {
  state.depots.push({ id: depotId(), companyId, name: 'Merkez Depo', createdAt })
  for (const key of materialKeys) {
    const [name, unit] = MATERIALS[key]
    state.materials.push({ id: materialId(key), companyId, name, unit, active: true, createdAt })
  }
  for (const key of partyKeys) state.parties.push({ id: partyId(key), companyId, name: PARTIES[key], createdAt })
}
