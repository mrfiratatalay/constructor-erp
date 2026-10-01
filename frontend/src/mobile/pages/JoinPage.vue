<script setup lang="ts">
import LinkFailed from '@/mobile/molecules/LinkFailed.vue'
import { ref, watch } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { useCompanyJoin } from '@/core/auth/useCompanyJoin'
import BrandLogo from '@/shared/atoms/BrandLogo.vue'

/**
 * Firmanın bağlantısını açan kişinin sayfası (WhatsApp grubundaki bağlantıya dokununca): hangi firma çağırıyor,
 * adın ve numaran, Katıl. Katılınca bütün şantiyeleri görür. Bu telefonda zaten içerideyse şantiyelere gider.
 */
const { invite, isLoading, loadError, join, openSites, isJoining } = useCompanyJoin()
const fullName = ref('')
const phone = ref('')

watch(invite, (value) => value?.alreadyInside && void openSites(), { immediate: true })

async function submit() {
  try {
    await join({ fullName: fullName.value.trim(), phone: phone.value.trim() })
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <main class="join-page">
    <BrandLogo />
    <van-loading v-if="isLoading" vertical size="32" />
    <LinkFailed v-else-if="loadError" :message="loadError" />
    <van-form v-else-if="invite && !invite.alreadyInside" class="join-page__form" @submit="submit">
      <header class="join-page__head">
        <p>Şantiye ekibine katıl</p>
        <h1>{{ invite.companyName }}</h1>
      </header>
      <van-cell-group inset>
        <van-field v-model="fullName" label="Adın soyadın" placeholder="Ahmet Yılmaz" maxlength="120"
          :rules="[{ required: true, message: 'Adını yaz' }]" />
        <van-field v-model="phone" label="Telefonun" type="tel" placeholder="0532 123 45 67" maxlength="20"
          :rules="[{ required: true, message: 'Numaranı yaz' }]" />
      </van-cell-group>
      <van-button type="primary" native-type="submit" block round :loading="isJoining">Katıl</van-button>
    </van-form>
  </main>
</template>

<style scoped>
.join-page {
  display: grid;
  justify-items: center;
  gap: var(--space-6);
  max-width: var(--layout-phone-column);
  margin-inline: auto;
  padding: 14vh var(--space-4) var(--space-6);
}

.join-page__form {
  display: grid;
  gap: var(--space-5);
  width: 100%;
}

.join-page__head {
  display: grid;
  gap: var(--space-1);
  text-align: center;
}

.join-page__head p {
  margin: 0;
  color: var(--text-muted);
}

.join-page__head h1 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}
</style>
