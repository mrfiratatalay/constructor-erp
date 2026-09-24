<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { dateTime } from '@/core/format/dates'
import { copyText, whatsappShareUrl } from '@/core/team/loginLink'
import type { IssuedLink } from '@/core/team/useTeam'

const { issued } = defineProps<{ issued: IssuedLink | null }>()
const emit = defineEmits<{ close: [] }>()

const shareUrl = computed(() => (issued ? whatsappShareUrl(issued.member, issued.link.url) : ''))

async function copy() {
  if (!issued) return
  if (await copyText(issued.link.url)) showSuccessToast('Link kopyalandı')
  else showFailToast('Kopyalanamadı, linki basılı tutup kopyala')
}
</script>

<template>
  <van-popup :show="issued !== null" position="bottom" round closeable @close="emit('close')">
    <section v-if="issued" class="link-sheet">
      <h2 class="link-sheet__title">{{ issued.member.fullName }} için giriş linki hazır</h2>
      <p class="link-sheet__url">{{ issued.link.url }}</p>
      <p class="link-sheet__note">
        Tek kullanımlık, {{ dateTime(issued.link.expiresAt) }} tarihine kadar geçerli.
      </p>
      <van-button type="primary" block round tag="a" :href="shareUrl" target="_blank" rel="noopener">
        WhatsApp'ta gönder
      </van-button>
      <van-button block round @click="copy">Linki kopyala</van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.link-sheet {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.link-sheet__title {
  margin: 0;
  font-size: 18px;
}

.link-sheet__url {
  margin: 0;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--surface-muted);
  font-family: ui-monospace, Menlo, monospace;
  font-size: 13px;
  word-break: break-all;
  user-select: all;
}

.link-sheet__note {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
