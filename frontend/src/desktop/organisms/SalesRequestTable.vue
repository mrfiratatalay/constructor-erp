<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FollowSalesRequestStatus, SalesRequestView } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { SALES_REQUEST_STATUSES } from '@/core/admin/adminLabels'
import { dateTime } from '@/core/format/dates'

/** Başvurular: kim, hangi firma, kaç şantiye, hangi paket; durum ve not ekip tarafından güncellenir. */
const { requests, loading = false } = defineProps<{ requests: SalesRequestView[]; loading?: boolean }>()
const emit = defineEmits<{
  follow: [id: string, status: FollowSalesRequestStatus, notes: string | null]
  convert: [request: SalesRequestView]
}>()
const asRequest = (row: unknown) => row as SalesRequestView
const STATUSES = Object.entries(SALES_REQUEST_STATUSES).filter(([key]) => key !== 'WON')

async function note(request: SalesRequestView) {
  try {
    const { value } = await ElMessageBox.prompt('Görüşme notu (ekip içi)', request.companyName, {
      inputValue: request.notes ?? '', inputType: 'textarea', confirmButtonText: 'Kaydet', cancelButtonText: 'Vazgeç',
    })
    emit('follow', request.id, request.status as FollowSalesRequestStatus, value || null)
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-table v-loading="loading" :data="requests" empty-text="Bu süzgece uyan başvuru yok" row-key="id">
    <el-table-column type="expand">
      <template #default="{ row }">
        <div class="request__detail">
          <p><b>Mesaj:</b> {{ asRequest(row).message ?? '—' }}</p>
          <p><b>Ekip notu:</b> {{ asRequest(row).notes ?? '—' }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Firma" min-width="130">
      <template #default="{ row }"><strong>{{ asRequest(row).companyName }}</strong><br /><small>{{ asRequest(row).city ?? '' }}</small></template>
    </el-table-column>
    <el-table-column label="Yetkili" min-width="170">
      <template #default="{ row }">
        {{ asRequest(row).contactName }}<br />
        <a :href="`tel:${asRequest(row).phone}`">{{ asRequest(row).phone }}</a>
        <template v-if="asRequest(row).email"> · <a :href="`mailto:${asRequest(row).email}`">{{ asRequest(row).email }}</a></template>
      </template>
    </el-table-column>
    <el-table-column label="Şantiye" prop="siteCount" width="80" align="right" />
    <el-table-column label="Paket" prop="planName" width="120" />
    <el-table-column label="Geldi" width="130"><template #default="{ row }">{{ dateTime(asRequest(row).createdAt) }}</template></el-table-column>
    <el-table-column label="Durum" width="130">
      <template #default="{ row }">
        <RouterLink v-if="asRequest(row).companyId" :to="{ name: 'platformTenant', params: { companyId: asRequest(row).companyId } }">
          <el-tag type="success">{{ asRequest(row).convertedCompanyName }}</el-tag>
        </RouterLink>
        <el-select v-else :model-value="asRequest(row).status" size="small" class="request__status"
          @change="(status: FollowSalesRequestStatus) => emit('follow', asRequest(row).id, status, asRequest(row).notes ?? null)">
          <el-option v-for="[key, item] in STATUSES" :key="key" :value="key" :label="item.label" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column width="210" align="right" fixed="right">
      <template #default="{ row }">
        <el-button size="small" text @click="note(asRequest(row))">Not</el-button>
        <el-button v-if="!asRequest(row).companyId" size="small" type="primary" plain @click="emit('convert', asRequest(row))">
          Firmaya dönüştür
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.request__status {
  width: 120px;
}

.request__detail {
  padding: 0 var(--space-8);
  color: var(--text-muted);
}

small {
  color: var(--text-muted);
}

a {
  color: var(--brand-primary);
  text-decoration: none;
}
</style>
