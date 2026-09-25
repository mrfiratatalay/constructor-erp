<script setup lang="ts">
import { CircleCheck, CircleX } from 'lucide-vue-next'
import { ATTENDANCE_STATUS } from '@/core/attendance/attendanceLabels'
import { QUICK_CHOICES, reasonLabel, type QuickChoice, type RollRow } from '@/core/attendance/dailyRoll'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Yoklama ekranında bir bölüm ("Gelenler" ya da "Gelmeyenler"): başlığı ve sayısı, altında kişiler. Kişiye
 * tıklayınca küçük bir seçim açılır (Geldi · Hastalık · İzinli · Habersiz · Diğer); yazı yazdırılmaz.
 * showSite: birden çok şantiyenin personeli listedeyse kişinin şantiyesi görevinin yanında küçük yazar.
 */
const { title, rows, showSite } = defineProps<{ title: string; rows: RollRow[]; showSite: boolean }>()
const emit = defineEmits<{ mark: [row: RollRow, choice: QuickChoice] }>()

const detailOf = (row: RollRow) => [row.worker.trade, showSite ? row.siteName : null].filter(Boolean).join(' · ')
const toneOf = (row: RollRow) => ATTENDANCE_STATUS[row.mark.status].tone
</script>

<template>
  <section class="roll-group">
    <h2 class="roll-group__title">{{ title }} <span>{{ rows.length }}</span></h2>
    <div class="roll-group__list">
      <el-dropdown v-for="row in rows" :key="row.worker.id" trigger="click" class="roll-group__row"
        @command="(choice: QuickChoice) => emit('mark', row, choice)">
        <ListRow>
          <template #leading>
            <CircleCheck v-if="row.mark.status === 'PRESENT'" :size="22" :class="`roll-group__icon--${toneOf(row)}`" />
            <CircleX v-else :size="22" :class="`roll-group__icon--${toneOf(row)}`" />
          </template>
          <template #title>{{ row.worker.fullName }}</template>
          <template #meta>
            <StatusTag v-if="row.mark.status !== 'PRESENT'" :tone="toneOf(row)">{{ reasonLabel(row.mark) }}</StatusTag>
          </template>
          <template v-if="detailOf(row)">{{ detailOf(row) }}</template>
        </ListRow>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="choice in QUICK_CHOICES" :key="choice.value" :command="choice.value">
              {{ choice.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </section>
</template>

<style scoped>
.roll-group {
  display: grid;
  gap: var(--space-2);
}

.roll-group__title {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
}

.roll-group__title span {
  margin-left: var(--space-1);
  font-weight: var(--weight-regular);
}

/* Satırlar tek bir beyaz blokta: yoklama geçmişindeki gün listesinin aynısı. */
.roll-group__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}

/* Element Plus açılır menüsü satır boyunca uzansın: satırın her yerine tıklanır. */
.roll-group__row {
  display: block;
  width: 100%;
}

.roll-group__icon--success {
  color: var(--status-success);
}

.roll-group__icon--danger {
  color: var(--status-danger);
}

.roll-group__icon--warning {
  color: var(--status-warning);
}
</style>
