<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { shortDay, todayIsoDate } from '@/core/format/dates'
import { assigneeChoices } from '@/core/tasks/assigneeChoices'
import { DUE_CHOICES, type DueChoice } from '@/core/tasks/dueChoice'
import { useQuickTask } from '@/core/tasks/useQuickTask'

/**
 * Sohbetin ＋'sındaki "📋 Görev", alttan: Ne yapılacak? Kim yapacak? Ne zaman? (Bugün · Yarın · Tarih seç). Öncelik
 * ve not sorulmaz. Kişi listesi ＋ menüsü gibi alttan açılır: firma kalabalık olsa da pencere kısa kalır. Tarih
 * çarkında bugünden öncesi yoktur; gün seçilince "Tarih seç" o günün adını alır.
 */
const { site } = defineProps<{ site: SiteView }>()
const show = defineModel<boolean>('show', { required: true })
const { data: user } = useCurrentUser()
const { form, ready, reset, assign, isSaving } = useQuickTask(() => site.id)
const people = computed(() => assigneeChoices(site, user.value).map(({ id, label }) => ({ id, name: label })))
const assigneeName = computed(() => people.value.find((person) => person.id === form.assigneeId)?.name)
const pickingPerson = ref(false)
const pickingDate = ref(false)
const dateParts = ref<string[]>([])
const today = new Date()
const maxDate = new Date(today.getFullYear() + 3, 11, 31)

watch(show, (open) => {
  if (open) reset()
})

/** "Tarih seç" gün seçilince geçerli olur: çark kapatılırsa önceki seçim kalır. */
function chooseDue(choice: DueChoice) {
  if (choice !== 'date') return (form.due = choice)
  dateParts.value = (form.date ?? todayIsoDate()).split('-')
  pickingDate.value = true
}

function pickDate({ selectedValues }: { selectedValues: string[] }) {
  form.date = selectedValues.join('-')
  form.due = 'date'
  pickingDate.value = false
}

function pickPerson(person: { id: string }) {
  form.assigneeId = person.id
  pickingPerson.value = false
}

async function submit() {
  if (!ready.value) return
  try {
    await assign()
    showSuccessToast('Görev verildi')
    show.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" :style="{ maxHeight: '90%' }">
    <div class="assign-sheet">
      <van-cell-group title="📋 Görev" :border="false" />
      <van-cell-group inset title="Ne yapılacak?">
        <van-field v-model="form.title" placeholder="Kalıp sökülecek" maxlength="200" size="large" />
      </van-cell-group>
      <van-cell-group inset title="Kim yapacak?">
        <van-cell :title="assigneeName ?? 'Kişi seç'" is-link size="large" center @click="pickingPerson = true" />
      </van-cell-group>
      <van-cell-group inset title="Ne zaman?" :border="false">
        <div class="assign-sheet__days">
          <van-button v-for="choice in DUE_CHOICES" :key="choice.value" round
            :type="form.due === choice.value ? 'primary' : 'default'" :aria-pressed="form.due === choice.value"
            @click="chooseDue(choice.value)">
            {{ choice.value === 'date' && form.date ? shortDay(form.date) : choice.label }}
          </van-button>
        </div>
      </van-cell-group>
      <div class="assign-sheet__submit">
        <van-button type="primary" size="large" block round :disabled="!ready" :loading="isSaving" @click="submit">
          📋 Görevi ver
        </van-button>
      </div>
    </div>
    <van-action-sheet v-model:show="pickingPerson" :actions="people" title="Kim yapacak?" teleport="body"
      @select="pickPerson" />
    <van-popup v-model:show="pickingDate" position="bottom" round teleport="body">
      <van-date-picker v-model="dateParts" title="Ne zaman?" :min-date="today" :max-date="maxDate"
        cancel-button-text="Vazgeç" confirm-button-text="Seç" @confirm="pickDate" @cancel="pickingDate = false" />
    </van-popup>
  </van-popup>
</template>

<style scoped>
/*
 * Beyaz pencerede beyaz alan kaybolmasın: alanlar hafif zeminli (Görevler'deki görev penceresi gibi). Tema, sayfa
 * zaten boşluklu diye grupların kenar boşluğunu sıfırlar; pencerede alanlar kenara yapışmasın diye geri verilir.
 */
.assign-sheet {
  --van-cell-background: var(--surface-muted);
  --van-cell-group-inset-padding: 0 var(--space-4);
}

/* Üç gün satırı eşit böler; düğmeler hücreye değil doğrudan gruba konur (hücrenin değeri sağa yaslı ve dar). */
.assign-sheet__days {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

.assign-sheet__submit {
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
}
</style>
