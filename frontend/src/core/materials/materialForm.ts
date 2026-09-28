import type { MaterialRequest, MaterialView } from '@/core/api/generated/model'

/**
 * Malzeme kartı formu: ad, kategori ve ana birim zorunlu; kod, kritik stok eşiği ve açıklama isteğe bağlı. Pasif
 * kart yeni harekette seçilmez, geçmişi yerinde kalır.
 */
export interface MaterialForm {
  name: string
  code: string
  category: string
  unit: string
  minStock: number | null
  description: string
  active: boolean
}

export const emptyMaterialForm = (name = ''): MaterialForm => ({
  name,
  code: '',
  category: '',
  unit: '',
  minStock: null,
  description: '',
  active: true,
})

export const materialFormOf = (material: MaterialView): MaterialForm => ({
  name: material.name,
  code: material.code ?? '',
  category: material.category,
  unit: material.unit,
  minStock: material.minStock ?? null,
  description: material.description ?? '',
  active: material.active,
})

export function materialFormError(form: MaterialForm): string {
  if (!form.name.trim()) return 'Malzemenin adını yaz.'
  if (!form.category.trim()) return 'Kategorisini seç ya da yaz.'
  if (!form.unit.trim()) return 'Ana birimini seç ya da yaz (Torba, Ton, Adet…).'
  if (form.minStock !== null && form.minStock < 0) return 'Kritik stok eksi olamaz.'
  return ''
}

export const materialRequestOf = (form: MaterialForm): MaterialRequest => ({
  name: form.name.trim(),
  code: form.code.trim() || null,
  category: form.category.trim(),
  unit: form.unit.trim(),
  minStock: form.minStock,
  description: form.description.trim() || null,
  active: form.active,
})
