<script setup lang="ts">
import { Building2, Construction, CornerDownLeft, Download, ChevronDown, Plus } from 'lucide-vue-next'
import type { MovementKind } from '@/core/shipments/movementPresentation'

const emit = defineEmits<{ choose: [kind: MovementKind] }>()
</script>

<template>
  <el-dropdown trigger="click" @command="emit('choose', $event)">
    <el-button type="primary" class="chooser__trigger">
      <Plus :size="16" aria-hidden="true" /> Yeni Hareket <ChevronDown :size="14" aria-hidden="true" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="chooser__menu">
        <li class="chooser__caption" role="presentation">Ne yapmak istiyorsunuz?</li>
        <el-dropdown-item command="SITE"><Construction :size="18" /> Şantiyeye gönder</el-dropdown-item>
        <el-dropdown-item command="OUTSIDE"><Building2 :size="18" /> Harici firmaya gönder</el-dropdown-item>
        <el-dropdown-item command="RETURN"><CornerDownLeft :size="18" /> Malzeme geri geldi</el-dropdown-item>
        <el-dropdown-item command="INBOUND"><Download :size="18" /> Depoya giriş</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.chooser__trigger { gap: var(--space-2); }
.chooser__menu { min-width: 240px; padding: var(--space-2); }
.chooser__caption { padding: var(--space-2) var(--space-3); color: var(--text-subtle); font-size: var(--text-xs); }
.chooser__menu :deep(.el-dropdown-menu__item) { gap: var(--space-3); border-radius: 8px; min-height: 42px; }
.chooser__menu :deep(svg) { color: var(--text-muted); }
</style>
