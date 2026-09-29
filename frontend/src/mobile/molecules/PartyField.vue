<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PartyView } from '@/core/api/generated/model'

/**
 * Firma ya da teslim alan: adı yazılır ya da "Listeden" ile kayıtlılardan seçilir; yeni ad kaydedilirken firma
 * olarak eklenir. Değer seçilen firmanın kimliği ya da yazılan addır (core'daki form böyle bekler).
 */
const model = defineModel<string>({ required: true })
const { label, parties, required = false } = defineProps<{ label: string; parties: PartyView[]; required?: boolean }>()
const open = ref(false)
const text = computed({
  get: () => parties.find((party) => party.id === model.value)?.name ?? model.value,
  set: (value: string) => (model.value = value),
})
const actions = computed(() => parties.map((party) => ({ id: party.id, name: party.name })))
</script>

<template>
  <van-field v-model="text" :label="label" placeholder="Firma adı" maxlength="120" :required="required" clearable>
    <template v-if="parties.length" #button>
      <van-button size="small" plain type="primary" @click="open = true">Listeden</van-button>
    </template>
  </van-field>
  <van-action-sheet v-model:show="open" title="Firma seç" :actions="actions" cancel-text="Vazgeç"
    close-on-click-action teleport="body" @select="(action: { id: string }) => (model = action.id)" />
</template>
