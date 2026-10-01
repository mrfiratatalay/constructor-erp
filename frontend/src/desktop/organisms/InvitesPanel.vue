<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Link } from 'lucide-vue-next'
import type { OnboardingInviteView, TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { INVITE_STATUSES } from '@/core/admin/adminLabels'
import { useTenantInvites } from '@/core/admin/useTenantInvites'
import { dateTime } from '@/core/format/dates'
import { confirmAction } from '@/desktop/confirmAction'
import OnboardingLinkDialog from '@/desktop/organisms/OnboardingLinkDialog.vue'

/** Kurulum bağlantıları: yeni bağlantı (bekleyen eskisi iptal olur), geçmiş ve iptal. Bağlantı yalnızca üretildiği an görünür. */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const { invites, fresh, issue, isIssuing, revoke } = useTenantInvites(() => tenant.summary.id)
const asInvite = (row: unknown) => row as OnboardingInviteView

async function cancel(invite: OnboardingInviteView) {
  const title = 'Kurulum bağlantısı iptal edilsin mi?'
  if (!(await confirmAction({ title, message: 'Bu bağlantı artık çalışmaz.', confirm: 'İptal et' }))) return
  await revoke(invite.id).then(() => ElMessage.success('Bağlantı iptal edildi.'), (error) => ElMessage.error(errorMessage(error)))
}
</script>

<template>
  <div class="invites">
    <div class="invites__head">
      <span>{{ tenant.summary.setupCompleted ? 'Firma kurulumu tamamladı.' : 'Firma kurulumu henüz tamamlamadı.' }}</span>
      <el-button type="primary" :loading="isIssuing" @click="issue"><Link :size="16" /> Yeni kurulum bağlantısı</el-button>
    </div>
    <el-table :data="invites ?? []" empty-text="Henüz bağlantı üretilmedi">
      <el-table-column label="Üretildi"><template #default="{ row }">{{ dateTime(asInvite(row).createdAt) }}</template></el-table-column>
      <el-table-column label="Geçerlilik"><template #default="{ row }">{{ dateTime(asInvite(row).expiresAt) }}</template></el-table-column>
      <el-table-column label="Durum" width="140">
        <template #default="{ row }">
          <el-tag size="small" :type="INVITE_STATUSES[asInvite(row).status]?.tone">{{ INVITE_STATUSES[asInvite(row).status]?.label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Kullanan" prop="usedByName" />
      <el-table-column label="Üreten" prop="createdByName" />
      <el-table-column width="120" align="right">
        <template #default="{ row }">
          <el-button v-if="asInvite(row).status === 'PENDING'" size="small" text type="danger" @click="cancel(asInvite(row))">İptal et</el-button>
        </template>
      </el-table-column>
    </el-table>
    <OnboardingLinkDialog :link="fresh" :company-name="tenant.summary.name" :email="tenant.email" @close="fresh = null" />
  </div>
</template>

<style scoped>
.invites {
  display: grid;
  gap: var(--space-4);
}

.invites__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
}

.invites__head :deep(.el-button svg) {
  margin-right: var(--space-1);
}
</style>
