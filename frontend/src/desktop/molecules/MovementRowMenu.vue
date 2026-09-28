<script setup lang="ts">
import { computed } from 'vue'
import { Ellipsis } from 'lucide-vue-next'
import type { MovementRow } from '@/core/api/generated/model'
import { deliverLabel, movementActions } from '@/core/materials/movementActions'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'

type Command = 'open' | 'deliver' | 'takeReturn' | 'cancel'

/** Satırın ⋯ menüsü: Ayrıntı her zaman; öbür adımlar hareketin durumuna ve kişinin iznine göre. */
const { row } = defineProps<{ row: MovementRow }>()
const emit = defineEmits<{ command: [command: Command] }>()
const { can } = useMaterialPermissions()
const items = computed(() => {
  const allowed = movementActions(row.status, can)
  return [
    { key: 'open', label: 'Ayrıntı', show: true },
    { key: 'deliver', label: deliverLabel(row.status), show: allowed.deliver },
    { key: 'takeReturn', label: 'İade al', show: allowed.takeReturn },
    { key: 'cancel', label: 'İptal et', show: allowed.cancel, danger: true },
  ].filter((item) => item.show)
})
</script>

<template>
  <el-dropdown trigger="click" @command="(key: Command) => emit('command', key)">
    <el-button text circle aria-label="Satırın işleri" @click.stop><Ellipsis :size="18" /></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in items" :key="item.key" :command="item.key" :divided="item.danger">
          <el-text :type="item.danger ? 'danger' : undefined">{{ item.label }}</el-text>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
