<script setup lang="ts">
import { computed } from 'vue'
import type { TodayTotals } from '@/core/api/generated/model'
import { dayTitle } from '@/core/format/dates'
import { greeting } from '@/core/format/greeting'

const { name, company, date, totals } = defineProps<{
  name: string
  company: string
  date: string
  totals: TodayTotals
}>()

const firstName = computed(() => name.split(' ')[0] ?? name)
/** Dikkat isteyenler önce; sıfırsa sakin kalır, değilse anlam rengiyle işaretlenir. */
const tiles = computed(() => [
  { label: 'Açık sorun', value: totals.openIssues, tone: totals.openIssues > 0 ? 'danger' : 'calm' },
  { label: 'Haber gelmeyen', value: totals.sitesWithoutNews, tone: totals.sitesWithoutNews > 0 ? 'warning' : 'calm' },
  { label: 'Bugün gönderi', value: totals.postsToday, tone: 'calm' },
  { label: 'Bugün fotoğraf', value: totals.photosToday, tone: 'calm' },
])
</script>

<template>
  <section class="today-hero blueprint">
    <div class="today-hero__intro">
      <p class="today-hero__eyebrow">{{ dayTitle(date) }} · {{ company }}</p>
      <h1 class="today-hero__title">{{ greeting() }}, {{ firstName }}</h1>
      <p class="today-hero__sub">{{ totals.activeSites }} aktif şantiyenin bugünü</p>
    </div>
    <dl class="today-hero__tiles">
      <div v-for="tile in tiles" :key="tile.label" class="today-hero__tile">
        <dt>
          <span class="today-hero__dot" :class="`today-hero__dot--${tile.tone}`" />
          {{ tile.label }}
        </dt>
        <dd>{{ tile.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.today-hero {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  color: var(--brand-on-deep);
  box-shadow: var(--shadow-md);
}

.today-hero__eyebrow {
  margin: 0;
  color: rgb(255 255 255 / 0.65);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.today-hero__title {
  margin: 2px 0 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.today-hero__sub {
  margin: 4px 0 0;
  color: rgb(255 255 255 / 0.75);
  font-size: var(--text-base);
}

.today-hero__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
  gap: var(--space-3);
  margin: 0;
}

.today-hero__tile {
  padding: var(--space-3) var(--space-4);
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: var(--radius-md);
  background: rgb(255 255 255 / 0.08);
}

.today-hero__tile dt {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgb(255 255 255 / 0.75);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}

.today-hero__tile dd {
  margin: 2px 0 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
  font-variant-numeric: tabular-nums;
}

.today-hero__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.35);
}

.today-hero__dot--danger {
  background: #f87171;
  box-shadow: 0 0 0 3px rgb(248 113 113 / 0.25);
}

.today-hero__dot--warning {
  background: var(--brand-signature);
  box-shadow: 0 0 0 3px rgb(250 204 21 / 0.25);
}

/*
 * Telefonda ilk ekran özet olmalı: kutucuklar sıkışır ve altındaki şantiye listesi
 * kaydırmadan görünmeye başlar. Bilgisayarda yer bol olduğu için ferah hali kalır.
 */
@media (max-width: 639px) {
  .today-hero {
    gap: var(--space-4);
    padding: var(--space-5);
  }

  .today-hero__title {
    font-size: var(--text-xl);
  }

  .today-hero__tiles {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }

  .today-hero__tile {
    padding: var(--space-2) var(--space-3);
  }

  .today-hero__tile dd {
    font-size: var(--text-lg);
  }
}
</style>
