<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChevronDown, Pencil } from 'lucide-vue-next'
import type { TenantDetail } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { lifecycleActions, type LifecycleAction } from '@/core/admin/tenantLifecycle'
import { tenantBadge } from '@/core/admin/tenantStatus'
import { useTenantActions } from '@/core/admin/useTenantActions'
import { dayWithYear, timeAgo } from '@/core/format/dates'
import TenantEditDialog from '@/desktop/organisms/TenantEditDialog.vue'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Firmanın kimliği, bugünkü durumu ve yaşam döngüsü (askıya al, arşivle, yeniden aç; silme yoktur). */
const { tenant } = defineProps<{ tenant: TenantDetail }>()
const { changeStatus } = useTenantActions(() => tenant.summary.id)
const editing = ref(false)

async function apply(action: LifecycleAction) {
  try {
    const { value } = await ElMessageBox.prompt(action.confirm, `${action.label}: ${tenant.summary.name}`, {
      confirmButtonText: action.label, cancelButtonText: 'Vazgeç', inputPlaceholder: 'Neden (işlem geçmişine yazılır)',
      confirmButtonClass: action.danger ? 'el-button--danger' : '',
    })
    await changeStatus({ status: action.status, reason: value || null })
    ElMessage.success(`${tenant.summary.name}: ${action.label.toLocaleLowerCase('tr')} yapıldı.`)
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-card shadow="never">
    <div class="tenant-header">
      <CompanyLogo :name="tenant.summary.name" :logo-url="tenant.logoUrl" :size="64" />
      <div class="tenant-header__who">
        <h1>{{ tenant.summary.name }} <el-tag :type="tenantBadge(tenant.summary).tone">{{ tenantBadge(tenant.summary).label }}</el-tag></h1>
        <span>{{ tenant.summary.slug }}{{ tenant.summary.city ? ` · ${tenant.summary.city}` : '' }}</span>
      </div>
      <el-button @click="editing = true"><Pencil :size="16" /> Düzenle</el-button>
      <el-dropdown trigger="click" @command="apply">
        <el-button>Firma durumu <ChevronDown :size="16" /></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="action in lifecycleActions(tenant.summary.status)" :key="action.status" :command="action">
              {{ action.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-descriptions :column="4" border class="tenant-header__facts">
      <el-descriptions-item label="Telefon">{{ tenant.phone ?? '—' }}</el-descriptions-item>
      <el-descriptions-item label="E-posta">{{ tenant.email ?? '—' }}</el-descriptions-item>
      <el-descriptions-item label="Kayıt">{{ dayWithYear(tenant.summary.createdAt) }}</el-descriptions-item>
      <el-descriptions-item label="Kurulum">{{ tenant.summary.setupCompleted ? 'Tamamlandı' : 'Bekliyor' }}</el-descriptions-item>
      <el-descriptions-item label="Kişi">{{ tenant.summary.userCount }}</el-descriptions-item>
      <el-descriptions-item label="Şantiye">{{ tenant.summary.siteCount }}</el-descriptions-item>
      <el-descriptions-item label="Son aktivite">
        {{ tenant.summary.lastActivityAt ? timeAgo(tenant.summary.lastActivityAt) : 'Hiç' }}
      </el-descriptions-item>
      <el-descriptions-item label="Erişim">{{ tenant.summary.open ? 'Açık' : 'Kapalı' }}</el-descriptions-item>
    </el-descriptions>
    <TenantEditDialog v-model:show="editing" :tenant="tenant" />
  </el-card>
</template>

<style scoped>
.tenant-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.tenant-header__who {
  display: grid;
  flex: 1;
  gap: var(--space-1);
}

.tenant-header h1 {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--weight-black);
}

.tenant-header__who span {
  color: var(--text-muted);
}

.tenant-header :deep(.el-button svg) {
  margin: 0 var(--space-1);
}

.tenant-header__facts {
  margin-top: var(--space-5);
}
</style>
