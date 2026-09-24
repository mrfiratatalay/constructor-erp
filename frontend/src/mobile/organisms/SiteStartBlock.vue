<script setup lang="ts">
import { computed, watch } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import type { SiteView } from '@/core/api/generated/model'
import { useSiteInviteLink } from '@/core/sites/useSiteInviteLink'

/**
 * Yeni şantiyenin boş akışında patronun tek işi: WhatsApp'tan davet. Kişi WhatsApp'ın rehberinden seçilir,
 * bağlantıyı alan adını yazıp katılır. İlk mesaj gelince düğme kendiliğinden kaybolur.
 */
const { site, empty, canInvite } = defineProps<{ site: SiteView; empty: boolean; canInvite: boolean }>()
const { shareUrl, prepare, renew } = useSiteInviteLink(() => site)
const visible = computed(() => canInvite && empty)

watch(visible, (on) => on && void prepare().catch(() => undefined), { immediate: true })
</script>

<template>
  <van-button v-if="visible" round block plain type="primary" tag="a" :href="shareUrl ?? undefined" target="_blank"
    rel="noopener" :loading="!shareUrl" class="site-start__invite" @click="shareUrl && void renew()">
    <MessageCircle :size="18" class="site-start__icon" />WhatsApp'tan davet et
  </van-button>
</template>

<style scoped>
.site-start__invite {
  margin-top: var(--space-2);
}

.site-start__icon {
  margin-right: var(--space-2);
  vertical-align: -4px;
}
</style>
