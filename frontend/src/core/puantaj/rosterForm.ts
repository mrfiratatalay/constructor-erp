import type { RosterEntryRequest, RosterEntryView } from '@/core/api/generated/model'

export type RosterKind = RosterEntryRequest['kind']

/**
 * Listeye ekleme formu. Kişi: ad soyad, görevi, telefonu. Taşeron ekip: iş kolu ("Demirci"), ekip başının adı,
 * telefonu; ekipte kaç kişi olduğu sorulmaz. Uygulamadaki çalışanın yalnızca görevi düzeltilir: adı ve numarası
 * kendi hesabından gelir.
 */
export interface RosterForm {
  kind: RosterKind
  name: string
  trade: string
  phone: string
  linked: boolean
}

export const emptyRosterForm = (kind: RosterKind = 'PERSON'): RosterForm => ({
  kind,
  name: '',
  trade: '',
  phone: '',
  linked: false,
})

export const rosterFormOf = (entry: RosterEntryView): RosterForm => ({
  kind: entry.kind,
  name: entry.name,
  trade: entry.trade ?? '',
  phone: entry.phone ?? '',
  linked: entry.linked,
})

export const rosterRequestOf = (form: RosterForm): RosterEntryRequest => ({
  kind: form.kind,
  name: form.name.trim(),
  trade: form.trade.trim() || null,
  phone: form.phone.trim() || null,
})

/** Formun alan adları türe göre: aynı iki kutu kişide "Ad soyad / Görevi", ekipte "Ekip başı / İş kolu" olur. */
export function rosterLabels(kind: RosterKind) {
  return kind === 'CREW'
    ? { name: 'Ekip başı', namePlaceholder: 'Hasan Usta', trade: 'İş kolu', tradePlaceholder: 'Demirci' }
    : { name: 'Ad soyad', namePlaceholder: 'Ali Yılmaz', trade: 'Görevi', tradePlaceholder: 'Kalıpçı' }
}

/** Formun hatası; yoksa boş. Uygulamadaki çalışanın adı buradan değişmez, kontrol edilmez. */
export function rosterFormError(form: RosterForm): string {
  if (!form.linked && !form.name.trim()) return form.kind === 'CREW' ? 'Ekip başının adını yaz.' : 'Adını yaz.'
  return ''
}
