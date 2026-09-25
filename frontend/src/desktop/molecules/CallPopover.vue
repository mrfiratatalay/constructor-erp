<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ChevronDown, Copy, Phone } from 'lucide-vue-next'
import { formatPhone } from '@/core/format/phone'
import { callLabel, type Callable } from '@/core/sites/participants'

/**
 * Başlıktaki 📞, masaüstünde. Bilgisayar telefon edemez (tel: bağlantısı en fazla FaceTime'ı açar): düğme aramayı
 * denemez, kimin hangi numarada olduğunu gösterir; numara elindeki telefondan aranır ya da kopyalanır.
 * Tek kişide düğmede adı yazar ("📞 Musa"), birden fazlada "📞 Ara ▾".
 */
const { people } = defineProps<{ people: Callable[] }>()

async function copy(person: Callable) {
  const copied = await navigator.clipboard?.writeText(person.phone).then(() => true, () => false)
  if (copied) ElMessage.success(`${person.fullName}: numara kopyalandı`)
  else ElMessage.error('Kopyalanamadı')
}
</script>

<template>
  <el-popover v-if="people.length" trigger="click" placement="bottom-end" :width="320">
    <template #reference>
      <el-button class="call-popover__button">
        <Phone :size="15" />{{ callLabel(people) }}<ChevronDown v-if="people.length > 1" :size="14" />
      </el-button>
    </template>
    <ul class="call-popover__list">
      <li v-for="person in people" :key="person.id" class="call-popover__row">
        <span class="call-popover__who">
          <strong>{{ person.fullName }}</strong>
          <small>{{ person.role }} · {{ formatPhone(person.phone) }}</small>
        </span>
        <el-button text size="small" :aria-label="`${person.fullName} numarasını kopyala`" @click="copy(person)">
          <Copy :size="14" class="call-popover__icon" />Kopyala
        </el-button>
      </li>
    </ul>
  </el-popover>
</template>

<style scoped>
.call-popover__button :deep(span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.call-popover__list {
  display: grid;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.call-popover__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.call-popover__row + .call-popover__row {
  border-top: 1px solid var(--border-soft);
}

.call-popover__who {
  display: grid;
  min-width: 0;
}

.call-popover__who strong {
  overflow: hidden;
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Numara okunur gruplarla ve eşit genişlikli rakamlarla: dayın elindeki telefona bakarak tuşlar. */
.call-popover__who small {
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
}

.call-popover__icon {
  margin-right: 4px;
}
</style>
