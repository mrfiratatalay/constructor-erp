<script setup lang="ts">
import { ArrowUpRight, Boxes } from 'lucide-vue-next'
import { PREVIEW_MATERIALS } from '@/core/marketing/productPreview'
</script>

<template>
  <div class="preview-materials">
    <header><span>Malzeme hareket merkezi</span><Boxes :size="18" aria-hidden="true" /></header>
    <h3>Malzeme nereye gitti?</h3>
    <p class="preview-materials__lead">Çıkış, giriş ve iade aynı hareket defterinde.</p>
    <ul>
      <li v-for="movement in PREVIEW_MATERIALS" :key="movement.reference">
        <div class="preview-materials__title"><strong>{{ movement.title }}</strong><small>{{ movement.reference }}</small></div>
        <p>{{ movement.route }}</p>
        <div class="preview-materials__detail"><span>{{ movement.quantity }}</span><span>{{ movement.state }}</span></div>
      </li>
    </ul>
    <div class="preview-materials__note"><ArrowUpRight :size="14" aria-hidden="true" />Geri beklenen malzemeler ayrıca takip edilir.</div>
  </div>
</template>

<style scoped>
.preview-materials header { display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: var(--text-muted); }
.preview-materials h3 { margin: 18px 0 5px; font-size: 18px; }
.preview-materials__lead { margin: 0; color: var(--text-muted); font-size: 11px; }
.preview-materials ul { display: grid; gap: 10px; margin: 20px 0 16px; padding: 0; list-style: none; }
.preview-materials li { padding: 12px; border: 1px solid var(--border-soft); border-radius: 10px; background: var(--surface); }
.preview-materials__title { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px; }
.preview-materials__title strong { font-size: 12px; }
.preview-materials__title small { color: var(--text-muted); font-size: 9px; font-variant-numeric: tabular-nums; }
.preview-materials li p { margin: 5px 0 10px; color: var(--text-muted); font-size: 10px; }
.preview-materials__detail { display: flex; flex-wrap: wrap; align-items: center; gap: 5px 10px; font-size: 10px; }
.preview-materials__detail span:last-child { margin-left: auto; padding: 3px 6px; color: var(--brand-primary); background: var(--brand-tint); border-radius: 5px; font-size: 9px; }
.preview-materials__note { display: flex; align-items: center; gap: 6px; color: var(--brand-primary); font-size: 10px; }
</style>
