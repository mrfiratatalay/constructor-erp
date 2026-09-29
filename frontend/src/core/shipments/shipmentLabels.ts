import type { ShipmentRowStatus, ShipmentRowType } from '@/core/api/generated/model'

/**
 * Sevkiyatın Türkçesi. Kullanıcı türü seçmez, sunucu hesaplar; buradaki sözlük yalnızca okunur hale getirir.
 * Durum üç tanedir: yolda, teslim alındı, iptal.
 */
export const TYPE_LABELS: Record<ShipmentRowType, string> = {
  INBOUND: 'Depoya geldi',
  TO_SITE: 'Şantiyeye gönderildi',
  TRANSFER: 'Transfer',
  OUTBOUND: 'Dışarı verildi',
  RETURN: 'İade geldi',
}

/**
 * Sevkiyatın iki hali var: kayıtlı ve iptal. Kayıtlı olan normaldir ve ekranda rozet almaz — her satıra "Kayıtlı"
 * yazmak gürültüdür (İlke 3). Yalnızca iptal edilen işaretlenir.
 */
export function cancelledLabel(status: ShipmentRowStatus): string | null {
  return status === 'CANCELLED' ? 'İptal' : null
}

/** Geçmiş satırının okunuşu: "Sevkiyat çıkarıldı · Ahmet · 28 Eyl 14:20". */
export const HISTORY_LABELS: Record<string, string> = {
  CREATED: 'Sevkiyat çıkarıldı',
  DELIVERED: 'Teslim alındı',
  RETURN_ADDED: 'Malzeme geri geldi',
  CANCELLED: 'İptal edildi',
  DOCUMENT_ADDED: 'İrsaliye eklendi',
}

/** Sevkiyatın yolu tek satırda: "Ana Depo → Çamburnu Plaza". Bir ucu yoksa yalnızca o uç yazılır. */
export function routeText(row: { fromName?: string | null; toName?: string | null }): string {
  if (row.fromName && row.toName) return `${row.fromName} → ${row.toName}`
  return row.fromName ?? row.toName ?? '—'
}

/**
 * "40 gündür dönmedi". Bugün verilmiş malzeme için bir şey yazılmaz: sıfır gün bir gecikme değildir ve
 * "0 gündür dönmedi" cümlesi okuyanı yanıltır (İlke 3: olumsuz bilgi yer kaplamaz).
 */
export function waitingText(row: { awaitingReturn: boolean; daysOut?: number | null }): string {
  return row.awaitingReturn && (row.daysOut ?? 0) >= 1 ? `${row.daysOut} gündür dönmedi` : ''
}

/** Kalemler tek satırda: "Çimento 300 Torba, +2 kalem". Uzun listede satır yine tek satır kalır. */
export function linesText(lines: { materialName: string; quantity: number; unit: string }[]): string {
  const [first, ...rest] = lines
  if (!first) return ''
  const head = `${first.materialName} ${new Intl.NumberFormat('tr-TR').format(first.quantity)} ${first.unit}`
  return rest.length ? `${head}, +${rest.length} kalem` : head
}
