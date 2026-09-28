import type {
  HistoryEntryKind,
  MovementRequestPurpose,
  MovementRowStatus,
  MovementRowType,
  StockRowStatus,
} from '@/core/api/generated/model'

export type MovementType = MovementRowType
export type MovementStatus = MovementRowStatus
export type MovementPurpose = NonNullable<MovementRequestPurpose>

/**
 * Hareket türünün rengi (TASARIM.md "Malzemeler"): mavi şantiyeye gönderim, turuncu kullanım, soft kırmızı dışarı
 * verme, mor transfer, yeşil geliş, teal iade, gri sayım. Tür rozeti bu tonla, durum etiketi kütüphanenin durum
 * renkleriyle çizilir: ikisi yan yana karışmaz.
 */
export type MovementTone = 'site' | 'used' | 'out' | 'transfer' | 'in' | 'return' | 'count'

export interface TypeLook {
  label: string
  /** Süzgeç çipindeki çoğul ad: "Şantiyeye Giden", "Gelen". */
  chip: string
  /** Hareket türü seçerken altında yazan kısa amaç. */
  hint: string
  tone: MovementTone
}

export const TYPE_LOOKS: Record<MovementType, TypeLook> = {
  TO_SITE: {
    label: 'Şantiyeye Gönderildi',
    chip: 'Şantiyeye Giden',
    hint: 'Depodan şantiyeye sevk',
    tone: 'site',
  },
  USED: { label: 'Kullanıldı', chip: 'Kullanılan', hint: 'Şantiye stoğundan sarf', tone: 'used' },
  OUTBOUND: {
    label: 'Dışarı Verildi',
    chip: 'Dışarı Verilen',
    hint: 'Firma ya da müteahhide çıkış',
    tone: 'out',
  },
  TRANSFER: { label: 'Transfer', chip: 'Transfer', hint: 'İki lokasyon arası', tone: 'transfer' },
  INBOUND: { label: 'Geldi', chip: 'Gelen', hint: 'Şirkete yeni malzeme girişi', tone: 'in' },
  RETURN: { label: 'İade', chip: 'İade', hint: 'Ödünç verilenin geri gelişi', tone: 'return' },
  ADJUSTMENT: {
    label: 'Sayım Düzeltmesi',
    chip: 'Sayım',
    hint: 'Fiziksel sayım farkı',
    tone: 'count',
  },
}

/** Yeni hareket formundaki seçenekler, ekrandaki sırayla. Sayım düzeltmesi burada yoktur: stok satırından girilir. */
export const MOVEMENT_CHOICES: MovementType[] = [
  'TO_SITE',
  'USED',
  'OUTBOUND',
  'TRANSFER',
  'INBOUND',
  'RETURN',
]

/** Süzgeç çiplerinin sırası (Tümü en başta ayrıca). Sayım çipi yalnızca sayım varsa görünür. */
export const CHIP_TYPES: MovementType[] = [
  'TO_SITE',
  'USED',
  'OUTBOUND',
  'TRANSFER',
  'INBOUND',
  'RETURN',
  'ADJUSTMENT',
]

/** Durumun tonu iki kütüphanenin ortak durum adlarıdır (Element Plus ve Vant etiket türleri). */
export type StatusTone = 'success' | 'warning' | 'danger' | 'primary' | 'info'

export const STATUS_LOOKS: Record<MovementStatus, { label: string; tone: StatusTone }> = {
  PENDING_CHECK: { label: 'Kontrol Bekliyor', tone: 'warning' },
  IN_TRANSIT: { label: 'Yolda', tone: 'warning' },
  DELIVERED: { label: 'Teslim Edildi', tone: 'success' },
  COMPLETED: { label: 'Tamamlandı', tone: 'success' },
  AWAITING_RETURN: { label: 'Geri Dönüş Bekliyor', tone: 'primary' },
  PARTIALLY_RETURNED: { label: 'Kısmi İade', tone: 'warning' },
  RETURNED: { label: 'İade Tamamlandı', tone: 'success' },
  CANCELLED: { label: 'İptal', tone: 'info' },
}

export const PURPOSE_LABELS: Record<MovementPurpose, string> = {
  SOLD: 'Satıldı',
  LOANED: 'Ödünç Verildi',
  SUPPORT: 'Destek / Karşılıksız',
}

export const STOCK_LOOKS: Record<StockRowStatus, { label: string; tone: StatusTone }> = {
  NORMAL: { label: 'Normal', tone: 'success' },
  CRITICAL: { label: 'Kritik', tone: 'warning' },
  OUT: { label: 'Tükendi', tone: 'danger' },
}

export const HISTORY_LABELS: Record<HistoryEntryKind, string> = {
  CREATED: 'Kaydı oluşturdu',
  DELIVERED: 'Teslim aldı',
  UPDATED: 'Düzeltti',
  CANCELLED: 'İptal etti',
  RETURN_ADDED: 'İade aldı',
  DOCUMENT_ADDED: 'Belge ekledi',
}

/** Birim önerileri; kart formunda listeden seçilir ya da yazılır. */
export const UNIT_SUGGESTIONS = [
  'Adet',
  'Torba',
  'Ton',
  'Kg',
  'm²',
  'm³',
  'Metre',
  'Paket',
  'Palet',
  'Litre',
  'Kamyon',
]

/** Sayım düzeltmesinin nedenleri; listeden seçilir ya da yazılır. */
export const ADJUSTMENT_REASONS = ['Sayım farkı', 'Fire', 'Kayıp', 'Hasar', 'Kayıt hatası']
