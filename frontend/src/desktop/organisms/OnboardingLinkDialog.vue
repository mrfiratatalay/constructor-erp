<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Copy, Mail, MessageCircle } from 'lucide-vue-next'
import type { OnboardingLink } from '@/core/api/generated/model'
import { onboardingMailUrl, onboardingWhatsappUrl } from '@/core/admin/onboardingShare'
import { dateTime } from '@/core/format/dates'
import { copyText } from '@/core/team/loginLink'

/**
 * Yeni kurulum linki: yalnızca şimdi görünür (sunucuda açık hâli yoktur). Ekip onu kopyalar, WhatsApp'tan ya da
 * e-postayla müşteriye gönderir. Kaybolursa firmanın sayfasından yenisi üretilir, eskisi iptal olur.
 */
const { link, companyName, email = null } = defineProps<{
  link: OnboardingLink | null
  companyName: string
  email?: string | null
}>()
const emit = defineEmits<{ close: [] }>()

async function copy() {
  if (link && (await copyText(link.url))) ElMessage.success('Bağlantı kopyalandı.')
  else ElMessage.warning('Kopyalanamadı; bağlantıyı elle seçip kopyalayın.')
}
</script>

<template>
  <el-dialog :model-value="!!link" title="Kurulum bağlantısı hazır" width="560px" @close="emit('close')">
    <template v-if="link">
      <el-alert type="success" :closable="false" show-icon
        :title="`${companyName} için tek kullanımlık kurulum bağlantısı üretildi.`"
        :description="`${dateTime(link.expiresAt)} tarihine kadar geçerli. Bu pencere kapanınca bağlantı bir daha gösterilmez.`" />
      <el-input :model-value="link.url" readonly class="onboarding-link__url">
        <template #append><el-button @click="copy"><Copy :size="16" /></el-button></template>
      </el-input>
      <div class="onboarding-link__share">
        <el-button tag="a" :href="onboardingWhatsappUrl(companyName, link)" target="_blank" type="success" plain>
          <MessageCircle :size="16" /> WhatsApp'tan gönder
        </el-button>
        <el-button tag="a" :href="onboardingMailUrl(companyName, email, link)" plain>
          <Mail :size="16" /> E-postayla gönder
        </el-button>
      </div>
    </template>
    <template #footer><el-button type="primary" @click="emit('close')">Tamam</el-button></template>
  </el-dialog>
</template>

<style scoped>
.onboarding-link__url {
  margin: var(--space-4) 0;
}

.onboarding-link__share {
  display: flex;
  gap: var(--space-2);
}

.onboarding-link__share svg {
  margin-right: var(--space-1);
}
</style>
