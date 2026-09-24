<script setup lang="ts">
import { Smile } from 'lucide-vue-next'

/**
 * Masaüstündeki 😊 (WhatsApp Masaüstü gibi): klavyede emoji yok. Kütüphane yerine sahada en çok kullanılanlar;
 * bilgisayarın kendi emoji paneli (Mac'te Ctrl+Cmd+Boşluk) de çalışmaya devam eder.
 */
const emit = defineEmits<{ pick: [emoji: string] }>()

const EMOJIS = [
  '👍', '👌', '🙏', '👏', '💪', '✅', '❌', '⚠️', '❗', '❓', '⏰', '📅',
  '🏗️', '🧱', '🔧', '🔨', '⛏️', '🪚', '🚚', '🏠', '🏢', '📷', '📄', '💰',
  '😊', '😀', '😂', '😅', '🙂', '😐', '😟', '😡', '🤝', '🔥', '💧', '⚡',
]
</script>

<template>
  <el-popover trigger="click" placement="top-end" :width="300">
    <template #reference>
      <button type="button" class="emoji-picker__open" aria-label="Emoji"><Smile :size="20" /></button>
    </template>
    <div class="emoji-picker__grid">
      <button v-for="emoji in EMOJIS" :key="emoji" type="button" class="emoji-picker__emoji" @click="emit('pick', emoji)">
        {{ emoji }}
      </button>
    </div>
  </el-popover>
</template>

<style scoped>
.emoji-picker__open {
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-subtle);
  cursor: pointer;
}

.emoji-picker__grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.emoji-picker__emoji {
  padding: 4px 0;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.emoji-picker__emoji:hover {
  background: var(--surface-muted);
}
</style>
