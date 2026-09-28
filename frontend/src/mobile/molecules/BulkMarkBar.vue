<script setup lang="ts">
import type { DayStatus } from '@/core/puantaj/puantajLabels'
import MarkChoices from '@/mobile/molecules/MarkChoices.vue'

/**
 * Seçim kipinde alttan çıkan çubuk: kaç satır seçildi ve tek dokunuşla ne olarak işaretleneceği. Alt sekme çubuğunun
 * üstüne biner (iOS'ta fotoğraf seçerken alttaki çubuğun değişmesi gibi); eskiden onun altında kalıp görünmüyordu.
 * Sayfayı kilitlemez, satırlara dokunmaya devam edilir. Seçimde ekip varsa yalnızca Geldi ve Gelmedi.
 */
const { show, count, choices } = defineProps<{ show: boolean; count: number; choices: DayStatus[] }>()
const emit = defineEmits<{ choose: [status: DayStatus] }>()
</script>

<template>
  <van-popup :show="show" position="bottom" :overlay="false" :lock-scroll="false" round safe-area-inset-bottom
    teleport="body">
    <van-cell :title="count ? `${count} satır seçildi` : 'İşaretlenecek satırlara dokun'">
      <template #label>
        <MarkChoices :choices="choices" :columns="4" :disabled="!count" @choose="emit('choose', $event)" />
      </template>
    </van-cell>
  </van-popup>
</template>
