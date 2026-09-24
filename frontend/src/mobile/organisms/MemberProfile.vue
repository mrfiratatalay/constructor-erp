<script setup lang="ts">
import { computed } from 'vue'
import { Link2, Phone } from 'lucide-vue-next'
import type { MemberView, SiteView } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import { seenLine } from '@/core/team/memberLines'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'
import ContactHero from '@/shared/molecules/ContactHero.vue'

/**
 * Kişi bilgisi, WhatsApp'taki gibi: yuvarlak, ad, numara, son görülme; Ara ve Giriş linki gönder;
 * şantiyeleri (yalnızca bakmak ve gitmek için, ekleme şantiyenin içinde); en altta kırmızı "Ekipten çıkar".
 * Henüz girmemiş kişide link düğmesi öne çıkar. Patron kendine bakınca düğmeler yoktur; patron çıkarılamaz.
 */
const { member, sites, isSelf } = defineProps<{ member: MemberView; sites: SiteView[]; isSelf: boolean }>()
const emit = defineEmits<{ newLink: [member: MemberView]; remove: [member: MemberView] }>()

const memberSites = computed(() => sites.filter((site) => member.siteIds.includes(site.id)))
const canRemove = computed(() => !isSelf && member.role !== 'OWNER')
</script>

<template>
  <section class="member-profile">
    <ContactHero :full-name="member.fullName" :phone="member.phone" :status="seenLine(member)" />
    <div v-if="!isSelf" class="member-profile__actions">
      <van-button v-if="member.phone" round block tag="a" :href="telHref(member.phone)">
        <Phone :size="16" class="member-profile__icon" />Ara
      </van-button>
      <van-button round block :type="member.lastSeenAt ? 'default' : 'primary'" @click="emit('newLink', member)">
        <Link2 :size="16" class="member-profile__icon" />Giriş linki gönder
      </van-button>
    </div>
    <van-cell-group v-if="memberSites.length" inset title="Şantiyeleri" class="member-profile__sites">
      <van-cell v-for="site in memberSites" :key="site.id" :title="site.name" center is-link
        :to="{ name: 'siteFeed', params: { siteId: site.id } }">
        <template #icon><SiteAvatar :photo-url="site.photoUrl" :size="40" class="member-profile__site-avatar" /></template>
      </van-cell>
    </van-cell-group>
    <van-button v-if="canRemove" round block plain type="danger" @click="emit('remove', member)">
      Ekipten çıkar
    </van-button>
  </section>
</template>

<style scoped>
.member-profile {
  display: grid;
  gap: var(--space-5);
  padding-top: var(--space-4);
}

.member-profile__actions {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  gap: var(--space-2);
}

.member-profile__icon {
  margin-right: 6px;
  vertical-align: -3px;
}

.member-profile__sites {
  margin: 0;
}

.member-profile__site-avatar {
  margin-right: var(--space-3);
}
</style>
