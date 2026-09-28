import type { ProductionEntryForm } from '@/core/api/generated/model'
import { compressPhoto } from '@/core/posts/photoCompression'
import { entryPayload, type EntryForm } from '@/core/production/entryForm'

/** Günlük girişe yalnızca fotoğraf ve PDF eklenir (sunucuyla aynı kural); en fazla 10 dosya. */
export const ENTRY_FILE_ACCEPT = 'image/*,application/pdf'
export const ENTRY_FILE_LIMIT = 10

const PDF_MAX_BYTES = 10 * 1024 * 1024

const isPhoto = (file: File) => file.type.startsWith('image/')

/** Eklenemeyecek dosyanın nedeni; eklenebiliyorsa null. Fotoğraf küçültüleceği için boyutu sorulmaz. */
export function entryFileProblem(file: File): string | null {
  if (!isPhoto(file) && file.type !== 'application/pdf')
    return `${file.name}: yalnızca fotoğraf ve PDF eklenebilir.`
  if (!isPhoto(file) && file.size > PDF_MAX_BYTES)
    return `${file.name}: PDF en fazla 10 MB olabilir.`
  return null
}

/** Gönderirken fotoğraflar küçültülür (sahadaki zayıf internet); PDF olduğu gibi gider. */
export const prepareEntryFiles = (files: File[]) =>
  Promise.all(files.map((file) => (isPhoto(file) ? compressPhoto(file) : file)))

/** Sunucuya gidecek form, dosyaları hazırlanmış olarak. */
export async function preparedEntry(
  form: EntryForm,
  files: File[],
  id: string,
): Promise<ProductionEntryForm> {
  return entryPayload(form, await prepareEntryFiles(files), id)
}
