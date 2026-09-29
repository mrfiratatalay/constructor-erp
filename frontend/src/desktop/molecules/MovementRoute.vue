<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { MovementRow } from '@/core/api/generated/model'
import { movementFrom, movementTo } from '@/core/materials/movementEnds'
import { withUnit } from '@/core/materials/quantity'

/** Hareketin yolu tek bakışta: "Ana Depo → Çamburnu Plaza", ortada miktar. */
const { row } = defineProps<{ row: MovementRow }>()
</script>

<template>
  <el-card shadow="never">
    <el-row align="middle" justify="space-between" :gutter="12">
      <el-col :span="9">
        <el-space direction="vertical" alignment="flex-start" :size="2">
          <el-text type="info" size="small">Nereden</el-text>
          <el-text tag="b" size="large">{{ movementFrom(row) }}</el-text>
        </el-space>
      </el-col>
      <el-col :span="6">
        <el-space direction="vertical" :size="2" style="width: 100%">
          <el-text tag="b">{{ withUnit(row.quantity, row.unit) }}</el-text>
          <el-text type="primary"><ArrowRight :size="22" /></el-text>
        </el-space>
      </el-col>
      <el-col :span="9" style="text-align: right">
        <el-space direction="vertical" alignment="flex-end" :size="2">
          <el-text type="info" size="small">Nereye</el-text>
          <el-text tag="b" size="large">{{ movementTo(row) }}</el-text>
        </el-space>
      </el-col>
    </el-row>
  </el-card>
</template>
