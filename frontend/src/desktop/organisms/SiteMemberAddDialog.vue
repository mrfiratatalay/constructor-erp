<script setup lang="ts">
import { watch } from 'vue'
import { ElMessage } from 'element-plus'
import { MessageCircle } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { useSiteInviteLink } from '@/core/sites/useSiteInviteLink'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Katılımcı ekle, WhatsApp'taki gibi: yeni biri için davet bağlantısı (kişi WhatsApp'ın kendi rehberinden seçilir,
 * adını ve numarasını kendisi yazar; patron numara yazmaz). Firmada zaten olan biri listeden tek tıkla eklenir.
 */
const show = defineModel<boolean>('show', { required: true })
const { site, members, saving } = defineProps<{ site: SiteView; members: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ add: [memberId: string] }>()
const { shareUrl, prepare } = useSiteInviteLink(() => site)

watch(show, (open) => open && void prepare().catch((error) => ElMessage.error(errorMessage(error))))
</script>

<template>
  <el-dialog v-model="show" title="Katılımcı ekle" width="440px">
    <div class="member-add">
      <el-button type="primary" size="large" tag="a" :href="shareUrl ?? undefined" target="_blank" rel="noopener"
        :loading="!shareUrl" class="member-add__invite" @click="shareUrl && (show = false)">
        <MessageCircle :size="18" class="member-add__icon" />WhatsApp'tan davet et
      </el-button>
      <p class="member-add__hint">Yeni biri için. Bağlantıyı alan kişi adını ve numarasını kendisi yazıp katılır.</p>
      <template v-if="members.length">
        <h3 class="member-add__title">Firmadan ekle</h3>
        <button v-for="member in members" :key="member.id" type="button" class="member-add__row" :disabled="saving"
          @click="emit('add', member.id)">
          <UserAvatar :name="member.fullName" :size="36" />
          <span>{{ member.fullName }}</span>
          <small>Ekle</small>
        </button>
      </template>
    </div>
  </el-dialog>
</template>

<style scoped>
.member-add {
  display: grid;
  gap: var(--space-2);
}

.member-add__invite {
  text-decoration: none;
}

.member-add__icon {
  margin-right: var(--space-2);
}

.member-add__hint {
  margin: 0 0 var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.member-add__title {
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-soft);
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.member-add__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2);
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.member-add__row:hover {
  background: var(--surface-muted);
}

.member-add__row span {
  flex: 1;
  font-weight: var(--weight-semibold);
}

.member-add__row small {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}
</style>
