<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { RosterEntryView } from '@/core/api/generated/model'
import {
  emptyRosterForm,
  rosterFormError,
  rosterFormOf,
  rosterLabels,
  rosterRequestOf,
  type RosterForm,
} from '@/core/puantaj/rosterForm'
import { useRoster } from '@/core/puantaj/useRoster'

/**
 * Listeye uygulaması olmayan bir kişiyi ya da taşeron ekibi eklemek (ya da düzeltmek). Uygulamadaki çalışan
 * listeye kendiliğinden gelir; onun yalnızca görevi düzeltilir. Ekipte kaç kişi olduğu sorulmaz.
 */
const show = defineModel<boolean>('show', { required: true })
const { entry = null } = defineProps<{ entry?: RosterEntryView | null }>()
const roster = useRoster()
const form = ref<RosterForm>(emptyRosterForm())
const labels = computed(() => rosterLabels(form.value.kind))
const KINDS = [
  { label: 'Kişi', value: 'PERSON' },
  { label: 'Taşeron ekip', value: 'CREW' },
]

watch(show, (open) => open && (form.value = entry ? rosterFormOf(entry) : emptyRosterForm()))

async function submit() {
  const problem = rosterFormError(form.value)
  if (problem) return ElMessage.warning(problem)
  const request = rosterRequestOf(form.value)
  try {
    await (entry ? roster.update(entry.id, request) : roster.add(request))
    ElMessage.success(entry ? 'Kaydedildi' : 'Listeye eklendi')
    show.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" :title="entry ? 'Düzenle' : 'Listeye ekle'" width="480px">
    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item v-if="!entry">
        <el-segmented v-model="form.kind" :options="KINDS" block />
      </el-form-item>
      <el-form-item v-if="form.linked">
        <el-alert type="info" :closable="false" show-icon
          title="Adı ve numarası uygulamadaki hesabından gelir; burada yalnızca görevi düzeltilir." />
      </el-form-item>
      <el-form-item v-else :label="labels.name" required>
        <el-input v-model="form.name" :placeholder="labels.namePlaceholder" maxlength="120" />
      </el-form-item>
      <el-form-item :label="labels.trade">
        <el-input v-model="form.trade" :placeholder="labels.tradePlaceholder" maxlength="60" />
      </el-form-item>
      <el-form-item v-if="!form.linked" label="Telefon (isteğe bağlı)">
        <el-input v-model="form.phone" type="tel" placeholder="0532 123 45 67" maxlength="20" />
      </el-form-item>
      <el-text v-if="form.kind === 'CREW'" type="info" size="small">
        Ekipte kaç kişi olduğu tutulmaz: ekip her gün "geldi" ya da "gelmedi" diye işaretlenir.
      </el-text>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="roster.isSaving.value" @click="submit">{{ entry ? 'Kaydet' : 'Ekle' }}</el-button>
    </template>
  </el-dialog>
</template>
