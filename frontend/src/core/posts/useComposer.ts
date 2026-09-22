import { computed, ref } from 'vue'
import type { SiteView } from '@/core/api/generated/model'
import { chooseInitialSite } from '@/core/posts/initialSite'
import { rememberLastSite } from '@/core/posts/lastSite'
import { newId } from '@/core/posts/newId'
import { useAttachments } from '@/core/posts/useAttachments'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

/** Gönderi hazırlama: şantiye, yazı, "sorun" işareti ve ekler. Gönderince kuyruğa girer, form temizlenir. */
export function useComposer() {
  const queue = useUploadQueue()
  const files = useAttachments()
  const siteId = ref<string | null>(null)
  const body = ref('')
  const issue = ref(false)

  const canSend = computed(() => !!siteId.value && (body.value.trim() !== '' || files.attachments.value.length > 0))

  function preselect(sites: SiteView[], preferred: string | null) {
    siteId.value = chooseInitialSite(sites, preferred)
  }

  async function submit(sites: SiteView[]) {
    const site = sites.find((candidate) => candidate.id === siteId.value)
    if (!site || !canSend.value) return
    await queue.enqueue({
      id: newId(),
      siteId: site.id,
      siteName: site.name,
      body: body.value.trim() || null,
      issue: issue.value,
      files: files.attachments.value.map((item) => item.file),
      queuedAt: new Date().toISOString(),
    })
    rememberLastSite(site.id)
    files.clear()
    body.value = ''
    issue.value = false
  }

  return { siteId, body, issue, canSend, preselect, submit, ...files }
}
