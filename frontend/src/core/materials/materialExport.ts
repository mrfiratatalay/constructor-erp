import type { ExportMaterialReportSheetsItem } from '@/core/api/generated/model'
import { paramsOf, type MovementFilters } from '@/core/materials/movementQuery'

export type ReportSheet = ExportMaterialReportSheetsItem

export const REPORT_SHEETS: { key: ReportSheet; label: string; hint: string }[] = [
  { key: 'MOVEMENTS', label: 'Hareket Raporu', hint: 'Süzgeçlere uyan bütün hareketler' },
  { key: 'STOCK', label: 'Stok Durum Raporu', hint: 'Bugünkü stok, lokasyon sütunlarıyla' },
  { key: 'RETURNS', label: 'Beklenen İadeler', hint: 'Dönmemiş ödünç malzeme' },
]

/**
 * Excel dosyasının adresi: ekrandaki süzgeçler olduğu gibi taşınır, sayfa ve sıralama taşınmaz. Tarayıcı düz
 * bağlantıyla indirir, oturum çerezi gider (malzeme_raporu_2026-09-01_2026-09-30.xlsx).
 */
export function materialExportUrl(filters: MovementFilters, sheets: ReportSheet[]): string {
  const params = new URLSearchParams()
  const {
    page: _page,
    size: _size,
    sort: _sort,
    direction: _direction,
    ...rest
  } = paramsOf(filters, 0)
  Object.entries(rest).forEach(([key, value]) => value != null && params.append(key, String(value)))
  sheets.forEach((sheet) => params.append('sheets', sheet))
  return `/api/material-reports/export?${params.toString()}`
}
