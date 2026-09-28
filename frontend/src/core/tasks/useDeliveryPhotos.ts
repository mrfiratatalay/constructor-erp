import { computed, ref } from 'vue'
import { kindOf, releaseAttachment, toAttachment, type Attachment } from '@/core/posts/attachments'
import { compressPhoto } from '@/core/posts/photoCompression'

/** Bir teslimde en çok bu kadar fotoğraf olur (sunucu da aynı sınırı uygular). */
export const MAX_DELIVERY_PHOTOS = 4

/** Fotoğraf eklenemiyorsa nedeni (fotoğraf değil ya da sınır doldu), eklenebiliyorsa null. */
function problemOf(file: File, count: number): string | null {
  if (kindOf(file) !== 'PHOTO') return `${file.name}: teslimde yalnızca fotoğraf olur.`
  if (count >= MAX_DELIVERY_PHOTOS) return `En fazla ${MAX_DELIVERY_PHOTOS} fotoğraf eklenir.`
  return null
}

/**
 * Teslimin fotoğrafları: yalnızca fotoğraf, en çok dört. Seçilince küçültülür (sohbetteki fotoğraflar gibi;
 * şantiyede internet zayıf) ve önizlemesi gösterilir; çıkarılan fotoğrafın belleği boşaltılır.
 */
export function useDeliveryPhotos() {
  const photos = ref<Attachment[]>([])
  const isPreparing = ref(false)

  /** Eklenemeyenlerin nedenleri döner. */
  async function add(files: File[]): Promise<string[]> {
    const problems: string[] = []
    isPreparing.value = true
    for (const file of files) {
      const problem = problemOf(file, photos.value.length)
      if (problem) problems.push(problem)
      else photos.value.push(toAttachment(await compressPhoto(file), 'PHOTO'))
    }
    isPreparing.value = false
    return [...new Set(problems)]
  }

  function remove(photoId: string) {
    photos.value.filter((photo) => photo.id === photoId).forEach(releaseAttachment)
    photos.value = photos.value.filter((photo) => photo.id !== photoId)
  }

  function clear() {
    photos.value.forEach(releaseAttachment)
    photos.value = []
  }

  const files = computed(() => photos.value.map((photo) => photo.file))
  return { photos, isPreparing, add, remove, clear, files }
}
