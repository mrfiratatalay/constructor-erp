import { computed, ref } from 'vue'
import { useListTenants } from '@/core/api/generated/platform/platform'
import type { TenantRow } from '@/core/api/generated/model'

export type TenantFilter = 'all' | 'open' | 'locked' | 'suspended' | 'setup'

export const TENANT_FILTERS: { key: TenantFilter; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'open', label: 'Aktif' },
  { key: 'locked', label: 'Süresi dolmuş' },
  { key: 'suspended', label: 'Askıda' },
  { key: 'setup', label: 'Kurulum bekliyor' },
]

function matches(row: TenantRow, filter: TenantFilter): boolean {
  if (filter === 'open') return row.open
  if (filter === 'locked') return row.status === 'ACTIVE' && !row.open
  if (filter === 'suspended') return row.status !== 'ACTIVE'
  if (filter === 'setup') return !row.setupCompleted
  return true
}

const text = (row: TenantRow) => [row.name, row.slug, row.city ?? '', row.planName ?? ''].join(' ').toLocaleLowerCase('tr')

/** Firma listesi: arama (ad, adres, şehir, paket) ve durum süzgeci; her süzgecin sayısı sekmede yazar. */
export function useTenantList() {
  const { data, isPending } = useListTenants()
  const search = ref('')
  const filter = ref<TenantFilter>('all')
  const tenants = computed(() => {
    const needle = search.value.trim().toLocaleLowerCase('tr')
    return (data.value ?? []).filter((row) => matches(row, filter.value) && text(row).includes(needle))
  })
  const counts = computed(() =>
    Object.fromEntries(TENANT_FILTERS.map(({ key }) => [key, (data.value ?? []).filter((row) => matches(row, key)).length])),
  )
  return { tenants, search, filter, counts, isPending }
}
