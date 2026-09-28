import type { MovementPurpose, MovementType } from '@/core/materials/materialLabels'

/** Bir lokasyon alanı: etiketi ve yalnızca şantiyelerin mi seçilebildiği ("Hangi Şantiye"). */
export interface EndField {
  label: string
  sitesOnly: boolean
}

/** Firma alanı: tedarikçi, teslim alan ya da malzemenin verildiği firma. */
export interface PartyField {
  label: string
  required: boolean
}

/**
 * Hareket türüne göre formun alanları (dokümanın "Dinamik form" tablosu). Form yalnızca türün istediğini gösterir:
 * Kullanıldı'da hedef, Geldi'de kaynak yoktur; ödünçte iade tarihi açılır; iade bir ödünç çıkışına bağlanır ve
 * malzemesini oradan alır.
 */
export interface MovementFields {
  source: EndField | null
  destination: EndField | null
  party: PartyField | null
  purpose: boolean
  loanDetails: boolean
  usageArea: boolean
  /** Şantiyeye gönderim ve transfer: "Teslim edildi / Yolda". */
  transit: boolean
  /** Geliş: "Kontrol edildi / Kontrol bekliyor". */
  check: boolean
  returnOf: boolean
  descriptionLabel: string
}

const BASE: MovementFields = {
  source: null,
  destination: null,
  party: null,
  purpose: false,
  loanDetails: false,
  usageArea: false,
  transit: false,
  check: false,
  returnOf: false,
  descriptionLabel: 'Açıklama',
}

const FROM: EndField = { label: 'Nereden', sitesOnly: false }
const RECEIVER: PartyField = { label: 'Teslim Alan / Firma', required: false }

const FIELDS: Record<Exclude<MovementType, 'ADJUSTMENT'>, Partial<MovementFields>> = {
  TO_SITE: {
    source: FROM,
    destination: { label: 'Hangi Şantiye', sitesOnly: true },
    party: RECEIVER,
    transit: true,
  },
  USED: { source: { label: 'Nerede kullanıldı', sitesOnly: false }, usageArea: true },
  OUTBOUND: { source: FROM, party: { label: 'Firma', required: true }, purpose: true },
  TRANSFER: {
    source: FROM,
    destination: { label: 'Nereye', sitesOnly: false },
    party: RECEIVER,
    transit: true,
  },
  INBOUND: {
    destination: { label: 'Nereye', sitesOnly: false },
    party: { label: 'Tedarikçi', required: false },
    check: true,
  },
  RETURN: {
    destination: { label: 'Dönüş lokasyonu', sitesOnly: false },
    returnOf: true,
    descriptionLabel: 'Kalite notu',
  },
}

export function movementFields(
  type: MovementType,
  purpose: MovementPurpose | null,
): MovementFields {
  const fields = { ...BASE, ...(type === 'ADJUSTMENT' ? {} : FIELDS[type]) }
  return { ...fields, loanDetails: fields.purpose && purpose === 'LOANED' }
}
