import type { ShipmentRequest } from '@/core/api/generated/model'
import type { MovementKind } from '@/core/shipments/movementPresentation'
import { emptyDraft, requestOf, type ShipmentDraft } from '@/core/shipments/shipmentForm'

export interface MovementDraft extends ShipmentDraft {
  id: string
}

export const MOVEMENT_COPY: Record<MovementKind, { title: string; subtitle: string; submit: string }> = {
  SITE: {
    title: 'Yeni Şantiye Sevkiyatı',
    subtitle: 'Ana depodan şantiyeye malzeme çıkışı oluşturun.',
    submit: 'Sevkiyatı oluştur',
  },
  OUTSIDE: {
    title: 'Yeni Harici Çıkış',
    subtitle: 'Harici firmaya gönderilen malzemeleri ve geri dönüş beklentisini kaydedin.',
    submit: 'Çıkışı kaydet',
  },
  RETURN: {
    title: 'Malzeme Geri Geldi',
    subtitle: 'Geri beklenen bir çıkışı seçerek malzemelerin dönüşünü kaydedin.',
    submit: 'Geri dönüşü kaydet',
  },
  INBOUND: {
    title: 'Yeni Depo Girişi',
    subtitle: 'Dışarıdan ana depoya gelen malzemeleri kaydedin.',
    submit: 'Girişi kaydet',
  },
}

export function emptyMovementDraft(kind: MovementKind): MovementDraft {
  return { ...emptyDraft(), id: crypto.randomUUID(), targetKind: kind === 'RETURN' ? 'SITE' : kind }
}

function materialsProblem(draft: ShipmentDraft): string | null {
  if (!draft.lines.length) return 'En az bir malzeme ekleyin.'
  if (draft.lines.some((line) => !line.materialId)) return 'Her satırda malzeme seçin.'
  if (draft.lines.some((line) => !Number.isFinite(line.quantity) || (line.quantity ?? 0) <= 0)) {
    return 'Her malzeme için sıfırdan büyük bir miktar girin.'
  }
  if (new Set(draft.lines.map((line) => line.materialId)).size !== draft.lines.length) {
    return 'Aynı malzemeyi tek satırda, toplam miktarıyla girin.'
  }
  return null
}

export function movementProblem(draft: ShipmentDraft): string | null {
  if (draft.targetKind === 'SITE' && !draft.destinationId) return 'Şantiye seçin.'
  if (draft.targetKind !== 'SITE' && !draft.partyName.trim()) return 'Firma veya kişi adını yazın.'
  if (draft.partyName.trim().length > 120) return 'Firma veya kişi adı en çok 120 karakter olabilir.'
  if (draft.description.trim().length > 500) return 'Açıklama en çok 500 karakter olabilir.'
  return materialsProblem(draft)
}

export function movementRequest(draft: MovementDraft, depotId: string): ShipmentRequest {
  return { ...requestOf(draft, depotId), id: draft.id }
}

export const DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'
const DOCUMENT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export function documentProblem(file: File): string | null {
  if (!DOCUMENT_TYPES.has(file.type)) return 'Yalnızca PDF, JPG veya PNG yükleyin.'
  if (!file.size) return 'Boş dosya yüklenemez.'
  if (file.size > 10 * 1024 * 1024) return 'Her belge en çok 10 MB olabilir.'
  return null
}

export function documentsProblem(files: File[]): string | null {
  for (const file of files) {
    const problem = documentProblem(file)
    if (problem) return problem
  }
  return files.reduce((bytes, file) => bytes + file.size, 0) >= 250 * 1024 * 1024
    ? 'Belgelerin toplam boyutu 250 MB altında olmalı.'
    : null
}
