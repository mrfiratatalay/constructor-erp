import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { monthKey } from '@/core/format/dates'

const MONTH = /^\d{4}-\d{2}$/

/**
 * Yoklama geçmişinde seçili ay adreste durur (?ay=2026-09): geri tuşu ve paylaşılan bağlantı aynı ayı açar,
 * gün detayından kişiye geçerken ay korunur. Adreste yoksa (ya da bozuksa) bu ay. Gelecek aya gidilmez.
 */
export function useMonthParam() {
  const route = useRoute()
  const router = useRouter()
  const month = computed(() => {
    const value = route.query.ay
    return typeof value === 'string' && MONTH.test(value) ? value : monthKey()
  })
  const setMonth = (next: string) => router.replace({ query: { ...route.query, ay: next } })
  return { month, setMonth, isCurrentMonth: computed(() => month.value >= monthKey()) }
}
