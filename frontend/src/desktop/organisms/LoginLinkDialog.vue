<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { dateTime } from '@/core/format/dates'
import { copyText, whatsappShareUrl, type IssuedLink } from '@/core/team/loginLink'
import { useWorkspace } from '@/core/tenant/useWorkspace'

const { issued } = defineProps<{ issued: IssuedLink | null }>()
const emit = defineEmits<{ close: [] }>()

const { workspace } = useWorkspace()
const shareUrl = computed(() =>
  issued ? whatsappShareUrl(issued.member, issued.link.url, workspace.value?.name) : '',
)

async function copy() {
  if (!issued) return
  if (await copyText(issued.link.url)) ElMessage.success('Link kopyalandı')
  else ElMessage.error('Kopyalanamadı, linki seçip elle kopyala')
}
</script>

<template>
  <el-dialog :model-value="issued !== null" :title="issued ? `${issued.member.fullName} için giriş linki` : ''"
    width="520px" @close="emit('close')">
    <template v-if="issued">
      <el-input :model-value="issued.link.url" readonly />
      <p class="link-dialog__note">
        Tek kullanımlık, {{ dateTime(issued.link.expiresAt) }} tarihine kadar geçerli.
        Linki açan kişi aylarca oturumu açık kalır.
      </p>
    </template>
    <template #footer>
      <el-button @click="copy">Linki kopyala</el-button>
      <el-button type="primary" tag="a" :href="shareUrl" target="_blank" rel="noopener">WhatsApp'ta gönder</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.link-dialog__note {
  margin: var(--space-3) 0 0;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
