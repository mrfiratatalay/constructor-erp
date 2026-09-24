<script setup lang="ts">
import { Ellipsis } from 'lucide-vue-next'
import type { PostAction, PostMenuItem } from '@/core/posts/postMenu'

/** Mesajın köşesindeki ⋯ menüsü (WhatsApp Masaüstü'ndeki ⌄ gibi); öğeleri core/posts/postMenu belirler. */
const { items } = defineProps<{ items: PostMenuItem[] }>()
const emit = defineEmits<{ select: [action: PostAction] }>()
</script>

<template>
  <el-dropdown v-if="items.length" trigger="click" placement="bottom-end" @command="(action: PostAction) => emit('select', action)">
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
