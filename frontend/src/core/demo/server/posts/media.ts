import type { MediaViewKind } from '@/core/api/generated/model'
import { PHOTOS, type PhotoName } from '@/core/demo/media/demoPhotos'
import { newId } from '@/core/demo/server/demoIds'
import type { MediaRecord } from './postRecords'

// Demo görsellerinin yaklaşık boyutu; ekrandaki "1,2 MB" gibi yazılar gerçekçi kalsın.
const PHOTO_BYTES = 240_000
// Bu boyuta kadar fotoğraf veri adresi (data:) olarak saklanır ve sayfa yenilense de görünür. Video ya da büyük
// dosya yalnızca açık sekmede yaşar: tarayıcı deposu birkaç megabaytla sınırlı.
const INLINE_LIMIT = 1_500_000

export function photoMedia(name: PhotoName, createdAt: string, id: string = newId()): MediaRecord {
  const photo = PHOTOS[name]
  return {
    id,
    kind: 'PHOTO',
    url: photo.url,
    thumbnailUrl: photo.thumbnailUrl,
    fileName: `${name}.jpg`,
    sizeBytes: PHOTO_BYTES,
    durationSeconds: null,
    createdAt,
  }
}

function kindOf(file: File): MediaViewKind {
  if (file.type.startsWith('image/')) return 'PHOTO'
  if (file.type.startsWith('video/')) return 'VIDEO'
  return file.type.startsWith('audio/') ? 'AUDIO' : 'DOCUMENT'
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Dosya okunamadı'))
    reader.readAsDataURL(file)
  })
}

async function urlOf(file: File, kind: MediaViewKind): Promise<string> {
  return kind === 'PHOTO' && file.size <= INLINE_LIMIT ? readAsDataUrl(file) : URL.createObjectURL(file)
}

/** Yüklenen dosyalar: gerçek backend'deki dönüşüm yok, dosya tarayıcıda olduğu gibi gösterilir. */
export function uploadedMedia(files: File[], createdAt: string): Promise<MediaRecord[]> {
  return Promise.all(
    files.map(async (file): Promise<MediaRecord> => {
      const kind = kindOf(file)
      const url = await urlOf(file, kind)
      const thumbnailUrl = kind === 'PHOTO' ? url : null
      return { id: newId(), kind, url, thumbnailUrl, fileName: file.name, sizeBytes: file.size, durationSeconds: null, createdAt }
    }),
  )
}
