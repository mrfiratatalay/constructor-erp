<script setup lang="ts">
/** Hiçbir şantiye seçili değilken sağ taraf, WhatsApp Masaüstü'ndeki gibi sade bir karşılama. */
const { companyName } = defineProps<{ companyName?: string }>()
</script>

<template>
  <section class="welcome">
    <span class="welcome__badge" aria-hidden="true">KŞ</span>
    <h2>Kızılkan Şantiye</h2>
    <p>{{ companyName ? `${companyName} şantiyeleri tek yerde.` : 'Şantiyeler tek yerde.' }} Soldan bir şantiye seç.</p>
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

.welcome__badge {
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  border-radius: 26px;
  background: var(--brand-deep);
  color: var(--brand-signature);
  font-size: 32px;
  font-weight: var(--weight-black);
}

.welcome h2 {
  margin: 0;
  color: var(--text-primary, inherit);
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}

.welcome p {
  margin: 0;
  font-size: var(--text-sm);
}
</style>
