<script setup lang="ts">
import { computed } from 'vue'
import { Link2, Phone } from 'lucide-vue-next'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import { seenLine } from '@/core/team/memberLines'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import ContactHero from '@/shared/molecules/ContactHero.vue'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/**
 * Sağ panelde kişi bilgisi, WhatsApp'taki gibi: yuvarlak, ad, numara, son görülme; Ara ve Giriş linki gönder;
 * şantiyeleri (yalnızca bakmak ve gitmek için, ekleme şantiyenin içinde); en altta kırmızı "Ekipten çıkar".
 * Henüz girmemiş kişide link düğmesi öne çıkar. Patron kendine bakınca düğmeler yoktur; patron çıkarılamaz.
 */
const { member, sites, isSelf } = defineProps<{ member: MemberView; sites: SiteView[]; isSelf: boolean }>()
const emit = defineEmits<{ edit: [member: MemberView]; newLink: [member: MemberView]; remove: [member: MemberView] }>()

const memberSites = computed(() => sites.filter((site) => member.siteIds.includes(site.id)))
const canRemove = computed(() => !isSelf && member.role !== 'OWNER')
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="member-detail__bar">
        <strong>Kişi bilgisi</strong>
        <el-button @click="emit('edit', member)">Düzenle</el-button>
      </div>
    </template>
    <ContactHero :full-name="member.fullName" :phone="member.phone" :status="seenLine(member)" />
    <div v-if="!isSelf" class="member-detail__actions">
      <el-button v-if="member.phone" tag="a" :href="telHref(member.phone)" class="member-detail__call">
        <Phone :size="16" class="member-detail__icon" />Ara
      </el-button>
      <el-button :type="member.lastSeenAt ? 'default' : 'primary'" @click="emit('newLink', member)">
        <Link2 :size="16" class="member-detail__icon" />Giriş linki gönder
      </el-button>
    </div>
    <section v-if="memberSites.length" class="member-detail__sites">
      <h3>Şantiyeleri</h3>
      <RouterLink v-for="site in memberSites" :key="site.id" class="member-detail__site"
        :to="{ name: 'siteFeed', params: { siteId: site.id } }">
        <SiteAvatar :photo-url="site.photoUrl" :size="40" />
        <span>{{ site.name }}</span>
        <small>›</small>
      </RouterLink>
    </section>
    <el-button v-if="canRemove" type="danger" text class="member-detail__remove" @click="emit('remove', member)">
      Ekipten çıkar
    </el-button>
  </DetailPane>
</template>

<style scoped>
.member-detail__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.member-detail__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}

.member-detail__icon {
  margin-right: 6px;
}

.member-detail__call {
  text-decoration: none;
}

.member-detail__sites {
  display: grid;
  gap: var(--space-1);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-soft);
}

.member-detail__sites h3 {
  margin: 0 0 var(--space-1);
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.member-detail__site {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  color: inherit;
  text-decoration: none;
}

.member-detail__site:hover {
  background: var(--surface-muted);
}

.member-detail__site span {
  flex: 1;
  font-weight: var(--weight-semibold);
}

.member-detail__site small {
  color: var(--text-subtle);
  font-size: var(--text-md);
}

.member-detail__remove {
  justify-self: start;
  padding-top: var(--space-4);
}
</style>
