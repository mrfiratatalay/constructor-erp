<script setup lang="ts">
/**
 * Tek kullanımlık bir bağlantı (kurulum, davet, katılma) açılamadığında: neden açılmadığı ve çıkış yolu. Çıkmaz
 * sokak kalmasın diye her zaman giriş sayfasına bir düğme vardır.
 */
const { message } = defineProps<{ message: string }>()
</script>

<template>
  <van-empty image="error" :description="message">
    <RouterLink :to="{ name: 'login' }"><van-button round type="primary">Giriş sayfasına git</van-button></RouterLink>
  </van-empty>
</template>
