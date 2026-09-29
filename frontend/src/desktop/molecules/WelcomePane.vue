<script setup lang="ts">
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/**
 * Hiçbir şantiye seçili değilken sağ taraf, WhatsApp Masaüstü'ndeki gibi sade bir karşılama: firmanın kendi logosu ve
 * adı. Ürün (Constructor ERP) yalnızca alt satırda imza gibi durur.
 */
const { companyName = '', logoUrl = null } = defineProps<{ companyName?: string; logoUrl?: string | null }>()
</script>

<template>
  <section class="welcome">
    <CompanyLogo :name="companyName" :logo-url="logoUrl" :size="88" />
    <h2>{{ companyName }}</h2>
    <p>Şantiyeleriniz tek yerde. Soldan bir şantiye seçin.</p>
    <small>Constructor ERP</small>
  </section>
</template>

<style scoped>
.welcome {
  display: grid;
  flex: 1;
  place-content: center;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-8);
  border-bottom: 6px solid var(--brand-signature);
  color: var(--text-muted);
  text-align: center;
}

.welcome h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}

.welcome p {
  margin: 0;
  font-size: var(--text-sm);
}

.welcome small {
  color: var(--text-subtle);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
</style>
