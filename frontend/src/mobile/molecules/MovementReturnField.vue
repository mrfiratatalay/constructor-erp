<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ShipmentRow } from '@/core/api/generated/model'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'
import ShipmentRoute from '@/mobile/molecules/ShipmentRoute.vue'

const selectedId = defineModel<string | null>({ required: true })
const { awaiting, original, loading, failed } = defineProps<{
  awaiting: ShipmentRow[]; original: ShipmentRow | null; loading: boolean; failed: boolean
}>()
const emit = defineEmits<{ retry: [] }>()
const picking = ref(false)
const search = ref('')
const found = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('tr')
  return awaiting.filter((row) => `${shipmentNumber(row.number)} ${row.toName ?? ''} ${row.lines.map((line) => line.materialName).join(' ')}`
    .toLocaleLowerCase('tr').includes(query))
})

function openPicker() {
  search.value = ''
  picking.value = true
}

function choose(id: string) {
  selectedId.value = id
  picking.value = false
}
</script>

<template>
  <section>
    <van-divider content-position="left">Kaynak</van-divider>
    <div v-if="loading" class="return-field__state"><van-loading size="22">Hareketler yükleniyor…</van-loading></div>
    <div v-else-if="failed" class="return-field__state">
      <p>Geri beklenen hareketler yüklenemedi.</p>
      <van-button size="small" plain type="primary" @click="emit('retry')">Yeniden dene</van-button>
    </div>
    <van-empty v-else-if="!awaiting.length" description="Geri beklenen malzeme hareketi yok." />
    <van-cell-group v-else inset>
      <van-cell title="Geri beklenen çıkış" :value="original ? shipmentNumber(original.number) : 'Hareket seçin'"
        :label="original?.toName ?? undefined" is-link clickable @click="openPicker" />
      <van-cell v-if="original"><template #title><ShipmentRoute :row="original" reverse vertical /></template></van-cell>
    </van-cell-group>
    <template v-if="original">
      <van-divider content-position="left">Malzemeler</van-divider>
      <van-cell-group inset>
        <van-cell v-for="line in original.lines" :key="line.materialId" :title="line.materialName"
          :value="withUnit(line.quantity, line.unit)" />
      </van-cell-group>
      <p class="return-field__help">Seçilen çıkıştaki tüm malzemeler tam miktarıyla geri alınır.</p>
    </template>
  </section>
  <van-popup v-model:show="picking" position="bottom" round teleport="body" class="return-picker">
    <van-nav-bar title="Geri beklenen çıkışlar" left-text="Vazgeç" @click-left="picking = false" />
    <van-search v-model="search" placeholder="Hareket, firma veya malzeme ara" shape="round" />
    <div class="return-picker__list">
      <van-cell v-for="row in found" :key="row.id" :title="`${shipmentNumber(row.number)} · ${row.toName ?? 'Harici firma'}`"
        :label="row.lines.map((line) => `${line.materialName}: ${withUnit(line.quantity, line.unit)}`).join(' · ')"
        :value="row.daysOut == null ? '' : `${row.daysOut} gün`" clickable @click="choose(row.id)">
        <template #right-icon>
          <van-icon v-if="row.id === selectedId" name="success" color="var(--brand-primary)" />
        </template>
      </van-cell>
      <van-empty v-if="!found.length" description="Hareket bulunamadı." />
    </div>
  </van-popup>
</template>

<style scoped>
.return-field__state { padding: var(--space-5); text-align: center; color: var(--text-muted); }
.return-field__help { padding: 0 var(--space-5); color: var(--text-muted); font-size: var(--text-xs); line-height: 1.6; }
.return-picker { display: flex; flex-direction: column; height: 80dvh; padding-bottom: env(safe-area-inset-bottom); }
.return-picker__list { overflow-y: auto; flex: 1; min-height: 0; }
:deep(.van-cell__value) { word-break: break-word; }
</style>
