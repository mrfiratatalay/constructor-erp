<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { MemberView } from '@/core/api/generated/model'
import type { NewPerson, NewSiteForm } from '@/core/sites/useSiteCreation'
import NewSiteDetails from '@/mobile/molecules/NewSiteDetails.vue'
import NewSiteMembers from '@/mobile/molecules/NewSiteMembers.vue'

/**
 * Yeni şantiye, WhatsApp'ta grup kurmanın iki adımı: 1) katılımcılar, 2) fotoğraf ve ad. Oluşturunca
 * şantiyenin içine düşülür; orada "Patron şantiyeyi kurdu" satırı ve davet düğmeleri hazır durur.
 */
const show = defineModel<boolean>('show', { required: true })
const { people, saving } = defineProps<{ people: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: NewSiteForm] }>()

const step = ref<1 | 2>(1)
const memberIds = ref<string[]>([])
const newPeople = ref<NewPerson[]>([])
const name = ref('')
const address = ref('')
const photo = ref<File | null>(null)
const memberCount = computed(() => memberIds.value.length + newPeople.value.length)

watch(show, (open) => {
  if (!open) return
  step.value = 1
  memberIds.value = []
  newPeople.value = []
  name.value = ''
  address.value = ''
  photo.value = null
})

function submit() {
  emit('submit', {
    memberIds: memberIds.value,
    newPeople: newPeople.value,
    name: name.value.trim(),
    address: address.value.trim() || null,
    photo: photo.value,
  })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <van-form class="new-site" @submit="submit">
      <header class="new-site__head">
        <h2 class="new-site__title">{{ step === 1 ? 'Katılımcı ekle' : 'Yeni şantiye' }}</h2>
        <span class="new-site__step">{{ step }}/2</span>
      </header>
      <NewSiteMembers v-if="step === 1" v-model:member-ids="memberIds" v-model:new-people="newPeople"
        :people="people" />
      <NewSiteDetails v-else v-model:name="name" v-model:address="address" v-model:photo="photo"
        :member-count="memberCount" />
      <van-button v-if="step === 1" type="primary" block round native-type="button" @click="step = 2">
        İleri{{ memberCount ? ` · ${memberCount} kişi` : '' }}
      </van-button>
      <div v-else class="new-site__actions">
        <van-button round native-type="button" @click="step = 1">Geri</van-button>
        <van-button type="primary" round native-type="submit" :loading="saving">Oluştur</van-button>
      </div>
    </van-form>
  </van-popup>
</template>

<style scoped>
.new-site {
  display: grid;
  gap: var(--space-4);
  max-height: 88dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.new-site__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  padding-right: var(--space-8);
}

.new-site__title {
  margin: 0;
  font-size: 18px;
}

.new-site__step {
  color: var(--text-subtle);
  font-size: var(--text-sm);
}

.new-site__actions {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3);
}
</style>
