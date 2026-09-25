<script setup lang="ts" generic="Action extends string">
import { Ellipsis } from 'lucide-vue-next'
import type { PostMenuItem } from '@/core/posts/postMenu'

/**
 * Mesajın köşesindeki ⋯ menüsü (WhatsApp Masaüstü'ndeki ⌄ gibi). Öğeleri core belirler: sohbette
 * core/posts/postMenu, Saha'da core/field/fieldMenu.
 */
const { items } = defineProps<{ items: PostMenuItem<Action>[] }>()
const emit = defineEmits<{ select: [action: Action] }>()
</script>

<template>
  <el-dropdown v-if="items.length" trigger="click" placement="bottom-end" @command="(action: Action) => emit('select', action)">
    <el-button text circle aria-label="Mesaj işlemleri"><Ellipsis :size="18" /></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in items" :key="item.action" :command="item.action" :divided="item.danger"
          :class="{ 'post-menu__danger': item.danger }">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.post-menu__danger {
  color: var(--status-danger);
}
</style>
