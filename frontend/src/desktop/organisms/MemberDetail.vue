<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Phone, Send } from 'lucide-vue-next'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import { lastSeenText } from '@/core/team/memberStatus'
import { ROLE_LABELS } from '@/core/team/roles'
import DetailPane from '@/desktop/molecules/DetailPane.vue'

/**
 * Sağ panelde seçili kişi: rol ve telefon, şantiyeleri (şantiyeye götürür), uygulamaya giriş (son görülme
 * ve WhatsApp'la giriş linki). Kişiyi kapatan tehlikeli eylem en altta, ayrı ve kırmızı. Patron kendi
 * hesabında giriş linki ve erişim eylemini görmez; patron hesapları kapatılamaz (kimse kendini kilitlemesin).
 */
const { member, sites, isSelf } = defineProps<{ member: MemberView; sites: SiteView[]; isSelf: boolean }>()
const emit = defineEmits<{ edit: [member: MemberView]; newLink: [member: MemberView]; toggleActive: [member: MemberView] }>()
const router = useRouter()

const memberSites = computed(() => sites.filter((site) => member.siteIds.includes(site.id)))
const canToggle = computed(() => !isSelf && member.role !== 'OWNER')
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="member-detail__head">
        <span class="member-detail__who">
          <strong>{{ member.fullName }}</strong>
          <span>{{ ROLE_LABELS[member.role] }}{{ member.phone ? ` · ${member.phone}` : '' }}</span>
        </span>
        <el-button v-if="member.phone && !isSelf" tag="a" :href="telHref(member.phone)" class="member-detail__call">
          <Phone :size="15" class="member-detail__icon" />Ara
        </el-button>
        <el-button @click="emit('edit', member)">Düzenle</el-button>
      </div>
    </template>
    <section class="member-detail__section">
      <h3>Şantiyeleri</h3>
      <p v-if="member.role === 'OWNER'" class="member-detail__muted">Bütün şantiyeler</p>
      <p v-else-if="!memberSites.length" class="member-detail__muted">Henüz şantiye atanmadı; Düzenle ile ata.</p>
      <el-link v-for="site in memberSites" v-else :key="site.id" type="primary" class="member-detail__site"
        @click="router.push({ name: 'siteFeed', params: { siteId: site.id } })">{{ site.name }} ›</el-link>
    </section>
    <section class="member-detail__section">
      <h3>Uygulamaya giriş</h3>
      <p class="member-detail__muted">{{ lastSeenText(member) }}</p>
      <el-button v-if="member.active && !isSelf" type="primary" class="member-detail__link"
        @click="emit('newLink', member)">
        <Send :size="15" class="member-detail__icon" />Giriş linki gönder
      </el-button>
    </section>
    <section v-if="canToggle" class="member-detail__section member-detail__danger">
      <el-button v-if="member.active" type="danger" text @click="emit('toggleActive', member)">Erişimi kapat</el-button>
      <el-button v-else type="primary" text @click="emit('toggleActive', member)">Erişimi yeniden aç</el-button>
    </section>
  </DetailPane>
</template>

<style scoped>
.member-detail__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.member-detail__who {
  display: grid;
  flex: 1;
  min-width: 0;
}

.member-detail__who strong {
  font-size: var(--text-md);
  font-weight: var(--weight-black);
}

.member-detail__who span,
.member-detail__muted {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.member-detail__section {
  display: grid;
  gap: var(--space-2);
  justify-items: start;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-soft);
}

.member-detail__section h3 {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.member-detail__danger {
  border-bottom: 0;
}

.member-detail__site {
  font-weight: var(--weight-semibold);
}

.member-detail__icon {
  margin-right: 6px;
}

.member-detail__call {
  text-decoration: none;
}
</style>
