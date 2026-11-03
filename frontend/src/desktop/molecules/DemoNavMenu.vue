<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import { useDemoControls } from '@/core/demo/useDemoControls'

/**
 * Demoda sol menünün altındaki düğme: rol değiştirme, görünüm değiştirme, sıfırlama. Projeyi inceleyen kişi bir
 * rolde dolaştıktan sonra ötekine buradan geçer; çıkış yapıp giriş ekranını aramak zorunda kalmaz.
 */
defineProps<{ expanded: boolean }>()

const { chooseRole, reset, otherViewLabel, switchView, sourceUrl } = useDemoControls()

const ACTIONS: Record<string, () => unknown> = {
  role: chooseRole,
  view: switchView,
  source: () => window.open(sourceUrl, '_blank', 'noopener'),
  reset,
}

const run = (command: string) => void ACTIONS[command]?.()
</script>

<template>
  <el-dropdown trigger="click" placement="right-end" @command="run">
    <el-button type="warning" plain :circle="!expanded" aria-label="Demo menüsü: rol değiştir, sıfırla">
      <Sparkles :size="16" />
      <span v-if="expanded">&nbsp;Demo · Rol değiştir</span>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="role">Rolü değiştir</el-dropdown-item>
        <el-dropdown-item command="view">{{ otherViewLabel }}</el-dropdown-item>
        <el-dropdown-item command="source">Kaynak kod (GitHub)</el-dropdown-item>
        <el-dropdown-item command="reset" divided>Demoyu sıfırla</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
