<script setup lang="ts">
import type { DayMarkView } from '@/core/api/generated/model'
import { dayTitle } from '@/core/format/dates'
import MarkDot from '@/desktop/atoms/MarkDot.vue'

/**
 * Son günler şeridi: yan yana küçük daireler, eskiden yeniye (kaydı olmayan gün gri halka). Beş ayrı gün sütunu yerine
 * tek sütun: dizüstünde de satırın tamamı sığar. Üstüne gelince gün ve durum yazar; daireye tıklayınca o gün açılır.
 */
const { days, marks } = defineProps<{ days: string[]; marks: Record<string, DayMarkView> }>()
const emit = defineEmits<{ open: [day: string] }>()
</script>

<template>
  <el-space :size="4">
    <el-button v-for="day in days" :key="day" link :aria-label="dayTitle(day)" @click.stop="emit('open', day)">
      <MarkDot :mark="marks[day]" :label="dayTitle(day)" />
    </el-button>
  </el-space>
</template>
