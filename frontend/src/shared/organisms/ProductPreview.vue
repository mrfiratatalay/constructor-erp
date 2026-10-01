<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import { Boxes, ClipboardCheck, HardHat } from 'lucide-vue-next'
import { PREVIEW_TABS, type PreviewView } from '@/core/marketing/productPreview'
import ProductMark from '@/shared/atoms/ProductMark.vue'
import PreviewBoard from '@/shared/molecules/PreviewBoard.vue'
import PreviewAttendance from '@/shared/molecules/PreviewAttendance.vue'
import PreviewMaterials from '@/shared/molecules/PreviewMaterials.vue'

const selected = ref<PreviewView>('field')
const id = useId()
const icons = { field: HardHat, attendance: ClipboardCheck, materials: Boxes }

function navigateTabs(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const current = PREVIEW_TABS.findIndex((tab) => tab.value === selected.value)
  const offset = event.key === 'ArrowRight' ? 1 : -1
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? PREVIEW_TABS.length - 1
    : (current + offset + PREVIEW_TABS.length) % PREVIEW_TABS.length
  selected.value = PREVIEW_TABS[next]!.value
  void nextTick(() => document.getElementById(`${id}-${selected.value}`)?.focus())
}
</script>

<template>
  <div class="product-preview">
    <header class="product-preview__bar">
      <ProductMark :size="24" /><strong>Constructor ERP</strong><span>Örnek görünüm</span>
    </header>
    <div class="product-preview__tabs" role="tablist" aria-label="Ürün ekranları" @keydown="navigateTabs">
      <button v-for="tab in PREVIEW_TABS" :id="`${id}-${tab.value}`" :key="tab.value" type="button" role="tab"
        :aria-selected="selected === tab.value" :aria-controls="`${id}-panel`" :tabindex="selected === tab.value ? 0 : -1"
        :class="{ 'is-active': selected === tab.value }" @click="selected = tab.value">
        <component :is="icons[tab.value]" :size="15" aria-hidden="true" />{{ tab.label }}
      </button>
    </div>
    <div :id="`${id}-panel`" class="product-preview__content" role="tabpanel" :aria-labelledby="`${id}-${selected}`" tabindex="0">
      <PreviewBoard v-if="selected === 'field'" />
      <PreviewAttendance v-else-if="selected === 'attendance'" />
      <PreviewMaterials v-else />
    </div>
    <footer class="product-preview__footer"><span>Telefon ve bilgisayarda aynı çalışma alanı</span><span>Örnek veriler</span></footer>
  </div>
</template>

<style scoped>
.product-preview { min-width: 0; overflow: hidden; border: 1px solid rgb(255 255 255 / .22); border-radius: 18px; background: var(--surface); box-shadow: 0 28px 70px rgb(0 0 0 / .24); color: var(--text-strong); text-align: left; }
.product-preview__bar { display: flex; align-items: center; gap: 8px; padding: 14px 16px; border-bottom: 1px solid var(--border-soft); }
.product-preview__bar strong { font-size: 12px; letter-spacing: -.02em; }
.product-preview__bar > span { margin-left: auto; padding: 3px 6px; background: var(--surface-muted); border-radius: 5px; color: var(--text-muted); font-size: 9px; white-space: nowrap; }
.product-preview__tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; padding: 8px; background: var(--surface-muted); }
.product-preview__tabs button { display: flex; justify-content: center; align-items: center; gap: 5px; min-height: 40px; padding: 6px 3px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--text-muted); font: inherit; font-size: 12px; cursor: pointer; }
.product-preview__tabs button svg { flex: none; }
.product-preview__tabs button:hover { color: var(--brand-primary); }
.product-preview__tabs .is-active { border-color: var(--border-soft); background: var(--surface); color: var(--brand-primary); box-shadow: var(--shadow-sm); font-weight: var(--weight-semibold); }
.product-preview__content { height: 410px; padding: 20px 18px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
.product-preview__content:focus-visible { outline-offset: -4px; }
.product-preview__footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px; padding: 12px 16px; border-top: 1px solid var(--border-soft); color: var(--text-muted); background: var(--surface-muted); font-size: 9px; }
</style>
