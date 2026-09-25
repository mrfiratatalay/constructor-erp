<script setup lang="ts">
import { QUICK_CHOICES, type QuickChoice, type RollRow } from '@/core/attendance/dailyRoll'
import AttendanceRollRow from '@/desktop/molecules/AttendanceRollRow.vue'

/**
 * Yoklama ekranının "Bugün" listesi: herkes tek listede (önce gelenler), her satırda durumu. Kişiye tıklayınca
 * küçük bir seçim açılır (Geldi · Hastalık · İzinli · Habersiz · Diğer); yazı yazdırılmaz.
 * showSite: birden çok şantiyenin personeli listedeyse kişinin şantiyesi görevinin yanında küçük yazar.
 */
const { title, rows, showSite } = defineProps<{ title: string; rows: RollRow[]; showSite: boolean }>()
const emit = defineEmits<{ mark: [row: RollRow, choice: QuickChoice] }>()
</script>

<template>
  <section class="roll-group">
    <h2 class="roll-group__title">{{ title }}</h2>
    <div class="roll-group__list">
      <el-dropdown v-for="row in rows" :key="row.worker.id" trigger="click" class="roll-group__row"
        @command="(choice: QuickChoice) => emit('mark', row, choice)">
        <AttendanceRollRow :row="row" :show-site="showSite" />
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
</style>
