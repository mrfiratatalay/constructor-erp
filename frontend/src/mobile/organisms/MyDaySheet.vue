<script setup lang="ts">
import type { MyDayView } from '@/core/api/generated/model'
import { dateTime, dayTitle } from '@/core/format/dates'
import { telHref } from '@/core/format/phone'
import { hoursText } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/mobile/atoms/MarkTag.vue'

/**
 * Puantajım'da bir günün ayrıntısı: durum, mesai ve kaydı kimin ne zaman yazdığı. Kaydı yanlış bulan çalışan
 * "Ara" ile o kişiyi doğrudan arar; itiraz ay sonunda değil o gün, yazan hatırlarken çıkar. Şefin notu görünmez.
 */
const show = defineModel<boolean>('show', { required: true })
const { day, mark = undefined } = defineProps<{ day: string; mark?: MyDayView }>()
</script>

<template>
  <van-action-sheet v-model:show="show" :title="dayTitle(day)" teleport="body">
    <van-cell-group inset title="Kaydın">
      <van-cell title="Durum" center>
        <template #value>
          <MarkTag v-if="mark" :mark="mark" />
          <span v-else>İşaretlenmedi</span>
        </template>
      </van-cell>
      <van-cell v-if="mark?.overtimeHours" title="Mesai" :value="`${hoursText(mark.overtimeHours)} saat`" />
    </van-cell-group>
    <van-cell-group v-if="mark" inset title="Yanlışsa işaretleyeni ara; o gün hatırlıyordur.">
      <van-cell :title="mark.markedByName" :label="`${dateTime(mark.markedAt)} işaretledi`" center>
        <template #value>
          <van-button v-if="mark.markedByPhone" size="small" round type="primary" icon="phone-o"
            :url="telHref(mark.markedByPhone)">
            Ara
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else inset title="Şefin işaretleyince burada görünür." />
  </van-action-sheet>
</template>
