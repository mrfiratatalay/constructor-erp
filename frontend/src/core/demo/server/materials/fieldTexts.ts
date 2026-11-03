import { withUnit } from '@/core/shipments/quantity'
import { endOf, materialIn, placeIn, type Ledger } from './materialLedger'
import type { ShipmentRecord } from './materialRecords'

/** Saha akışına düşecek gönderi: hangi şantiyeye, hangi yazıyla. */
export interface FieldNote {
  siteId: string
  body: string
}

interface Item {
  name: string
  text: string
}

/** Kalemler okunur haliyle: "Çimento 300 Torba". */
function itemsOf(shipment: ShipmentRecord, ledger: Ledger): Item[] {
  return shipment.lines.flatMap((line) => {
    const material = materialIn(ledger, line.materialId)
    if (!material) return []
    return [{ name: material.name, text: `${material.name} ${withUnit(line.quantity, material.unit)}` }]
  })
}

/** Saha simgesi yazıdan okunur ("geldi" teslimattır): şantiyeye gelen "geldi", şantiyeden çıkan "gönderildi" der. */
function headline(shipment: ShipmentRecord, arriving: boolean): string {
  if (shipment.type === 'OUTBOUND') return 'Malzeme dışarı verildi'
  return arriving ? 'Malzeme geldi' : 'Malzeme gönderildi'
}

function routeText(shipment: ShipmentRecord, ledger: Ledger): string {
  const from = endOf(ledger, shipment, 'from').name
  const to = endOf(ledger, shipment, 'to').name
  if (from && to) return ` (${from} → ${to})`
  const only = from ?? to
  return only ? ` (${only})` : ''
}

/** Sevkiyatın dokunduğu şantiyeler; arriving: malzeme bu şantiyeye mi geliyor, yoksa oradan mı çıkıyor. */
function sitesOf(shipment: ShipmentRecord, ledger: Ledger): { siteId: string; arriving: boolean }[] {
  const ends = [
    { siteId: placeIn(ledger, shipment.sourceId)?.siteId, arriving: false },
    { siteId: placeIn(ledger, shipment.destinationId)?.siteId, arriving: true },
  ]
  return ends.flatMap(({ siteId, arriving }) => (siteId ? [{ siteId, arriving }] : []))
}

/**
 * Şantiyeye dokunan sevkiyatın Saha yazısı (FieldTexts): "Malzeme geldi: Çimento 300 Torba (Merkez Depo → Yomra Park
 * Konutları)". İki şantiye arasındaki sevkiyat ikisine de düşer: biri "gönderildi", öbürü "geldi" der.
 */
export function fieldNotes(shipment: ShipmentRecord, ledger: Ledger): FieldNote[] {
  const items = itemsOf(shipment, ledger)
    .map((item) => item.text)
    .join(', ')
  const route = routeText(shipment, ledger)
  return sitesOf(shipment, ledger).map(({ siteId, arriving }) => ({
    siteId,
    body: `${headline(shipment, arriving)}: ${items}${route}`,
  }))
}

/** Saha kartının tek satırı: ada göre ilk kalem ve kaç kalem daha olduğu ("Çimento 300 Torba, +2 kalem"). */
export function fieldSummary(shipment: ShipmentRecord, ledger: Ledger): string {
  const items = itemsOf(shipment, ledger).sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  const [first] = items
  if (!first) return ''
  return items.length > 1 ? `${first.text}, +${items.length - 1} kalem` : first.text
}
