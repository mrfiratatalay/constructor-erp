<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ReturnRow } from '@/core/api/generated/model'
import { movementNumber, withUnit } from '@/core/materials/quantity'

/** İadenin bağlı olduğu ödünç çıkışı: firma, malzeme ve bekleyen miktar. Malzeme ve firma çıkıştan gelir. */
const model = defineModel<string | null>({ required: true })
const { loans } = defineProps<{ loans: ReturnRow[] }>()
const open = ref(false)
const selected = computed(() => loans.find((loan) => loan.movementId === model.value))
const actions = computed(() =>
  loans.map((loan) => ({
    id: loan.movementId,
    name: `${loan.partyName ?? 'Firma'} · ${loan.materialName}`,
    subname: `${withUnit(loan.remaining, loan.unit)} bekliyor · ${movementNumber(loan.number)}`,
  })),
)
</script>

<template>
  <van-field :model-value="selected ? `${selected.partyName} · ${selected.materialName}` : ''" label="Ödünç çıkışı"
    placeholder="İadesi beklenen çıkışı seç" readonly is-link required @click="open = true" />
  <van-action-sheet v-model:show="open" title="İadesi beklenen çıkış" :actions="actions" cancel-text="Vazgeç"
    close-on-click-action teleport="body" description="Malzeme ve firma çıkıştan gelir"
    @select="(action: { id: string }) => (model = action.id)" />
</template>
