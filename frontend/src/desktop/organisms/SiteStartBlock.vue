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
  <el-button v-if="visible" type="primary" plain tag="a" :href="shareUrl ?? undefined" target="_blank"
    rel="noopener" :loading="!shareUrl" class="site-start__invite" @click="shareUrl && void renew()">
    <MessageCircle :size="16" class="site-start__icon" />WhatsApp'tan davet et
  </el-button>
</template>

<style scoped>
.site-start__invite {
  justify-self: center;
  text-decoration: none;
}

.site-start__icon {
  margin-right: var(--space-2);
}
</style>
