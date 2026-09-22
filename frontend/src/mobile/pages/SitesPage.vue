<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { useCurrentUser } from '@/core/auth/currentUser'
import { leadNames } from '@/core/sites/siteNames'
import { SITE_STATUS } from '@/core/sites/siteStatus'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import SiteFormPopup from '@/mobile/organisms/SiteFormPopup.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

const router = useRouter()
const { data: user } = useCurrentUser()
const { sites, isLoading, saveSite, isSaving } = useSites()
const isOwner = computed(() => user.value?.role === 'OWNER')
const formOpen = ref(false)

// Mevcut şantiye kendi sayfasında düzenlenir; buradan yalnızca yenisi eklenir.
function openNew() {
  formOpen.value = true
}

async function onSubmit(form: SiteForm) {
  try {
    await saveSite(null, form)
    formOpen.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage title="Şantiyeler">
    <template v-if="isOwner" #action>
      <van-button size="small" type="primary" round @click="openNew">Şantiye ekle</van-button>
    </template>
    <van-skeleton v-if="isLoading" :row="4" />
    <van-empty v-else-if="!sites?.length" description="Henüz şantiye yok" />
    <van-cell-group v-else inset>
      <van-cell v-for="site in sites" :key="site.id" :title="site.name" :label="leadNames(site.leads)"
        is-link center
        @click="router.push({ name: 'siteFeed', params: { siteId: site.id } })">
        <template #value>
          <StatusTag :tone="SITE_STATUS[site.status].tone">{{ SITE_STATUS[site.status].label }}</StatusTag>
        </template>
      </van-cell>
    </van-cell-group>
    <SiteFormPopup v-model:show="formOpen" :site="null" :saving="isSaving" @submit="onSubmit" />
  </MobilePage>
</template>
