<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LocationView } from '@/core/api/generated/model'

/**
 * Lokasyon alanı: dokununca alttan liste açılır, önce depolar sonra şantiyeler, her birinin altında türü yazar.
 * sitesOnly: "Hangi Şantiye" sorusunda depolar gösterilmez; exclude: öbür uçta seçili lokasyon seçilemez.
 */
const model = defineModel<string | null>({ required: true })
const {
  label,
  locations,
  sitesOnly = false,
  exclude = null,
} = defineProps<{ label: string; locations: LocationView[]; sitesOnly?: boolean; exclude?: string | null }>()
const open = ref(false)
const selected = computed(() => locations.find((location) => location.id === model.value))
const actions = computed(() =>
  locations
    .filter((location) => !sitesOnly || location.kind === 'SITE')
    .map((location) => ({
      id: location.id,
      name: location.name,
      subname: location.kind === 'DEPOT' ? 'Depo' : location.active ? 'Şantiye' : 'Şantiye · tamamlandı',
      disabled: location.id === exclude,
      color: location.id === model.value ? 'var(--brand-primary)' : undefined,
    })),
)
</script>

<template>
  <van-field :model-value="selected?.name ?? ''" :label="label" placeholder="Seç" readonly is-link required
    @click="open = true" />
  <van-action-sheet v-model:show="open" :title="label" :actions="actions" cancel-text="Vazgeç" close-on-click-action
    teleport="body" @select="(action: { id: string }) => (model = action.id)" />
</template>
