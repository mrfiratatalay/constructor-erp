<script setup lang="ts">
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { Copy, MessageCircle } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { copyText } from '@/core/team/loginLink'
import { useJoinLink } from '@/core/team/useJoinLink'

/**
 * Kişi ekle: firmanın tek bağlantısı (WhatsApp grup bağlantısı gibi). Herkes onu WhatsApp grubuna atar; tıklayan
 * adını ve numarasını yazıp katılır, bütün şantiyeleri görür. Süresi dolmaz; yanlış ellere geçerse patron sıfırlar.
 */
const show = defineModel<boolean>('show', { required: true })
const { url, shareUrl, canReset, reset, isResetting } = useJoinLink(show)

async function copy() {
  if (url.value && (await copyText(url.value))) showSuccessToast('Bağlantı kopyalandı')
  else showFailToast('Kopyalanamadı')
}

async function confirmReset() {
  const confirmed = await showConfirmDialog({
    title: 'Bağlantı sıfırlansın mı?',
    message: 'Eski bağlantı çalışmaz; yenisini WhatsApp grubuna yeniden atman gerekir. Katılmış olanlar içeride kalır.',
    confirmButtonText: 'Sıfırla',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (!confirmed) return
  await reset().then(() => showSuccessToast('Yeni bağlantı hazır'), (error) => showFailToast(errorMessage(error)))
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <section class="join-link">
      <h2 class="join-link__title">Kişi ekle</h2>
      <p class="join-link__hint">
        Bu bağlantıyı WhatsApp grubunuza atın. Tıklayan adını ve numarasını yazıp katılır, bütün şantiyeleri görür.
      </p>
      <p class="join-link__url">{{ url ?? 'Hazırlanıyor…' }}</p>
      <van-button type="primary" block round tag="a" :href="shareUrl ?? undefined" target="_blank" rel="noopener"
        :loading="!shareUrl">
        <span class="join-link__label"><MessageCircle :size="18" />WhatsApp'ta paylaş</span>
      </van-button>
      <van-button block round plain :disabled="!url" @click="copy">
        <span class="join-link__label"><Copy :size="18" />Kopyala</span>
      </van-button>
      <van-button v-if="canReset" block size="small" :loading="isResetting" class="join-link__reset"
        @click="confirmReset">
        Bağlantıyı sıfırla
      </van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.join-link {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
}

.join-link__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: 18px;
}

.join-link__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
}

/* Bağlantı okunur dursun: kopyalanamazsa elle seçilebilir. */
.join-link__url {
  margin: 0;
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  font-size: var(--text-sm);
  overflow-wrap: anywhere;
  user-select: all;
}

.join-link__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.join-link__reset {
  border: 0;
  color: var(--text-subtle);
}
</style>
