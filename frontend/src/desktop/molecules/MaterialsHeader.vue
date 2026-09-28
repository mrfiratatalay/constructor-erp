<script setup lang="ts">
import { Download, Plus, UserRound } from 'lucide-vue-next'

/**
 * Sayfanın başı: iz (Ana Sayfa › Malzemeler), başlık ve kişinin rolü, açıklama; sağda Excel ve birincil iş
 * "+ Malzeme Hareketi". Düğmeler izne göre görünür (rol adına göre değil).
 */
const { role, canExport, canCreate } = defineProps<{ role: string; canExport: boolean; canCreate: boolean }>()
const emit = defineEmits<{ export: []; create: [] }>()
</script>

<template>
  <el-space direction="vertical" alignment="stretch" :size="6" fill style="width: 100%">
    <el-breadcrumb separator="›">
      <el-breadcrumb-item :to="{ path: '/' }">Ana Sayfa</el-breadcrumb-item>
      <el-breadcrumb-item>Malzemeler</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row justify="space-between" align="middle">
      <el-space :size="14">
        <h1>Malzemeler</h1>
        <el-tag v-if="role" type="info" effect="plain" round size="large">
          <el-space :size="6"><UserRound :size="14" aria-hidden="true" />Rol: {{ role }}</el-space>
        </el-tag>
      </el-space>
      <el-space :size="12">
        <el-button v-if="canExport" size="large" :icon="Download" @click="emit('export')">Excel İndir</el-button>
        <el-button v-if="canCreate" size="large" type="primary" :icon="Plus" @click="emit('create')">
          Malzeme Hareketi
        </el-button>
      </el-space>
    </el-row>
    <el-text type="info" size="large">Stok, şantiye kullanımı ve firma dışı malzeme hareketlerini takip edin.</el-text>
  </el-space>
</template>
