<script setup lang="ts">
import { computed } from 'vue'
import type { MovementDetail } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import { movementNumber, withUnit } from '@/core/materials/quantity'
import MovementStatusTag from '@/desktop/atoms/MovementStatusTag.vue'

/**
 * Ödünç çıkışının geri dönüşü: "60 / 100 Adet döndü · 40 Adet bekliyor" ve çubuk; altında bağlı iadeler, her biri
 * kendi ayrıntısına açılır. Tamamı dönünce çubuk yeşerir.
 */
const { detail } = defineProps<{ detail: MovementDetail }>()
const emit = defineEmits<{ open: [movementId: string] }>()
const row = computed(() => detail.movement)
const returned = computed(() => detail.returnedQuantity ?? 0)
const percent = computed(() => Math.min(100, Math.round((returned.value / row.value.quantity) * 100)))
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-row justify="space-between">
        <el-text tag="b">Geri dönüş</el-text>
        <el-text :type="detail.remainingQuantity ? 'warning' : 'success'">
          {{ detail.remainingQuantity ? `${withUnit(detail.remainingQuantity, row.unit)} bekliyor` : 'Tamamı döndü' }}
        </el-text>
      </el-row>
    </template>
    <el-space direction="vertical" alignment="stretch" :size="12" fill style="width: 100%">
      <el-progress :percentage="percent" :stroke-width="10" :color="percent === 100 ? 'var(--el-color-success)' : 'var(--el-color-primary)'">
        <el-text size="small">{{ withUnit(returned, row.unit) }} / {{ withUnit(row.quantity, row.unit) }}</el-text>
      </el-progress>
      <el-row v-for="line in detail.returns" :key="line.id" justify="space-between" align="middle">
        <el-link type="primary" @click="emit('open', line.id)">{{ movementNumber(line.number) }}</el-link>
        <el-text type="info">{{ dayWithYear(line.day) }} · {{ line.destinationName }}</el-text>
        <el-text tag="b">{{ withUnit(line.quantity, row.unit) }}</el-text>
        <MovementStatusTag :status="line.status" />
      </el-row>
    </el-space>
  </el-card>
</template>
