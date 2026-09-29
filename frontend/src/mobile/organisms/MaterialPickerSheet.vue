<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MaterialView } from '@/core/api/generated/model'
import { COMMON_UNITS, useMaterialCreate } from '@/core/shipments/useMaterialCreate'

/**
 * Malzeme seçici. Sahadaki en sık durum, aranan malzemenin listede **olmamasıdır**: kamyon yüklenirken kartı
 * açmak için ayrı bir ekrana gidilemez, gidilirse kayıt hiç girilmez. Bu yüzden arama sonucu boşsa yazılan ad
 * doğrudan yeni malzemeye dönüşür; tek eksik birimdir, o da tek dokunuşla seçilir.
 */
const show = defineModel<boolean>('show', { required: true })
const { materials } = defineProps<{ materials: MaterialView[] }>()
const emit = defineEmits<{ choose: [materialId: string] }>()

const { addMaterial, isAdding } = useMaterialCreate()
const search = ref('')
const unit = ref('')

const query = computed(() => search.value.trim())
const found = computed(() => {
  const text = query.value.toLocaleLowerCase('tr')
  return text ? materials.filter((m) => m.name.toLocaleLowerCase('tr').includes(text)) : materials
})
/** Aranan ad birebir varsa yeni kart önerilmez: aynı malzeme ikinci kez açılmasın. */
const exists = computed(() =>
  materials.some((m) => m.name.toLocaleLowerCase('tr') === query.value.toLocaleLowerCase('tr')),
)
const canAdd = computed(() => query.value.length > 1 && !exists.value)

watch(show, (open) => {
  if (open) {
    search.value = ''
    unit.value = ''
  }
})

function pick(materialId: string) {
  emit('choose', materialId)
  show.value = false
}

async function add() {
  if (!unit.value.trim()) return showFailToast('Birimini seç: torba, adet, ton…')
  try {
    pick((await addMaterial(query.value, unit.value)).id)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" :style="{ height: '100%' }" teleport="body">
    <van-nav-bar title="Malzeme" left-text="Vazgeç" safe-area-inset-top @click-left="show = false" />
    <div class="picker">
      <van-search v-model="search" placeholder="Malzeme adı yaz ya da ara" shape="round" autofocus />

      <van-cell-group v-if="canAdd" inset title="Listede yok">
        <van-field :model-value="query" readonly label="Yeni malzeme" />
        <van-field label="Birimi">
          <template #input>
            <div class="picker__units">
              <van-button v-for="option in COMMON_UNITS" :key="option" size="small" round
                :type="unit === option ? 'primary' : 'default'" @click="unit = option">
                {{ option }}
              </van-button>
            </div>
          </template>
        </van-field>
        <van-field v-model="unit" label="Başka" placeholder="Kendi birimini yaz" />
        <div class="picker__add">
          <van-button type="primary" block round :loading="isAdding" @click="add">
            "{{ query }}" ekle ve seç
          </van-button>
        </div>
      </van-cell-group>

      <van-cell-group v-if="found.length" inset :title="query ? 'Bulunanlar' : 'Malzemeler'">
        <van-cell v-for="material in found" :key="material.id" is-link :title="material.name"
          :value="material.unit" @click="pick(material.id)" />
      </van-cell-group>
      <van-empty v-else-if="!canAdd" description="Malzeme yok. Adını yazarak ekleyebilirsin." />
    </div>
  </van-popup>
</template>

<style scoped>
.picker {
  overflow-y: auto;
  height: calc(100% - var(--van-nav-bar-height));
  padding-bottom: var(--van-padding-xl);
  background: var(--van-background);
}

.picker__units {
  display: flex;
  flex-wrap: wrap;
  gap: var(--van-padding-xs);
}

.picker__add {
  padding: var(--van-padding-md);
}
</style>
