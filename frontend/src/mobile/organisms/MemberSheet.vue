<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Send } from 'lucide-vue-next'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import { lastSeenText } from '@/core/team/memberStatus'
import { ROLE_LABELS } from '@/core/team/roles'

/**
 * Kişiye dokununca alttan açılan kişi paneli; masaüstündeki sağ panelin aynısı: rol ve telefon,
 * şantiyeleri, uygulamaya giriş (son görülme + giriş linki). Kişiyi kapatan eylem en altta, kırmızı.
 * Patron kendi hesabında giriş linki ve erişim eylemini görmez; patron hesapları kapatılamaz.
 */
const { member, sites, isSelf } = defineProps<{ member: MemberView | null; sites: SiteView[]; isSelf: boolean }>()
const emit = defineEmits<{
  close: []
  edit: [member: MemberView]
  newLink: [member: MemberView]
  toggleActive: [member: MemberView]
}>()

const memberSites = computed(() => (member ? sites.filter((site) => member.siteIds.includes(site.id)) : []))
const canToggle = computed(() => !!member && !isSelf && member.role !== 'OWNER')
</script>

<template>
  <van-popup :show="member !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && emit('close')">
    <section v-if="member" class="member-sheet">
      <header class="member-sheet__head">
        <h2>{{ member.fullName }}</h2>
        <p>{{ ROLE_LABELS[member.role] }}{{ member.phone ? ` · ${member.phone}` : '' }}</p>
      </header>
      <div class="member-sheet__actions">
        <van-button v-if="member.phone && !isSelf" round block tag="a" :href="telHref(member.phone)">
          <Phone :size="16" class="member-sheet__icon" />Ara
        </van-button>
        <van-button round block @click="emit('edit', member)">Düzenle</van-button>
      </div>
      <van-cell-group inset title="Şantiyeleri" class="member-sheet__group">
        <van-cell v-if="member.role === 'OWNER'" title="Bütün şantiyeler" />
        <van-cell v-else-if="!memberSites.length" title="Henüz şantiye atanmadı" label="Düzenle ile ata." />
        <van-cell v-for="site in memberSites" v-else :key="site.id" :title="site.name" is-link
          :to="{ name: 'siteFeed', params: { siteId: site.id } }" @click="emit('close')" />
      </van-cell-group>
      <van-cell-group inset title="Uygulamaya giriş" class="member-sheet__group">
        <van-cell :title="lastSeenText(member)" />
      </van-cell-group>
      <van-button v-if="member.active && !isSelf" type="primary" round block @click="emit('newLink', member)">
        <Send :size="16" class="member-sheet__icon" />Giriş linki gönder
      </van-button>
      <van-button v-if="canToggle" round block plain :type="member.active ? 'danger' : 'primary'"
        class="member-sheet__danger" @click="emit('toggleActive', member)">
        {{ member.active ? 'Erişimi kapat' : 'Erişimi yeniden aç' }}
      </van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.member-sheet {
  display: grid;
  gap: var(--space-3);
  max-height: 86dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.member-sheet__head {
  padding-right: var(--space-8);
}

.member-sheet__head h2 {
  margin: 0;
  font-size: var(--text-lg);
}

.member-sheet__head p {
  margin: 2px 0 0;
  color: var(--text-muted);
}

.member-sheet__actions {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: var(--space-2);
}

/* Beyaz pencerede beyaz grup kaybolmasın: bölümler hafif zeminli bloklar. */
.member-sheet__group {
  --van-cell-background: var(--surface-muted);
}

.member-sheet__icon {
  margin-right: 6px;
  vertical-align: -3px;
}

.member-sheet__danger {
  margin-top: var(--space-3);
}
</style>
