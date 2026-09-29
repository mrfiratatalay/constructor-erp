<script setup lang="ts">
import { PAYMENT_METHODS, stateOf } from '@/core/billing/billingLabels'
import { dayWithYear } from '@/core/format/dates'
import { formatMoney } from '@/core/format/money'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

/** Abonelik dönemleri ve alınan ödemeler: patron ne ödediğini ve hangi dönemin açık olduğunu görür. */
const { subscription } = useCompanySubscription()
</script>

<template>
  <el-card v-if="subscription" shadow="never">
    <el-tabs>
      <el-tab-pane :label="`Dönemler (${subscription.periods.length})`">
        <el-table :data="subscription.periods" empty-text="Henüz dönem yok">
          <el-table-column label="Paket" prop="planName" />
          <el-table-column label="Başlangıç"><template #default="{ row }">{{ dayWithYear(row.startsOn) }}</template></el-table-column>
          <el-table-column label="Bitiş"><template #default="{ row }">{{ dayWithYear(row.endsOn) }}</template></el-table-column>
          <el-table-column label="Aylık"><template #default="{ row }">{{ formatMoney(row.monthlyPrice) }}</template></el-table-column>
          <el-table-column label="Durum" width="140">
            <template #default="{ row }">
              <el-tag :type="stateOf(row.state).tone" size="small">{{ stateOf(row.state).label }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`Ödemeler (${subscription.payments.length})`">
        <el-table :data="subscription.payments" empty-text="Henüz kayıtlı ödeme yok">
          <el-table-column label="Tarih"><template #default="{ row }">{{ dayWithYear(row.paidOn) }}</template></el-table-column>
          <el-table-column label="Tutar"><template #default="{ row }"><b>{{ formatMoney(row.amount) }}</b></template></el-table-column>
          <el-table-column label="Yöntem"><template #default="{ row }">{{ PAYMENT_METHODS[row.method] }}</template></el-table-column>
          <el-table-column label="Açıklama" prop="description" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
