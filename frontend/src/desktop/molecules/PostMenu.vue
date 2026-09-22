<script setup lang="ts">
import { Ellipsis } from 'lucide-vue-next'

/** Gönderi kartının köşesindeki ⋯ menüsü: yetkiye göre Düzelt ve Sil. İkisi de yoksa hiç görünmez. */
const { canCorrect, canDelete } = defineProps<{ canCorrect: boolean; canDelete: boolean }>()
const emit = defineEmits<{ correct: []; delete: [] }>()

function onCommand(command: 'correct' | 'delete') {
  if (command === 'correct') emit('correct')
  else emit('delete')
}
</script>

<template>
  <el-dropdown v-if="canCorrect || canDelete" trigger="click" placement="bottom-end" @command="onCommand">
    <el-button text circle aria-label="Gönderi işlemleri"><Ellipsis :size="18" /></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="canCorrect" command="correct">Düzelt</el-dropdown-item>
        <el-dropdown-item v-if="canDelete" command="delete" :divided="canCorrect" class="post-menu__delete">
          Sil
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.post-menu__delete {
  color: var(--status-danger);
}
</style>
