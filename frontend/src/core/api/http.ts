import axios, { type AxiosRequestConfig } from 'axios'

/**
 * Tüm API istekleri buradan geçer. Oturum HttpOnly çerezde durduğu için token taşımıyoruz;
 * tarayıcı çerezi aynı adrese giden her isteğe kendisi ekler.
 */
export const http = axios.create({ withCredentials: true })

/** Orval'ın ürettiği fonksiyonlar istekleri bununla yapar (bkz. orval.config.ts). */
export function apiRequest<T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> {
  return http.request<T>({ ...config, ...options }).then((response) => response.data)
}
