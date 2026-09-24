import { computed, type MaybeRefOrGetter } from 'vue'
import { useListSiteLibrary } from '@/core/api/generated/library/library'
import type { MediaView } from '@/core/api/generated/model'
import { monthTitle } from '@/core/format/dates'

export interface LibraryMonth {
  key: string
  title: string
  items: MediaView[]
}

/** Galeri aylara ayrılır, en yeni ay üstte (WhatsApp'taki "Medya" sekmesi gibi). */
function byMonth(items: MediaView[]): LibraryMonth[] {
  const months: LibraryMonth[] = []
  for (const item of items) {
    const key = item.createdAt.slice(0, 7)
    const last = months.at(-1)
    if (last?.key === key) last.items.push(item)
    else months.push({ key, title: monthTitle(item.createdAt), items: [item] })
  }
  return months
}

/**
 * "Medya ve belgeler": şantiyenin bütün geçmişindeki fotoğraf, video ve belgeler. Bilgi ekranında sayısı ve
 * son fotoğrafların şeridi; dokununca aylara ayrılmış ızgara (Medya) ve liste (Belgeler).
 */
export function useSiteLibrary(siteId: MaybeRefOrGetter<string>) {
  const query = useListSiteLibrary(siteId)
  const all = computed(() => query.data.value ?? [])
  const media = computed(() => all.value.filter((item) => item.kind !== 'DOCUMENT'))
  const documents = computed(() => all.value.filter((item) => item.kind === 'DOCUMENT'))

  return {
    count: computed(() => all.value.length),
    strip: computed(() => media.value.slice(0, 6)),
    mediaMonths: computed(() => byMonth(media.value)),
    documentMonths: computed(() => byMonth(documents.value)),
    /** Fotoğraf görüntüleyicisine giden adresler, ızgaradaki sırayla. */
    photoUrls: computed(() => media.value.filter((item) => item.kind === 'PHOTO').map((item) => item.url ?? '')),
    isLoading: query.isPending,
  }
}
