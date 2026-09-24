<script setup lang="ts">
import { formatPhone } from '@/core/format/phone'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Kişi bilgisinin üstü, WhatsApp'taki gibi ortada: büyük yuvarlak, ad, numara, altında durum
 * ("son görülme …"). İki kabuk da bunu kullanır; düğmeler kabuğun kendi kütüphanesiyle altında durur.
 */
const { fullName, phone = null, status } = defineProps<{ fullName: string; phone?: string | null; status: string }>()
</script>

<template>
  <header class="contact-hero">
    <UserAvatar :name="fullName" :size="96" />
    <h2 class="contact-hero__name">{{ fullName }}</h2>
    <p v-if="phone" class="contact-hero__phone">{{ formatPhone(phone) }}</p>
    <p class="contact-hero__status">{{ status }}</p>
  </header>
</template>

<style scoped>
.contact-hero {
  display: grid;
  justify-items: center;
  gap: 2px;
  text-align: center;
}

.contact-hero__name {
  margin: var(--space-3) 0 0;
  color: var(--text-strong);
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.01em;
}

.contact-hero__phone {
  margin: 0;
  color: var(--text-strong);
  font-size: var(--text-md);
}

.contact-hero__status {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
