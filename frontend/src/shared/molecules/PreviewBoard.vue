<script setup lang="ts">
/** Ürün önizlemesinin içi: bir şantiyenin günü (sayılar, saha akışı, ilerleme). Örnek veridir, sunucuya bağlı değil. */
const STATS = [
  { label: 'Bugün sahada', value: '38 / 42' },
  { label: 'Açık sorun', value: '2' },
  { label: 'İlerleme', value: '%64' },
]
const ENTRIES = [
  { time: '08:12', tone: 'done', text: '5. kat kalıpları söküldü', by: 'Ahmet · Şef' },
  { time: '10:40', tone: 'delivery', text: 'İnşaat demiri 12 ton geldi · SV-000214', by: 'Depo' },
  { time: '14:05', tone: 'issue', text: 'Vinç bakımı yarın 08:00, beton saati kaydı', by: 'Mehmet · Şef' },
]
const PROGRESS = [
  { label: 'Kaba inşaat', percent: 82 },
  { label: 'Tesisat', percent: 41 },
  { label: 'İnce işler', percent: 12 },
]
</script>

<template>
  <div class="board">
    <header><strong>Ataşehir Rezidans</strong><small>B Blok · 6. kat</small></header>
    <div class="board__stats">
      <div v-for="stat in STATS" :key="stat.label"><small>{{ stat.label }}</small><b>{{ stat.value }}</b></div>
    </div>
    <div class="board__cols">
      <ul class="board__entries">
        <li v-for="entry in ENTRIES" :key="entry.time">
          <time>{{ entry.time }}</time><i :class="`tone-${entry.tone}`" />
          <span>{{ entry.text }}<small>{{ entry.by }}</small></span>
        </li>
      </ul>
      <ul class="board__progress">
        <li v-for="row in PROGRESS" :key="row.label">
          <span>{{ row.label }}<b>%{{ row.percent }}</b></span>
          <i><i :style="{ width: `${row.percent}%` }" /></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: grid;
  align-content: start;
  gap: var(--space-3);
  padding: var(--space-4);
}

.board > header {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-size: var(--text-base);
}

.board > header small,
.board__stats small,
.board__entries small,
.board__entries time {
  color: var(--text-subtle);
  font-size: 11px;
}

.board__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

.board__stats div,
.board__entries,
.board__progress {
  margin: 0;
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  list-style: none;
}

.board__stats b {
  display: block;
  margin-top: 2px;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.board__cols {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-2);
}

.board__entries li {
  display: grid;
  grid-template-columns: 36px 10px 1fr;
  gap: var(--space-2);
  align-items: start;
  padding: 6px 0;
}

.board__entries i {
  width: 10px;
  height: 10px;
  margin-top: 3px;
  border-radius: 50%;
}

.tone-done { background: var(--field-done); }
.tone-delivery { background: var(--field-delivery); }
.tone-issue { background: var(--field-issue); }

.board__entries small {
  display: block;
}

.board__progress li + li {
  margin-top: var(--space-3);
}

.board__progress span {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.board__progress > li > i {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: var(--brand-tint);
}

.board__progress > li > i > i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--brand-primary);
}

@media (width < 720px) {
  .board__cols { grid-template-columns: 1fr; }
}
</style>
