<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const show = defineModel<boolean>('show', { required: true })
const point = defineModel<string>('point', { required: true })
const { points } = defineProps<{ points: string[] }>()
const search = ref('')
const found = computed(() => points.filter((name) => name.toLocaleLowerCase('tr').includes(search.value.trim().toLocaleLowerCase('tr'))))
watch(show, (open) => { if (open) search.value = '' })

function choose(name: string) {
  point.value = name
  show.value = false
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round teleport="body" class="movement-points">
    <van-nav-bar title="Nokta seç" left-text="Vazgeç" @click-left="show = false" />
    <van-search v-model="search" placeholder="Depo, şantiye veya firma ara" />
    <div class="movement-points__list">
      <van-cell title="Tüm noktalar" clickable :icon="!point ? 'success' : undefined" @click="choose('')" />
      <van-cell v-for="name in found" :key="name" :title="name" clickable
        :icon="point === name ? 'success' : undefined" @click="choose(name)" />
      <van-empty v-if="!found.length" description="Aramanıza uygun nokta bulunamadı." image="search" />
    </div>
  </van-popup>
</template>

<style scoped>
.movement-points { display: flex; flex-direction: column; height: 75dvh; padding-bottom: env(safe-area-inset-bottom, 0px); }
.movement-points__list { min-height: 0; overflow-y: auto; }
</style>
