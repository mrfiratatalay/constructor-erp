import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'

/** İşin fotoğrafı: 640×480 deneme görüntüsü. */
export const WORK_PHOTO = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/is-foto.jpg',
)

/**
 * Görev ve iş teslimi iki kabukta aynı akıştır; yalnızca parçaların yeri farklıdır (mobil Vant, masaüstü Element
 * Plus). Açılır pencereler mobilde alttan (van-popup), masaüstünde ortada (el-dialog) açılır.
 */
export function deliveryParts(page: Page, mobile: boolean) {
  const composer = page.locator(mobile ? '.site-composer' : '.composer-bar')
  const panel = (text: string) =>
    mobile
      ? page.locator('.van-popup:not(.van-action-sheet)').filter({ hasText: text })
      : page.getByRole('dialog').filter({ hasText: text })
  const assignPanel = panel('Görevi ver')
  /** Sohbetin ＋ menüsünü açar; menüyü döner. */
  const plusMenu = async () => {
    await composer.getByRole('button', { name: 'Ekle', exact: true }).click()
    return page.locator(mobile ? '.van-action-sheet:visible' : '.el-dropdown-menu:visible')
  }
  return {
    cards: page.getByTestId('delivery-card'),
    taskCards: page.getByTestId('task-card'),
    plusMenu,
    /** Sohbetin ＋ menüsünden bir pencere açar ("✅ İş Teslim Et" ya da "📋 Görev"). */
    openFromPlus: async (item = '✅ İş Teslim Et') => {
      await (await plusMenu()).getByText(item).click()
    },
    /** "📋 Görev" penceresindeki üç soru: ne yapılacak, kim yapacak (listeden), ne zaman (Yarın). */
    assignTask: async (title: string, assignee: string) => {
      await assignPanel.getByPlaceholder('Kalıp sökülecek').fill(title)
      await (
        mobile ? assignPanel.getByText('Kişi seç') : assignPanel.locator('.assign__select')
      ).click()
      const people = mobile
        ? '.van-action-sheet__item:visible'
        : '.el-select-dropdown__item:visible'
      await page.locator(people, { hasText: assignee }).click()
      await assignPanel.getByText('Yarın', { exact: true }).click()
      await assignPanel.getByRole('button', { name: '📋 Görevi ver' }).click()
    },
    deliverPanel: panel('İŞİ TESLİM ET'),
    reviewPanel: panel('EKSİK VAR'),
    missingPanel: panel('Neresi eksik'),
    /** Eksik notunun yazıldığı alan: mobilde görünür "Not" etiketli, masaüstünde adıyla. */
    noteField: mobile ? page.getByLabel('Not', { exact: true }) : page.getByLabel('Eksik notu'),
  }
}
