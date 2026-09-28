<script setup lang="ts">
import { computed } from 'vue'
import type { MovementDetail } from '@/core/api/generated/model'
import { dateTime, dayWithYear } from '@/core/format/dates'
import { PURPOSE_LABELS } from '@/core/materials/materialLabels'
import { formatQuantity, movementNumber } from '@/core/materials/quantity'

/**
 * Hareketin bilgileri, yalnızca dolu olanlar (İlke 3: olumsuz bilgi yer kaplamaz): malzeme, tarih, firma, amaç,
 * iade tarihi, kullanım alanı, sayım ayrıntısı, açıklama; en altta kaydı kim, ne zaman girdi.
 */
const { detail } = defineProps<{ detail: MovementDetail }>()
const emit = defineEmits<{ open: [movementId: string] }>()
const facts = computed(() => {
  const row = detail.movement
  return [
    ['Malzeme', row.materialCode ? `${row.materialName} · ${row.materialCode}` : row.materialName],
    ['Kategori', row.category],
    ['Tarih', dayWithYear(row.day)],
    ['Firma / Kişi', row.partyName],
    ['Veriliş amacı', row.purpose ? PURPOSE_LABELS[row.purpose] : null],
    ['Beklenen iade', row.expectedReturnDate ? dayWithYear(row.expectedReturnDate) : null],
    ['Geri dönüş notu', detail.returnNote],
    ['Kullanım alanı', row.usageArea],
    ['Sayım', detail.countedQuantity != null
      ? `Sistem ${formatQuantity(detail.systemQuantity ?? 0)} · Sayılan ${formatQuantity(detail.countedQuantity)}` : null],
    ['Neden', detail.reason],
    ['Açıklama', row.description],
    ['Kaydı giren', `${row.createdByName} · ${dateTime(row.createdAt)}`],
  ].filter((fact): fact is [string, string] => !!fact[1])
})
</script>

<template>
  <el-descriptions :column="1" border label-width="140px">
    <el-descriptions-item v-for="[label, value] in facts" :key="label" :label="label">{{ value }}</el-descriptions-item>
    <el-descriptions-item v-if="detail.returnOf" label="Ödünç çıkışı">
      <el-link type="primary" @click="emit('open', detail.returnOf.id)">
        {{ movementNumber(detail.returnOf.number) }}
      </el-link>
    </el-descriptions-item>
  </el-descriptions>
</template>
