<script setup lang="ts">
import { ref } from 'vue'
import { useDemoControls } from '@/core/demo/useDemoControls'

/**
 * Demoda ekranın kenarında duran, sürüklenebilen düğme: rol değiştirme, görünüm değiştirme, sıfırlama. Telefonda sol
 * menü yok; düğme kenara yapışır, mesaj yazma çubuğunu kapatırsa kişi onu kaydırır.
 */
const { chooseRole, reset, otherViewLabel, switchView, sourceUrl } = useDemoControls()
const open = ref(false)
const offset = ref({ x: window.innerWidth - 64, y: Math.round(window.innerHeight * 0.55) })

const actions = [
  { name: 'Rolü değiştir', run: chooseRole },
  { name: otherViewLabel, run: switchView },
  { name: 'Kaynak kod (GitHub)', run: () => window.open(sourceUrl, '_blank', 'noopener') },
  { name: 'Demoyu sıfırla', color: 'var(--status-danger)', run: reset },
]

const select = (action: { run: () => unknown }) => void action.run()
</script>

<template>
  <van-floating-bubble v-model:offset="offset" axis="xy" magnetic="x" icon="exchange" @click="open = true" />
  <van-action-sheet v-model:show="open" :actions="actions" description="Demo · örnek veriler" cancel-text="Kapat"
    close-on-click-action @select="select" />
</template>
