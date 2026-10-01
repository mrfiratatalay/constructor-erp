<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LocationView } from '@/core/api/generated/model'
import type { MovementDraft } from '@/core/shipments/movementForm'

const draft = defineModel<MovementDraft>({ required: true })
const { sites, depotName } = defineProps<{ sites: LocationView[]; depotName: string }>()
const picking = ref(false)
const search = ref('')
const inbound = computed(() => draft.value.targetKind === 'INBOUND')
const selected = computed(() => sites.find((site) => site.id === draft.value.destinationId))
const found = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('tr')
  return sites.filter((site) => site.name.toLocaleLowerCase('tr').includes(query))
})

function openPicker() {
  search.value = ''
  picking.value = true
}

function choose(id: string) {
  draft.value.destinationId = id
  picking.value = false
}
</script>

<template>
  <van-cell-group inset>
    <van-cell v-if="draft.targetKind === 'SITE'" title="Şantiye" :value="selected?.name ?? 'Şantiye seçin'"
      is-link clickable @click="openPicker" />
    <van-field v-else v-model="draft.partyName" :label="inbound ? 'Kimden geldi?' : 'Firma / kişi'"
      placeholder="Firma veya kişi adı" maxlength="120" required />
    <van-cell v-if="draft.targetKind === 'OUTSIDE'" title="Geri gelmesini bekliyorum" center>
      <template #right-icon>
        <van-switch v-model="draft.expectsReturn" size="24" aria-label="Geri dönüş bekleniyor" />
      </template>
    </van-cell>
    <van-cell :title="inbound ? 'Hedef' : 'Kaynak'" :value="depotName" />
  </van-cell-group>
  <van-popup v-model:show="picking" position="bottom" round teleport="body" class="target-picker">
    <van-nav-bar title="Şantiye seçin" left-text="Vazgeç" @click-left="picking = false" />
    <van-search v-model="search" placeholder="Şantiye ara" shape="round" />
    <div class="target-picker__list">
      <van-cell v-for="site in found" :key="site.id" :title="site.name" clickable @click="choose(site.id)">
        <template #right-icon>
          <van-icon v-if="site.id === draft.destinationId" name="success" color="var(--brand-primary)" />
        </template>
      </van-cell>
      <van-empty v-if="!found.length" :description="search ? 'Şantiye bulunamadı.' : 'Aktif şantiye yok.'" />
    </div>
  </van-popup>
</template>

<style scoped>
.target-picker { display: flex; flex-direction: column; height: 76dvh; padding-bottom: env(safe-area-inset-bottom); }
.target-picker__list { overflow-y: auto; flex: 1; min-height: 0; }
:deep(.van-cell__value) { word-break: break-word; }
</style>
