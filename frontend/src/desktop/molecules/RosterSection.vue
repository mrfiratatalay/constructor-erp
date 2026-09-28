<script setup lang="ts">
/**
 * Listenin bir bölümü (Personel, Taşeron ekipler): başlığında adı ve kaç kalem olduğu, içinde cetveli (ve seçim
 * varsa altında seçim çubuğu). Kart, cetveli sayfanın gri zemininden ayırır.
 */
const { title, count } = defineProps<{ title: string; count: number }>()
</script>

<template>
  <!-- min-width 0: kart el-space'in esnek öğesidir; yoksa ayın cetvelinin tam genişliğine büyüyüp sayfadan taşıyordu.
       Böylece cetvel kendi içinde kayar, ad ve toplamlar sabit durur. -->
  <el-card shadow="never" style="min-width: 0">
    <template #header>
      <el-space :size="8">
        <el-text tag="b" size="large">{{ title }}</el-text>
        <el-tag type="info" size="small" round disable-transitions>{{ count }}</el-tag>
      </el-space>
    </template>
    <slot />
  </el-card>
</template>
