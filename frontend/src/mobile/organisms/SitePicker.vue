<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SiteView } from '@/core/api/generated/model'

const siteId = defineModel<string | null>({ required: true })
const { sites } = defineProps<{ sites: SiteView[] }>()
const open = ref(false)

const selected = computed(() => sites.find((site) => site.id === siteId.value))
const actions = computed(() => sites.map((site) => ({ name: site.name, id: site.id })))
</script>

<template>
  <van-cell-group inset>
    <van-field :model-value="selected?.name ?? ''" label="Şantiye" placeholder="Şantiye seç" readonly is-link
      :rules="[{ required: true, message: 'Şantiye seç' }]" @click="open = true" />
  </van-cell-group>
  <van-action-sheet v-model:show="open" title="Hangi şantiye?" :actions="actions" cancel-text="Vazgeç"
    @select="(action: { id: string }) => ((siteId = action.id), (open = false))" />
</template>
