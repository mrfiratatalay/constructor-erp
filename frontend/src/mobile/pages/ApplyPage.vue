<script setup lang="ts">
import { CONTACT } from '@/core/marketing/marketingCopy'
import SalesRequestForm from '@/mobile/organisms/SalesRequestForm.vue'
import MarketingLayout from '@/mobile/templates/MarketingLayout.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
</script>

<template>
  <MarketingLayout>
    <section class="apply">
      <SectionHeading eyebrow="Başvuru" title="Firmanızı birlikte kuralım"
        lead="Formu doldurun; sizi arayıp ihtiyacınızı dinleyelim, uygun paketi birlikte seçelim." />
      <SalesRequestForm />
      <van-cell-group v-if="CONTACT.phone || CONTACT.email" inset title="Hemen konuşmak isterseniz" class="apply__contact">
        <van-cell v-if="CONTACT.phone" icon="phone-o" :title="CONTACT.phone" is-link :url="CONTACT.phoneHref" />
        <van-cell v-if="CONTACT.email" icon="envelop-o" :title="CONTACT.email" is-link :url="`mailto:${CONTACT.email}`" />
      </van-cell-group>
    </section>
  </MarketingLayout>
</template>

<style scoped>
.apply {
  padding: var(--space-8) var(--space-4) var(--space-10);
  background: var(--canvas);
}

.apply__contact {
  margin-top: var(--space-6);
}
</style>
