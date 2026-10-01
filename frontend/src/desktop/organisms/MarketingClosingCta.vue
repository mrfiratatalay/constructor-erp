<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="marketing-closing">
    <div class="marketing-closing__inner">
      <h2>Bir sonraki iş gününe daha net başlayın.</h2>
      <p>Constructor ERP’yi firmanızın iş akışı üzerinden birlikte değerlendirelim.</p>
      <div class="marketing-closing__actions">
        <RouterLink :to="{ name: 'apply' }" custom v-slot="{ href, navigate }">
          <el-button tag="a" :href="href" type="primary" size="large" class="marketing-closing__primary" @click="navigate">
            Tanıtım isteyin<ArrowRight :size="17" aria-hidden="true" />
          </el-button>
        </RouterLink>
        <RouterLink :to="{ name: 'pricing' }" class="marketing-closing__pricing">Paketleri inceleyin<ArrowRight :size="15" aria-hidden="true" /></RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marketing-closing { color: var(--brand-on-deep); background: var(--mk-dark); }
.marketing-closing__inner { max-width: var(--mk-width); margin-inline: auto; padding: var(--mk-space) var(--mk-gutter); text-align: center; }
.marketing-closing h2 { max-width: 22ch; margin: 0 auto; font-size: clamp(32px, 3.5vw, 48px); font-weight: var(--weight-bold); letter-spacing: -.035em; line-height: 1.25; }
.marketing-closing p { max-width: 54ch; margin: 22px auto 0; color: rgb(255 255 255 / 64%); font-size: 16px; line-height: 1.8; }
.marketing-closing__actions { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 24px; margin-top: 32px; }
.marketing-closing__actions a { text-decoration: none; }
.marketing-closing__primary {
  --el-button-bg-color: var(--mk-yellow);
  --el-button-border-color: var(--mk-yellow);
  --el-button-text-color: var(--mk-dark);
  --el-button-hover-bg-color: #fde047;
  --el-button-hover-border-color: #fde047;
  --el-button-hover-text-color: var(--mk-dark);
  --el-button-active-bg-color: var(--mk-yellow);
  --el-button-active-border-color: var(--mk-yellow);
  --el-button-active-text-color: var(--mk-dark);
  height: 50px;
  padding-inline: 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: var(--weight-semibold);
}
.marketing-closing__primary :deep(span) { display: inline-flex; align-items: center; gap: 12px; }
.marketing-closing__pricing { display: inline-flex; align-items: center; gap: 10px; color: rgb(255 255 255 / 74%); font-size: 13px; font-weight: var(--weight-medium); transition: color 150ms ease; }
.marketing-closing__pricing:hover { color: var(--brand-on-deep); }
.marketing-closing a:focus-visible { outline: 2px solid var(--mk-yellow); outline-offset: 5px; border-radius: 10px; }
</style>
