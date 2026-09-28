<script setup lang="ts">
import { STATUS_LOOKS, type Tone } from '@/core/puantaj/puantajLabels'

/** Takvimin açıklaması, takvimdeki etiketlerle aynı renkte (mobile/atoms/MarkTag): izinli çerçeveli. */
const LEGEND = Object.values(STATUS_LOOKS)
const typeOf = (tone: Tone) => (tone === 'info' ? 'default' : tone)
</script>

<template>
  <van-space wrap :size="6">
    <van-tag v-for="look in LEGEND" :key="look.label" :type="typeOf(look.tone)" :plain="look.tone === 'primary'" round>
      {{ look.short }} {{ look.label }}
    </van-tag>
  </van-space>
</template>
