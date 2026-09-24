<script setup lang="ts">
import { watch } from 'vue'
import { showFailToast } from 'vant'
import { MessageCircle } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { useSiteInviteLink } from '@/core/sites/useSiteInviteLink'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Katılımcı ekle, WhatsApp'taki gibi: yeni biri için davet bağlantısı (kişi WhatsApp'ın kendi rehberinden seçilir,
 * adını ve numarasını kendisi yazar; patron numara yazmaz). Firmada zaten olan biri listeden tek dokunuşla eklenir.
 */
const show = defineModel<boolean>('show', { required: true })
const { site, members, saving } = defineProps<{ site: SiteView; members: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ add: [memberId: string] }>()
const { shareUrl, prepare } = useSiteInviteLink(() => site)

watch(show, (open) => open && void prepare().catch((error) => showFailToast(errorMessage(error))))
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <section class="member-add">
      <h2 class="member-add__title">Katılımcı ekle</h2>
      <van-button type="primary" round block tag="a" :href="shareUrl ?? undefined" target="_blank" rel="noopener"
        :loading="!shareUrl" @click="shareUrl && (show = false)">
        <MessageCircle :size="18" class="member-add__icon" />WhatsApp'tan davet et
      </van-button>
      <p class="member-add__hint">Yeni biri için. Bağlantıyı alan kişi adını ve numarasını kendisi yazıp katılır.</p>
      <van-cell-group v-if="members.length" inset title="Firmadan ekle" class="member-add__people">
        <van-cell v-for="member in members" :key="member.id" :title="member.fullName" center clickable
          :disabled="saving" @click="emit('add', member.id)">
          <template #icon><UserAvatar :name="member.fullName" :size="36" class="member-add__avatar" /></template>
          <template #value><span class="member-add__action">Ekle</span></template>
        </van-cell>
      </van-cell-group>
    </section>
  </van-popup>
</template>

<style scoped>
.member-add {
  display: grid;
  gap: var(--space-3);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.member-add__title {
  margin: 0;
  font-size: 18px;
}

.member-add__icon {
  margin-right: var(--space-2);
  vertical-align: -4px;
}

.member-add__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.member-add__people {
  --van-cell-background: var(--surface-muted);

  margin: 0;
}

.member-add__avatar {
  margin-right: var(--space-3);
}

.member-add__action {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}
</style>
