<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { leadNames } from '@/core/sites/siteNames'
import { SITE_STATUS } from '@/core/sites/siteStatus'
import { useSites, type SiteForm } from '@/core/sites/useSites'
import SiteFormDialog from '@/desktop/organisms/SiteFormDialog.vue'
import DesktopPage from '@/desktop/templates/DesktopPage.vue'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

const { data: user } = useCurrentUser()
const { sites, isLoading, saveSite, isSaving } = useSites()
const isOwner = computed(() => user.value?.role === 'OWNER')
const formOpen = ref(false)
const editing = ref<SiteView | null>(null)

// Element Plus tablo satırını genel tipte verir; satırın SiteView olduğunu tek yerde söylüyoruz.
const asSite = (row: unknown) => row as SiteView

function open(site: SiteView | null) {
  editing.value = site
  formOpen.value = true
}

async function onSubmit(form: SiteForm) {
  try {
    await saveSite(editing.value, form)
    formOpen.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <DesktopPage title="Şantiyeler">
    <template v-if="isOwner" #actions>
      <el-button type="primary" @click="open(null)">Şantiye ekle</el-button>
    </template>
    <el-skeleton v-if="isLoading" :rows="4" animated />
    <el-table v-else :data="sites ?? []" empty-text="Henüz şantiye yok" class="sites-table"
      @row-click="(row: unknown) => $router.push({ name: 'siteFeed', params: { siteId: asSite(row).id } })">
      <el-table-column prop="name" label="Şantiye" min-width="200" />
      <el-table-column label="Adres" min-width="220">
        <template #default="{ row }">{{ asSite(row).address ?? '—' }}</template>
      </el-table-column>
      <el-table-column label="Sorumlular" min-width="200">
        <template #default="{ row }">{{ leadNames(asSite(row).leads) }}</template>
      </el-table-column>
      <el-table-column label="Durum" width="150">
        <template #default="{ row }">
          <StatusTag :tone="SITE_STATUS[asSite(row).status].tone">{{ SITE_STATUS[asSite(row).status].label }}</StatusTag>
        </template>
      </el-table-column>
      <el-table-column v-if="isOwner" width="110" align="right">
        <template #default="{ row }"><el-button size="small" @click.stop="open(asSite(row))">Düzenle</el-button></template>
      </el-table-column>
    </el-table>
    <SiteFormDialog v-model:show="formOpen" :site="editing" :saving="isSaving" @submit="onSubmit" />
  </DesktopPage>
</template>

<style scoped>
.sites-table :deep(.el-table__row) {
  cursor: pointer;
}
</style>
