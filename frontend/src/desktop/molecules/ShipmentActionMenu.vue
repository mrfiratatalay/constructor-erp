<script setup lang="ts">
import { Ban, Eye, MoreHorizontal, Undo2 } from 'lucide-vue-next'

const { label = 'Hareket işlemleri', canReceive = false, canCancel = false, showDetails = true, busy = false } =
  defineProps<{ label?: string; canReceive?: boolean; canCancel?: boolean; showDetails?: boolean; busy?: boolean }>()
const emit = defineEmits<{ open: []; receive: []; cancel: [] }>()
function onCommand(command: 'open' | 'receive' | 'cancel') {
  if (command === 'open') emit('open')
  if (command === 'receive') emit('receive')
  if (command === 'cancel') emit('cancel')
}
</script>

<template>
  <el-dropdown trigger="click" :disabled="busy" @command="onCommand">
    <el-button text circle :aria-label="label" :disabled="busy"><MoreHorizontal :size="20" /></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="showDetails" command="open" :icon="Eye">Ayrıntıyı görüntüle</el-dropdown-item>
        <el-dropdown-item v-if="canReceive" command="receive" :icon="Undo2">Malzeme geri geldi</el-dropdown-item>
        <el-dropdown-item v-if="canCancel" command="cancel" :icon="Ban" :divided="showDetails || canReceive">
          <span class="movement-menu__cancel">Hareketi iptal et</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.movement-menu__cancel { color: var(--status-danger); }
</style>
