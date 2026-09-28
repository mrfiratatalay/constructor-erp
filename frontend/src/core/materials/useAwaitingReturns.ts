import dayjs from 'dayjs'
import { computed } from 'vue'
import { useListAwaitingReturns } from '@/core/api/generated/materials/materials'
import type { ReturnRow } from '@/core/api/generated/model'

/** İadenin gecikme günü: beklenen tarih geçtiyse kaç gün; geçmediyse ya da tarih yoksa 0. */
export function overdueDays(row: Pick<ReturnRow, 'expectedReturnDate'>): number {
  if (!row.expectedReturnDate) return 0
  return Math.max(dayjs().startOf('day').diff(dayjs(row.expectedReturnDate), 'day'), 0)
}

/** Beklenen tarihin yazısı: "3 gün gecikti", "Bugün", "5 gün kaldı" (İlke 2: ekranda ne varsa yazar). */
export function dueText(row: Pick<ReturnRow, 'expectedReturnDate'>): string {
  if (!row.expectedReturnDate) return 'Tarih yazılmadı'
  const days = dayjs(row.expectedReturnDate).diff(dayjs().startOf('day'), 'day')
  if (days < 0) return `${-days} gün gecikti`
  return days === 0 ? 'Bugün dönmeli' : `${days} gün kaldı`
}

/**
 * Beklenen iadeler: ödünç verilip tamamı dönmemiş çıkışlar, beklenen tarihi en yakın olan önde. İade bu listeden
 * alınır ("İade Al"): malzeme ve firma çıkıştan gelir.
 */
export function useAwaitingReturns() {
  const { data, isPending, error } = useListAwaitingReturns()
  const rows = computed(() => data.value ?? [])
  return {
    rows,
    overdue: computed(() => rows.value.filter((row) => overdueDays(row) > 0).length),
    loanOf: (id: string | null) => rows.value.find((row) => row.movementId === id) ?? null,
    isPending,
    error,
  }
}
