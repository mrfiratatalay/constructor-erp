import type { InternalAxiosRequestConfig } from 'axios'

/** Çok parçalı (multipart) gövdenin alanları: yazılar ve dosyalar ayrı. */
export interface FormFields {
  text: Record<string, string>
  files: Record<string, File[]>
}

/** Sahte backend'e gelen istek: adresteki parçalar (`:siteId`), sorgu, JSON gövdesi ya da form. */
export interface DemoRequest {
  params: Record<string, string>
  query: URLSearchParams
  body: unknown
  form: FormFields
}

// URL sınıfı göreli adresi tek başına çözemez; taban yalnızca ayrıştırmak için, hiçbir yere istek gitmez.
const BASE = 'http://demo.invalid'

export function pathOf(config: InternalAxiosRequestConfig): string {
  return new URL(config.url ?? '', BASE).pathname
}

/** Orval sorgu parametrelerini `params` ile verir; adrese gömülü sorgu da olabilir, ikisi birleşir. */
export function queryOf(config: InternalAxiosRequestConfig): URLSearchParams {
  const url = new URL(config.url ?? '', BASE)
  const params = (config.params ?? {}) as Record<string, unknown>
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  }
  return url.searchParams
}

function formOf(data: FormData): FormFields {
  const form: FormFields = { text: {}, files: {} }
  data.forEach((value, key) => {
    if (typeof value === 'string') form.text[key] = value
    else (form.files[key] ??= []).push(value)
  })
  return form
}

/** Axios JSON gövdeyi adaptöre gelmeden yazıya çevirir; form (fotoğraf, belge) olduğu gibi gelir. */
export function bodyOf(config: InternalAxiosRequestConfig): Pick<DemoRequest, 'body' | 'form'> {
  const data: unknown = config.data
  if (data instanceof FormData) return { body: undefined, form: formOf(data) }
  const body: unknown = typeof data === 'string' && data.length > 0 ? JSON.parse(data) : data
  return { body, form: { text: {}, files: {} } }
}
