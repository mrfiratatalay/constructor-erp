<script setup lang="ts">
import { MARK_CHOICES, type MarkChoice } from '@/core/rollcall/rollCallLabels'

/**
 * Patronun küçük seçimi, alttan (sohbetteki ＋ menüsü gibi), tek dokunuş: Geldi · Hastalık · İzinli · Habersiz
 * · Diğer. title: kimin, hangi günü işaretlendiği ("Veli Kaya · 27 Eylül").
 */
const { title } = defineProps<{ title: string }>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ choose: [choice: MarkChoice] }>()
const actions = MARK_CHOICES.map((choice) => ({ name: choice.label, choice }))

function onSelect(action: { choice: MarkChoice }) {
  show.value = false
  emit('choose', action.choice)
}
</script>

<template>
  <van-action-sheet v-model:show="show" :title="title" :actions="actions" cancel-text="Vazgeç" teleport="body"
    @select="onSelect" />
</template>
