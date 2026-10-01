import type { ShipmentRequest } from '@/core/api/generated/model'

/**
 * Sevkiyatın yönü. Kullanıcı "hareket türü" seçmez, yalnızca bunu söyler: kendi şantiyeme mi gidiyor, dışarıdaki
 * bir firmaya mı, yoksa depoya mal mı geldi. Türü sunucu buradan hesaplar.
 */
export type TargetKind = 'SITE' | 'OUTSIDE' | 'INBOUND'

export interface LineDraft {
  /** Satırın ekrandaki kimliği (sunucuya gitmez): ortadan satır silinince seçici ve miktar kutusu kaymasın. */
  key: string
  materialId: string
  quantity: number | null
}

/** Formdaki boş kalem satırı. */
export function newLine(): LineDraft {
  return { key: crypto.randomUUID(), materialId: '', quantity: null }
}

/**
 * Sevkiyat formunun hali. Üç soru vardır: nereye, ne kadar, irsaliye. Nereden sorulmaz — depo sorumlusunun
 * çıkışı ana depodur. "Geri gelecek mi?" yalnızca dışarı verilende çıkar.
 */
export interface ShipmentDraft {
  targetKind: TargetKind
  destinationId: string | null
  partyName: string
  expectsReturn: boolean
  lines: LineDraft[]
  description: string
}

export function emptyDraft(): ShipmentDraft {
  return {
    targetKind: 'SITE',
    destinationId: null,
    partyName: '',
    expectsReturn: false,
    lines: [newLine()],
    description: '',
  }
}

/** İlk soru cevaplandı mı: nereye gittiği belli mi? */
export function hasTarget(draft: ShipmentDraft): boolean {
  if (draft.targetKind === 'SITE') return !!draft.destinationId
  return draft.partyName.trim().length > 0
}

/** İkinci soru: en az bir kalem, malzemesi ve miktarı dolu. */
export function filledLines(draft: ShipmentDraft): LineDraft[] {
  return draft.lines.filter((line) => line.materialId && line.quantity !== null && line.quantity > 0)
}

/**
 * Kaydedilebilir mi ve değilse neden. Mesaj kullanıcıya olduğu gibi gösterilir, o yüzden Türkçe ve kısadır.
 */
export function draftProblem(draft: ShipmentDraft): string | null {
  if (!hasTarget(draft)) {
    if (draft.targetKind === 'SITE') return 'Nereye gittiğini seç.'
    return draft.targetKind === 'INBOUND' ? 'Kimden geldiğini yaz.' : 'Kime verildiğini yaz.'
  }
  if (!filledLines(draft).length) return 'En az bir malzeme ve miktar gir.'
  if (draft.lines.some((line) => line.materialId && (line.quantity ?? 0) <= 0)) return 'Miktar sıfırdan büyük olmalı.'
  return null
}

/**
 * Sunucuya giden istek. Kimliği istemci üretir: aynı istek iki kez giderse ikinci kayıt açılmaz.
 * Depoya giriş ters yönlüdür: çıkış yeri yoktur, mal tedarikçiden depoya gelir.
 */
export function requestOf(draft: ShipmentDraft, depotId: string): ShipmentRequest {
  const inbound = draft.targetKind === 'INBOUND'
  const outside = draft.targetKind === 'OUTSIDE'
  return {
    id: crypto.randomUUID(),
    sourceId: inbound ? null : depotId,
    destinationId: inbound ? depotId : outside ? null : draft.destinationId,
    partyName: inbound || outside ? draft.partyName.trim() : null,
    expectsReturn: outside && draft.expectsReturn,
    description: draft.description.trim() || null,
    lines: filledLines(draft).map((line) => ({
      materialId: line.materialId,
      quantity: line.quantity as number,
    })),
  }
}
