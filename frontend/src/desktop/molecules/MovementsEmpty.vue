<script setup lang="ts">
import { PackageOpen, Plus } from 'lucide-vue-next'

/**
 * Boş liste iki ayrı durumdur: hiç hareket yoksa ilk hareketi girmeye çağırır; süzgeçler yüzünden boşsa bunu söyler
 * ve süzgeçleri temizletir (kullanıcı verisinin kaybolduğunu sanmasın).
 */
const { filtered, canCreate } = defineProps<{ filtered: boolean; canCreate: boolean }>()
const emit = defineEmits<{ create: []; clear: [] }>()
</script>

<template>
  <el-empty :image-size="0" style="padding: 32px 0">
    <template #image>
      <el-text type="info"><PackageOpen :size="44" :stroke-width="1.5" /></el-text>
    </template>
    <template #description>
      <el-space direction="vertical" :size="4">
        <el-text tag="b" size="large">
          {{ filtered ? 'Bu filtrelere uygun kayıt bulunamadı' : 'Henüz malzeme hareketi bulunmuyor' }}
        </el-text>
        <el-text type="info">
          {{ filtered ? 'Süzgeçleri değiştir ya da temizle.' : 'Gelen, şantiyeye giden ya da kullanılan malzemeyi kaydet.' }}
        </el-text>
      </el-space>
    </template>
    <el-button v-if="filtered" @click="emit('clear')">Filtreleri temizle</el-button>
    <el-button v-else-if="canCreate" type="primary" :icon="Plus" @click="emit('create')">Malzeme Hareketi</el-button>
  </el-empty>
</template>
