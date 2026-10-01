<script setup lang="ts">
/**
 * Tek kullanımlık bir bağlantı (kurulum, davet, katılma) açılamadığında: neden açılmadığı ve çıkış yolu. Çıkmaz
 * sokak kalmasın diye her zaman giriş sayfasına bir düğme vardır.
 */
const { title, message } = defineProps<{ title: string; message: string }>()
</script>

<template>
  <el-result icon="warning" :title="title" :sub-title="message">
    <template #extra>
      <RouterLink :to="{ name: 'login' }"><el-button type="primary">Giriş sayfasına git</el-button></RouterLink>
    </template>
  </el-result>
</template>
