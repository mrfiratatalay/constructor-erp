import dayjs from 'dayjs'
import type { ProductionEntryForm, ProductionItemView } from '@/core/api/generated/model'
import { quantityLabel } from '@/core/production/productionFormat'

/**
 * "Günlük İmalat Güncellemesi" penceresinin alanları. Birim sorulmaz: imalat açılırken belirlendi. Tarih bugünle
 * gelir, geçmiş güne değiştirilebilir. Saha'ya yansıtma kapalı gelir: Saha'yı çalışanlar da görür.
 */
export interface EntryForm {
  quantity: number | undefined
  workerCount: number | undefined
  day: string
  note: string
  onField: boolean
}

export function emptyEntryForm(today = dayjs()): EntryForm {
  return {
    quantity: undefined,
    workerCount: undefined,
    day: today.format('YYYY-MM-DD'),
    note: '',
    onField: false,
  }
}

/** Kaydedilemeyecek formun nedeni; kaydedilebiliyorsa null. 0 geçerlidir: "çalışma yapılmadı". */
export function entryFormProblem(form: EntryForm, today = dayjs()): string | null {
  if (form.quantity === undefined || form.quantity === null || form.quantity < 0)
    return 'Bugün yapılan miktarı yaz.'
  if (!form.day) return 'Tarihi seç.'
  if (dayjs(form.day).isAfter(today, 'day')) return 'İleri bir güne giriş yapılmaz.'
  return null
}

/** Ondalık toplamada kayma olmasın (0,1 + 0,2): miktarlar üç haneye yuvarlanır, sunucu da üç hane tutar. */
const rounded = (value: number) => Math.round(value * 1000) / 1000

/**
 * Giriş toplamı aşıyorsa sorulacak soru; aşmıyorsa null. Engellenmez: şef onaylarsa kaydedilir (fazla iş olabilir).
 * "Bu giriş ile toplam gerçekleşme 123 tona çıkacak (toplam 120 ton). Devam edilsin mi?"
 */
export function overflowQuestion(item: ProductionItemView, quantity: number): string | null {
  const after = rounded(item.doneQuantity + quantity)
  if (after <= item.totalQuantity) return null
  return `Bu giriş ile toplam gerçekleşme ${quantityLabel(after)} ${item.unit} olacak (toplam ${quantityLabel(item.totalQuantity)} ${item.unit}). Devam edilsin mi?`
}

/** Sunucuya giden form; kimliği burada üretilir, istek tekrar giderse aynı giriş iki kez sayılmaz. */
export function entryPayload(form: EntryForm, files: File[], id: string): ProductionEntryForm {
  return {
    id,
    day: form.day,
    quantity: rounded(form.quantity ?? 0),
    workerCount: form.workerCount ?? null,
    note: form.note.trim() || null,
    onField: form.onField,
    files,
  }
}
