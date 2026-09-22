<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showSuccessToast, type UploaderBeforeRead } from 'vant'
import { LIMITS } from '@/core/posts/attachments'
import { useComposer } from '@/core/posts/useComposer'
import { useSites } from '@/core/sites/useSites'
import VoiceNoteField from '@/mobile/molecules/VoiceNoteField.vue'

const route = useRoute()
const router = useRouter()
const { sites } = useSites()
const composer = useComposer()
const { siteId, body, issue, attachments, isPreparing, canSend } = composer
const pickerOpen = ref(false)

const selectedName = computed(() => sites.value?.find((site) => site.id === siteId.value)?.name ?? '')
const siteActions = computed(() => (sites.value ?? []).map((site) => ({ name: site.name, id: site.id })))
/** Uploader'ın önizlemesi bizim listemizden beslenir; ekleme/çıkarma kararını composer verir. */
const previews = computed(() =>
  attachments.value.map((item) => ({ url: item.previewUrl, isImage: item.kind === 'PHOTO' })),
)
const preferredSite = () => (typeof route.query.site === 'string' ? route.query.site : null)

onMounted(() => sites.value && composer.preselect(sites.value, preferredSite()))
watch(sites, (list) => list && !siteId.value && composer.preselect(list, preferredSite()))

async function addFiles(files: File[]) {
  const problems = await composer.addFiles(files)
  if (problems.length) showFailToast(problems.join('\n'))
}

/** Vant seçilen dosyayı kendi listesine eklemesin diye false döner: tek doğru liste composer'da. */
const beforeRead: UploaderBeforeRead = (file) => {
  void addFiles(Array.isArray(file) ? file : [file])
  return false
}

async function send() {
  const target = siteId.value
  await composer.submit(sites.value ?? [])
  showSuccessToast('Gönderi sıraya alındı')
  await router.replace({ name: 'siteFeed', params: { siteId: target } })
}
</script>

<template>
  <div class="compose">
    <van-cell-group inset>
      <van-cell title="Şantiye" :value="selectedName || 'Şantiye seç'" is-link center size="large"
        @click="pickerOpen = true" />
    </van-cell-group>

    <van-cell-group inset title="Fotoğraf, video ve sesli not">
      <!-- Geniş içerik hücrenin başlık alanına konur: değer alanı sağa yaslıdır. -->
      <van-cell>
        <template #title>
          <van-uploader :model-value="previews" :before-read="beforeRead" :max-count="LIMITS.attachments" multiple
            accept="image/*,video/*" upload-text="Ekle" @delete="(_: unknown, detail: { index: number }) =>
              composer.remove(attachments[detail.index]!.id)" />
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <VoiceNoteField @recorded="addFiles([$event])" @failed="showFailToast($event)" />
        </template>
      </van-cell>
      <van-cell v-if="isPreparing" center>
        <van-loading size="18">Fotoğraflar hazırlanıyor…</van-loading>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset title="Not">
      <van-field v-model="body" type="textarea" rows="3" autosize maxlength="4000" show-word-limit
        placeholder="Ne yapıldı, ne eksik? (isteğe bağlı)" />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell center title="Bu bir sorun" label="Patron hemen görür; çözülene kadar açık kalır.">
        <template #right-icon><van-switch v-model="issue" /></template>
      </van-cell>
    </van-cell-group>

    <!-- Gönder düğmesi ekranın altında sabit: uzun formda bile elin altında. -->
    <div class="compose__send">
      <van-button type="primary" block round size="large" :disabled="!canSend || isPreparing" @click="send">
        Gönder{{ attachments.length ? ` · ${attachments.length} dosya` : '' }}
      </van-button>
    </div>

    <van-action-sheet v-model:show="pickerOpen" title="Hangi şantiye?" :actions="siteActions" cancel-text="Vazgeç"
      @select="(action: { id: string }) => ((siteId = action.id), (pickerOpen = false))" />
  </div>
</template>

<style scoped>
.compose {
  display: grid;
  gap: var(--space-4);
}

.compose__send {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 11;
  padding: var(--space-3) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--border-soft);
  background: rgb(255 255 255 / 0.94);
  backdrop-filter: blur(10px);
}
</style>
