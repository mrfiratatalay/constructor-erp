<script setup lang="ts">
import { computed, ref } from 'vue'
import { Truck } from 'lucide-vue-next'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useShipments } from '@/core/shipments/useShipments'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import ShipmentCell from '@/mobile/molecules/ShipmentCell.vue'
import ShipmentFormSheet from '@/mobile/organisms/ShipmentFormSheet.vue'
import ShipmentSheet from '@/mobile/organisms/ShipmentSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Malzemeler: tek liste, bir düğme. Sayı kartı, sekme ve süzgeç yoktur — depo sorumlusu depoda ayakta durur,
 * ilk ekranda yapacağı iş olmalıdır. Dışarıdakiler başa alınır: peşine düşülecek tek şey onlardır.
 */
const search = ref('')
const { shipments, outside, isLoading } = useShipments(search)
const { canCreate } = useMaterialPermissions()
const { workspace } = useWorkspace()

const formOpen = ref(false)
const openId = ref<string | null>(null)
/** Dışarıdakiler ayrı bölümde durduğu için alt listede tekrar edilmez. */
const rest = computed(() => shipments.value.filter((row) => !row.awaitingReturn))
</script>

<template>
  <MobilePage title="Malzemeler" :logo-name="workspace?.name" :logo-url="workspace?.logoUrl" brand>
    <van-button v-if="canCreate" type="primary" size="large" block round icon="plus" @click="formOpen = true">
      Sevkiyat çıkar
    </van-button>

    <van-search v-model="search" placeholder="Malzeme ya da firma ara" shape="round" />

    <van-skeleton v-if="isLoading" :row="5" />
    <van-empty v-else-if="!shipments.length" description="Henüz sevkiyat yok.">
      <template #image><Truck :size="48" /></template>
    </van-empty>

    <template v-else>
      <van-cell-group v-if="outside.length" inset :title="`Dışarıda (${outside.length})`">
        <ShipmentCell v-for="row in outside" :key="row.id" :row="row" @open="openId = $event" />
      </van-cell-group>

      <van-cell-group v-if="rest.length" inset title="Sevkiyatlar">
        <ShipmentCell v-for="row in rest" :key="row.id" :row="row" @open="openId = $event" />
      </van-cell-group>
    </template>

    <ShipmentFormSheet v-model:show="formOpen" @saved="openId = $event" />
    <ShipmentSheet v-model:shipment-id="openId" />
  </MobilePage>
</template>
