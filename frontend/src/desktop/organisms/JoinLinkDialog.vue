<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Copy, MessageCircle, RotateCcw } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { copyText } from '@/core/team/loginLink'
import { useJoinLink } from '@/core/team/useJoinLink'
import { confirmAction } from '@/desktop/confirmAction'

/**
 * Kişi ekle: firmanın tek bağlantısı (WhatsApp grup bağlantısı gibi). Herkes onu WhatsApp grubuna atar; tıklayan
 * adını ve numarasını yazıp katılır, bütün şantiyeleri görür. Süresi dolmaz; yanlış ellere geçerse patron sıfırlar.
 */
const show = defineModel<boolean>('show', { required: true })
const { url, shareUrl, canReset, reset, isResetting } = useJoinLink(show)

async function copy() {
  if (url.value && (await copyText(url.value))) ElMessage.success('Bağlantı kopyalandı')
  else ElMessage.error('Kopyalanamadı')
}

async function confirmReset() {
  const confirmed = await confirmAction({
    title: 'Bağlantı sıfırlansın mı?',
    message: 'Eski bağlantı çalışmaz; yenisini WhatsApp grubuna yeniden atman gerekir. Katılmış olanlar içeride kalır.',
    confirm: 'Sıfırla',
  })
  if (!confirmed) return
  await reset().then(() => ElMessage.success('Yeni bağlantı hazır'), (error) => ElMessage.error(errorMessage(error)))
}
</script>

<template>
  <el-dialog v-model="show" title="Kişi ekle" width="460px">
    <div class="join-link">
      <p class="join-link__hint">
        Bu bağlantıyı WhatsApp grubunuza atın. Tıklayan adını ve numarasını yazıp katılır, bütün şantiyeleri görür.
      </p>
      <el-input :model-value="url ?? 'Hazırlanıyor…'" readonly />
      <div class="join-link__actions">
        <el-button type="primary" tag="a" :href="shareUrl ?? undefined" target="_blank" rel="noopener"
          :loading="!shareUrl" class="join-link__share">
          <MessageCircle :size="16" class="join-link__icon" />WhatsApp'ta paylaş
        </el-button>
        <el-button :disabled="!url" @click="copy"><Copy :size="16" class="join-link__icon" />Kopyala</el-button>
      </div>
      <el-button v-if="canReset" text size="small" :loading="isResetting" class="join-link__reset"
        @click="confirmReset">
        <RotateCcw :size="14" class="join-link__icon" />Bağlantıyı sıfırla
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.join-link {
  display: grid;
  gap: var(--space-3);
}

.join-link__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.join-link__actions {
  display: flex;
  gap: var(--space-2);
}

.join-link__share {
  text-decoration: none;
}

.join-link__icon {
  margin-right: 6px;
}

.join-link__reset {
  justify-self: start;
  color: var(--text-subtle);
}
</style>
