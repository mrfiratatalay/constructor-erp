<script setup lang="ts">
import { Check, HardHat, PackageCheck, TriangleAlert } from 'lucide-vue-next'
import { PREVIEW_FIELD } from '@/core/marketing/productPreview'
const icons = { done: Check, delivery: PackageCheck, issue: TriangleAlert }
</script>

<template>
  <div class="preview-board">
    <header class="preview-board__header">
      <span class="preview-board__site"><HardHat :size="19" /></span>
      <div><h3>Park Konutları</h3><p>B Blok · Saha günlüğü</p></div>
      <span class="preview-board__today">Bugün</span>
    </header>
    <div class="preview-board__label"><span>Sahadan son güncellemeler</span><span>{{ PREVIEW_FIELD.length }} kayıt</span></div>
    <ol class="preview-board__timeline">
      <li v-for="entry in PREVIEW_FIELD" :key="entry.time">
        <span class="preview-board__status" :class="`preview-board__status--${entry.kind}`">
          <component :is="icons[entry.kind]" :size="16" aria-hidden="true" />
        </span>
        <div><time>{{ entry.time }}</time><strong>{{ entry.title }}</strong><small>{{ entry.author }}</small></div>
      </li>
    </ol>
    <div class="preview-board__note"><Check :size="14" aria-hidden="true" />Her güncelleme kendi şantiyesinde kayıtlı.</div>
  </div>
</template>

<style scoped>
.preview-board__header { display: flex; align-items: center; gap: 10px; }
.preview-board__site { display: grid; place-items: center; flex: none; width: 38px; height: 38px; border-radius: 12px; color: var(--brand-primary); background: var(--brand-tint); }
.preview-board__header h3 { margin: 0; font-size: 16px; }
.preview-board__header p { margin: 2px 0 0; color: var(--text-muted); font-size: 11px; }
.preview-board__today { margin-left: auto; font-size: 10px; color: var(--text-muted); }
.preview-board__label { display: flex; justify-content: space-between; gap: 8px; margin: 22px 0 16px; font-size: 10px; color: var(--text-muted); }
.preview-board__timeline { display: grid; margin: 0; padding: 0; list-style: none; }
.preview-board__timeline li { display: flex; gap: 12px; position: relative; padding-bottom: 22px; }
.preview-board__timeline li:not(:last-child)::before { position: absolute; content: ''; width: 1px; top: 32px; bottom: 0; left: 15px; background: var(--border-soft); }
.preview-board__status { display: grid; place-items: center; flex: none; width: 32px; height: 32px; border-radius: 50%; }
.preview-board__status--done { background: var(--status-success-bg); color: var(--status-success); }
.preview-board__status--delivery { background: var(--brand-tint); color: var(--brand-primary); }
.preview-board__status--issue { background: var(--status-warning-bg); color: var(--status-warning); }
.preview-board__timeline time { display: block; margin-bottom: 4px; font-size: 10px; color: var(--text-muted); }
.preview-board__timeline strong { display: block; font-size: 12px; line-height: 1.5; font-weight: var(--weight-semibold); }
.preview-board__timeline small { display: block; margin-top: 4px; font-size: 10px; color: var(--text-muted); }
.preview-board__note { display: flex; align-items: center; gap: 6px; padding: 10px; border-radius: 8px; color: var(--brand-primary); background: var(--brand-tint); font-size: 10px; }
</style>
