<script setup lang="ts">
import { computed, ref } from 'vue'
import { Phone } from 'lucide-vue-next'
import { formatPhone, telHref } from '@/core/format/phone'
import type { Callable } from '@/core/sites/participants'

/**
 * Başlıktaki 📞, telefonda. Aranacak tek kişi varsa doğrudan onu arar: dayının şantiyeye girince en sık yaptığı
 * iş tek dokunuştur. Birden fazlaysa alttan liste açılır: ad, rol, numara; dokununca arar.
 */
const { people } = defineProps<{ people: Callable[] }>()
const choosing = ref(false)
const only = computed(() => (people.length === 1 ? people[0]! : null))
const actions = computed(() =>
  people.map((person) => ({
    name: person.fullName,
    subname: `${person.role} · ${formatPhone(person.phone)}`,
    phone: person.phone,
  })),
)

function call(action: { phone: string }) {
  choosing.value = false
  window.location.href = telHref(action.phone)
}
</script>

<template>
  <van-button v-if="only" size="small" round plain type="primary" class="call-button" tag="a"
    :href="telHref(only.phone)" :aria-label="`${only.fullName} ara`">
    <Phone :size="17" />
  </van-button>
  <van-button v-else-if="people.length" size="small" round plain type="primary" class="call-button" aria-label="Ara"
    @click="choosing = true">
    <Phone :size="17" />
  </van-button>
  <van-action-sheet v-model:show="choosing" :actions="actions" title="Kimi arayalım?" cancel-text="Vazgeç"
    teleport="body" @select="call" />
</template>

<style scoped>
.call-button {
  width: 34px;
  padding: 0;
  margin-left: var(--space-2);
}
</style>
