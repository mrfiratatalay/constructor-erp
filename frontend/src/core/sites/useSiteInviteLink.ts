import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { useCreateSiteInvite } from '@/core/api/generated/site-invites/site-invites'

/** WhatsApp'ta kişi seçtirerek açılır: dayının rehberi zaten WhatsApp'ın içinde, numara yazılmaz. */
export function siteInviteShareUrl(siteName: string, url: string): string {
  const message = `Merhaba, seni ${siteName} şantiyesine davet ediyorum. Katılmak için bu bağlantıya dokun: ${url}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

/**
 * Şantiye davet bağlantısı (WhatsApp'taki gruba davet bağlantısı). Bağlantı önceden hazırlanır: tarayıcı, bir
 * isteği bekledikten sonra açılan pencereyi engeller; düğme hazır bir bağlantı olunca WhatsApp tek dokunuşla açılır.
 * Bağlantı tek kişiliktir; her açılışta yenisi alınır.
 */
export function useSiteInviteLink(site: MaybeRefOrGetter<{ id: string; name: string }>) {
  const create = useCreateSiteInvite()
  const url = ref<string | null>(null)

  async function fetchLink() {
    url.value = (await create.mutateAsync({ siteId: toValue(site).id })).url
  }

  /** Pencere açılınca: eski bağlantı başka birine gitmiş olabilir; yenisi gelene kadar düğme bekler. */
  function prepare() {
    url.value = null
    return fetchLink()
  }

  const shareUrl = computed(() => (url.value ? siteInviteShareUrl(toValue(site).name, url.value) : null))
  // Gönderdikten sonra: WhatsApp açılırken bağlantı değişmesin diye eskisi, yenisi gelene kadar yerinde kalır.
  return { shareUrl, prepare, renew: fetchLink }
}
