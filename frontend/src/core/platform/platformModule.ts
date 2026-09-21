import type { App, Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/** Her kabuğun (mobile/, desktop/) dışarıya verdiği sözleşme. */
export interface PlatformModule {
  shell: Component
  routes: RouteRecordRaw[]
  /** Kabuğa özel eklentiler (ör. Vant'ın Türkçe dil paketi). */
  install?: (app: App) => void
}
