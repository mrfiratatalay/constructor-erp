<script setup lang="ts">
import { CalendarDays, FileSpreadsheet } from 'lucide-vue-next'
import { PREVIEW_ATTENDANCE } from '@/core/marketing/productPreview'
</script>

<template>
  <div class="preview-attendance">
    <header><span>Park Konutları · Günlük yoklama</span><CalendarDays :size="17" aria-hidden="true" /></header>
    <h3>Bugün ekip sahada mı?</h3>
    <p class="preview-attendance__lead">Yoklama kaydı, aylık puantajın temelidir.</p>
    <ul>
      <li v-for="person in PREVIEW_ATTENDANCE" :key="person.name">
        <span class="preview-attendance__avatar">{{ person.initials }}</span>
        <div><strong>{{ person.name }}</strong><small>{{ person.trade }}</small></div>
        <span class="preview-attendance__status" :class="`preview-attendance__status--${person.tone}`">{{ person.status }}</span>
      </li>
    </ul>
    <div class="preview-attendance__export"><FileSpreadsheet :size="19" aria-hidden="true" /><div><strong>Aylık puantaj</strong><span>Günlük kayıtlardan Excel dökümü</span></div></div>
  </div>
</template>

<style scoped>
.preview-attendance header { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 10px; color: var(--text-muted); }
.preview-attendance h3 { margin: 18px 0 5px; font-size: 18px; }
.preview-attendance__lead { margin: 0; color: var(--text-muted); font-size: 11px; }
.preview-attendance ul { display: grid; margin: 18px 0; padding: 0; list-style: none; }
.preview-attendance li { display: flex; align-items: center; gap: 10px; padding: 15px 0; border-bottom: 1px solid var(--border-soft); }
.preview-attendance__avatar { display: grid; place-items: center; flex: none; width: 32px; height: 32px; border-radius: 50%; background: var(--surface-muted); color: var(--brand-primary); font-size: 10px; font-weight: var(--weight-bold); }
.preview-attendance li > div { min-width: 0; }
.preview-attendance li strong { display: block; font-size: 12px; }
.preview-attendance li small { display: block; margin-top: 2px; color: var(--text-muted); font-size: 10px; }
.preview-attendance__status { margin-left: auto; padding: 4px 8px; border-radius: 6px; font-size: 10px; }
.preview-attendance__status--present { background: var(--status-success-bg); color: var(--status-success); }
.preview-attendance__status--leave { background: var(--status-neutral-bg); color: var(--status-neutral); }
.preview-attendance__export { display: flex; align-items: center; gap: 10px; padding: 12px; color: var(--brand-primary); background: var(--brand-tint); border-radius: 8px; }
.preview-attendance__export strong { display: block; font-size: 11px; }
.preview-attendance__export span { display: block; margin-top: 2px; font-size: 10px; }
</style>
