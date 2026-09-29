<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { shipmentExportUrl } from '@/core/shipments/shipmentExport'
import { useShipments } from '@/core/shipments/useShipments'
import ShipmentDialog from '@/desktop/organisms/ShipmentDialog.vue'
import ShipmentDrawer from '@/desktop/organisms/ShipmentDrawer.vue'
import ShipmentTable from '@/desktop/organisms/ShipmentTable.vue'

/**
 * Malzemeler, geniş ekranda: tek liste. Sayı kartları, sekmeler ve on üç süzgeç kalktı; geriye arama kaldı.
 * Üstteki şerit yalnızca yapacak bir iş varsa görünür (İlke 3): dışarıda kalmış malzeme.
 */
const search = ref('')
const { shipments, outside, isLoading } = useShipments(search)
const { canCreate, canExport } = useMaterialPermissions()

const formOpen = ref(false)
const openId = ref<string | null>(null)
const notice = computed(() =>
  outside.value.length ? `${outside.value.length} malzeme dışarıda, geri bekleniyor` : '',
)
</script>

<template>
  <section class="materials">
    <header class="materials__head">
      <h1>Malzemeler</h1>
      <span class="materials__actions">
        <el-button v-if="canExport" tag="a" :href="shipmentExportUrl(search)">Excel</el-button>
        <el-button v-if="canCreate" type="primary" @click="formOpen = true">+ Sevkiyat</el-button>
      </span>
    </header>

    <el-alert v-if="notice" :title="notice" type="warning" show-icon :closable="false" />

    <el-input v-model="search" placeholder="Malzeme, firma ya da açıklama ara" clearable style="max-width: 380px" />

    <ShipmentTable :rows="shipments" :loading="isLoading" @open="openId = $event" />

    <ShipmentDialog v-model:show="formOpen" @saved="openId = $event" />
    <ShipmentDrawer v-model:shipment-id="openId" />
  </section>
</template>

<style scoped>
.materials {
  display: grid;
  align-content: start;
  gap: var(--space-4);
  padding: var(--space-6);
}

.materials__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.materials__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
