import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'

/** İşin fotoğrafı: 640×480 deneme görüntüsü. */
export const WORK_PHOTO = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/is-foto.jpg',
)

/**
 * İş teslimi iki kabukta aynı akıştır; yalnızca parçaların yeri farklıdır (mobil Vant, masaüstü Element Plus).
 * Açılır pencereler mobilde alttan (van-popup), masaüstünde ortada (el-dialog) açılır.
 */
export function deliveryParts(page: Page, mobile: boolean) {
  const composer = page.locator(mobile ? '.site-composer' : '.composer-bar')
  const panel = (text: string) =>
    mobile
      ? page.locator('.van-popup:not(.van-action-sheet)').filter({ hasText: text })
      : page.getByRole('dialog').filter({ hasText: text })
  return {
    cards: page.getByTestId('delivery-card'),
    /** Sohbetin ＋ menüsünden "İş Teslim Et" penceresini açar. */
    openFromPlus: async () => {
      await composer.getByRole('button', { name: 'Ekle', exact: true }).click()
      const menu = page.locator(mobile ? '.van-action-sheet' : '.el-dropdown-menu:visible')
      await menu.getByText('✅ İş Teslim Et').click()
    },
    deliverPanel: panel('İŞİ TESLİM ET'),
    reviewPanel: panel('EKSİK VAR'),
    missingPanel: panel('Neresi eksik'),
    /** Eksik notunun yazıldığı alan: mobilde görünür "Not" etiketli, masaüstünde adıyla. */
    noteField: mobile ? page.getByLabel('Not', { exact: true }) : page.getByLabel('Eksik notu'),
  }
}
