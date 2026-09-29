<script setup lang="ts">
import { showFailToast, showSuccessToast } from 'vant'
import type { OnboardingLink } from '@/core/api/generated/model'
import { onboardingMailUrl, onboardingWhatsappUrl } from '@/core/admin/onboardingShare'
import { dateTime } from '@/core/format/dates'
import { copyText } from '@/core/team/loginLink'

/** Yeni kurulum bağlantısı telefonda: bir kez gösterilir; kopyala, WhatsApp ya da e-postayla gönder. */
const { link, companyName, email = null } = defineProps<{ link: OnboardingLink | null; companyName: string; email?: string | null }>()
const emit = defineEmits<{ close: [] }>()

async function copy() {
  if (link && (await copyText(link.url))) showSuccessToast('Kopyalandı')
  else showFailToast('Kopyalanamadı')
}
</script>

<template>
  <van-popup :show="!!link" position="bottom" round safe-area-inset-bottom @close="emit('close')">
    <div v-if="link" class="onboarding-link">
      <h3>Kurulum bağlantısı hazır</h3>
      <p>{{ companyName }} için tek kullanımlık bağlantı · {{ dateTime(link.expiresAt) }} tarihine kadar geçerli. Bu pencere
        kapanınca bir daha gösterilmez.</p>
      <van-field :model-value="link.url" readonly type="textarea" autosize class="onboarding-link__url" />
      <van-button block round type="success" tag="a" :href="onboardingWhatsappUrl(companyName, link)" target="_blank">WhatsApp'tan gönder</van-button>
      <van-button block round plain type="primary" tag="a" :href="onboardingMailUrl(companyName, email, link)">E-postayla gönder</van-button>
      <van-button block round @click="copy">Kopyala</van-button>
      <van-button block round plain @click="emit('close')">Kapat</van-button>
    </div>
  </van-popup>
</template>

<style scoped>
.onboarding-link {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
}

.onboarding-link h3 {
  margin: 0;
}

.onboarding-link p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.onboarding-link__url {
  border-radius: var(--radius-md);
  background: var(--surface-muted);
}
</style>
