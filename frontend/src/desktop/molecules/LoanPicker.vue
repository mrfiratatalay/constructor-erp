<script setup lang="ts">
import type { ReturnRow } from '@/core/api/generated/model'
import { movementNumber, withUnit } from '@/core/materials/quantity'

/**
 * İadenin bağlı olduğu ödünç çıkışı: firma, malzeme ve bekleyen miktar. İade boş bir formdan değil bu seçimden
 * başlar; malzeme ve firma çıkıştan gelir, yanlış ilişki kurulamaz.
 */
const model = defineModel<string | null>({ required: true })
const { loans } = defineProps<{ loans: ReturnRow[] }>()
</script>

<template>
  <el-select v-model="model" filterable placeholder="İadesi beklenen çıkışı seç" size="large"
    no-data-text="İadesi beklenen ödünç çıkışı yok">
    <el-option v-for="loan in loans" :key="loan.movementId" :value="loan.movementId"
      :label="`${loan.partyName ?? 'Firma'} · ${loan.materialName} · ${withUnit(loan.remaining, loan.unit)} bekliyor`">
      <el-row justify="space-between" align="middle" style="width: 100%">
        <span>{{ loan.partyName }} · <b>{{ loan.materialName }}</b></span>
        <el-text type="info" size="small">
          {{ movementNumber(loan.number) }} · {{ withUnit(loan.remaining, loan.unit) }} bekliyor
        </el-text>
      </el-row>
    </el-option>
  </el-select>
</template>
