import type { MovementRequest, PartyView, ReturnRow } from '@/core/api/generated/model'
import { todayIsoDate } from '@/core/format/dates'
import type { MovementPurpose, MovementType } from '@/core/materials/materialLabels'
import { movementFields, type MovementFields } from '@/core/materials/movementFields'
import { withUnit } from '@/core/materials/quantity'
import { newId } from '@/core/posts/newId'

/**
 * Yeni hareket formu. Kimlik form açılınca üretilir ve "Kaydet" tekrar denendikçe aynı kalır: bağlantı kopup istek
 * iki kez giderse ikinci kayıt açılmaz. party: seçilen firmanın kimliği ya da yazılan yeni firma adı.
 */
export interface MovementForm {
  id: string
  type: MovementType
  materialId: string | null
  quantity: number | null
  sourceId: string | null
  destinationId: string | null
  party: string
  purpose: MovementPurpose | null
  returnOfId: string | null
  day: string
  expectedReturnDate: string | null
  returnNote: string
  usageArea: string
  description: string
  inTransit: boolean
  pendingCheck: boolean
  reflectToField: boolean
  files: File[]
}

export const emptyMovementForm = (type: MovementType = 'TO_SITE'): MovementForm => ({
  id: newId(),
  type,
  materialId: null,
  quantity: null,
  sourceId: null,
  destinationId: null,
  party: '',
  purpose: null,
  returnOfId: null,
  day: todayIsoDate(),
  expectedReturnDate: null,
  returnNote: '',
  usageArea: '',
  description: '',
  inTransit: false,
  pendingCheck: false,
  reflectToField: true,
  files: [],
})

/** Beklenen iadeden "İade Al": malzeme, miktar ve firma ödünç çıkışından gelir, yanlış ilişki kurulamaz. */
export const returnFormOf = (loan: ReturnRow): MovementForm => ({
  ...emptyMovementForm('RETURN'),
  returnOfId: loan.movementId,
  materialId: loan.materialId,
  quantity: loan.remaining,
})

/** Formun bildiği dış bilgiler: kaynaktaki kullanılabilir stok ve seçilen ödüncün kalanı. */
export interface FormContext {
  available: number | null
  unit: string
  loan: ReturnRow | null
}

function quantityError(form: MovementForm, context: FormContext): string {
  const quantity = form.quantity ?? 0
  if (quantity <= 0) return 'Miktarı yaz: sıfırdan büyük olmalı.'
  if (context.available !== null && quantity > context.available) {
    return `Kullanılabilir stoktan fazla çıkamaz: ${withUnit(Math.max(context.available, 0), context.unit)}.`
  }
  if (context.loan && quantity > context.loan.remaining) {
    return `İade bekleyen miktardan fazla olamaz: ${withUnit(context.loan.remaining, context.unit)}.`
  }
  return ''
}

function endsError(form: MovementForm): string {
  const fields = movementFields(form.type, form.purpose)
  if (fields.source && !form.sourceId) return `${fields.source.label} seç.`
  if (fields.destination && !form.destinationId) return `${fields.destination.label} seç.`
  if (form.sourceId && form.sourceId === form.destinationId)
    return 'Nereden ve nereye aynı lokasyon olamaz.'
  return ''
}

function partyError(form: MovementForm): string {
  const fields = movementFields(form.type, form.purpose)
  if (fields.party?.required && !form.party.trim())
    return 'Malzemenin verildiği firmayı seç ya da adını yaz.'
  return fields.purpose && !form.purpose ? 'Veriliş amacını seç.' : ''
}

/** Formun ilk hatası; yoksa boş. Sunucu aynı kuralları ayrıca denetler (stok kilit altında yeniden hesaplanır). */
function dateError(form: MovementForm): string {
  if (!form.day) return 'Tarihi seç.'
  if (form.day > todayIsoDate()) return 'İleri bir tarihe hareket girilmez.'
  const loanDate = form.purpose === 'LOANED' ? form.expectedReturnDate : null
  return loanDate && loanDate < form.day
    ? 'Beklenen iade tarihi veriliş tarihinden önce olamaz.'
    : ''
}

export function movementFormError(form: MovementForm, context: FormContext): string {
  if (form.type === 'RETURN' && !form.returnOfId) return 'İadenin ait olduğu ödünç çıkışını seç.'
  if (!form.materialId) return 'Malzemeyi seç.'
  return dateError(form) || quantityError(form, context) || endsError(form) || partyError(form)
}

/** Firma alanı: listedeki bir firmanın kimliği mi, yeni yazılmış bir ad mı. */
function partyOf(value: string, parties: PartyView[]) {
  const text = value.trim()
  if (!text) return { partyId: null, partyName: null }
  const known = parties.find((party) => party.id === text)
  return known ? { partyId: known.id, partyName: null } : { partyId: null, partyName: text }
}

/** Türün istemediği alan gönderilmez; boş yazı boş (null) gider. */
const kept = <T>(wanted: boolean, value: T) => (wanted ? value : null)
const textOf = (value: string) => value.trim() || null

function notesOf(form: MovementForm, fields: MovementFields) {
  return {
    expectedReturnDate: kept(fields.loanDetails, form.expectedReturnDate),
    returnNote: kept(fields.loanDetails, textOf(form.returnNote)),
    usageArea: kept(fields.usageArea, textOf(form.usageArea)),
    description: textOf(form.description),
  }
}

export function movementRequestOf(form: MovementForm, parties: PartyView[]): MovementRequest {
  const fields = movementFields(form.type, form.purpose)
  return {
    id: form.id,
    type: form.type,
    materialId: form.materialId,
    quantity: form.quantity ?? 0,
    sourceId: kept(!!fields.source, form.sourceId),
    destinationId: kept(!!fields.destination, form.destinationId),
    ...(fields.party ? partyOf(form.party, parties) : {}),
    purpose: kept(fields.purpose, form.purpose) ?? undefined,
    returnOfId: kept(fields.returnOf, form.returnOfId),
    day: form.day,
    ...notesOf(form, fields),
    inTransit: fields.transit && form.inTransit,
    pendingCheck: fields.check && form.pendingCheck,
    reflectToField: form.reflectToField,
  }
}
