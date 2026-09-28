/** Hareket belgeleri: irsaliye, fatura, teslim tutanağı. Sunucu aynı sınırları ayrıca denetler. */
export const DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
const DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

/** Dosyanın eklenememe nedeni; eklenebiliyorsa boş. */
export function documentError(file: Pick<File, 'name' | 'type' | 'size'>): string {
  if (!DOCUMENT_TYPES.includes(file.type))
    return `${file.name}: yalnızca PDF, JPG ya da PNG eklenir.`
  if (file.size > MAX_DOCUMENT_BYTES) return `${file.name}: en çok 10 MB olabilir.`
  return ''
}
