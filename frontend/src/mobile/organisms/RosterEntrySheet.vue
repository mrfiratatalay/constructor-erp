<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
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
const { isSaving } = roster
const form = ref<RosterForm>(emptyRosterForm())
const labels = computed(() => rosterLabels(form.value.kind))
const hint = computed(() => {
  if (form.value.linked) return 'Adı ve numarası uygulamadaki hesabından gelir; burada yalnızca görevi düzeltilir.'
  return form.value.kind === 'CREW' ? 'Ekipte kaç kişi olduğu tutulmaz: ekip her gün geldi ya da gelmedi diye işaretlenir.' : ''
})

watch(show, (open) => open && (form.value = entry ? rosterFormOf(entry) : emptyRosterForm()))

async function submit() {
  const problem = rosterFormError(form.value)
  if (problem) return showFailToast(problem)
  const request = rosterRequestOf(form.value)
  try {
    await (entry ? roster.update(entry.id, request) : roster.add(request))
    showSuccessToast(entry ? 'Kaydedildi' : 'Listeye eklendi')
    show.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-action-sheet v-model:show="show" :title="entry ? 'Düzenle' : 'Listeye ekle'" teleport="body">
    <van-form @submit="submit">
      <van-cell-group inset :title="hint || undefined">
        <van-field v-if="!entry" label="Tür">
          <template #input>
            <van-radio-group v-model="form.kind" direction="horizontal">
              <van-radio name="PERSON">Kişi</van-radio>
              <van-radio name="CREW">Taşeron ekip</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-if="!form.linked" v-model="form.name" :label="labels.name" :placeholder="labels.namePlaceholder"
          maxlength="120" required />
        <van-field v-model="form.trade" :label="labels.trade" :placeholder="labels.tradePlaceholder" maxlength="60" />
        <van-field v-if="!form.linked" v-model="form.phone" label="Telefon" type="tel" placeholder="İsteğe bağlı"
          maxlength="20" />
      </van-cell-group>
      <van-cell :border="false">
        <template #title>
          <van-button type="primary" native-type="submit" block round :loading="isSaving">
            {{ entry ? 'Kaydet' : 'Ekle' }}
          </van-button>
        </template>
      </van-cell>
    </van-form>
  </van-action-sheet>
</template>
