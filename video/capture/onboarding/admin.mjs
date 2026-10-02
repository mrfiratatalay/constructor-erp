// Platform yönetimi: başvurular → "Firmaya dönüştür" → paket + Havale/EFT ödemesi → kurulum bağlantısı.
import { settle, shoot } from '../lib/shoot.mjs'
import { api, secrets } from '../lib/stack.mjs'
import { literal, sql } from '../lib/sql.mjs'

const SCENE = 'onboarding'

/** Listede yalnız kalmasın diye birkaç kurgusal başvuru: farklı şehir, durum ve geçmiş tarih. */
const OTHER_LEADS = [
  { companyName: 'Karadeniz Konut', contactName: 'Hakan Uçar', phone: '0500 210 10 10', city: 'Rize', siteCount: 2, status: 'CONTACTED', daysAgo: 4 },
  { companyName: 'Doğu Yapı', contactName: 'Burak Er', phone: '0500 310 20 20', city: 'Erzurum', siteCount: 5, status: 'CONTACTED', daysAgo: 3 },
  { companyName: 'Sürmene İnşaat', contactName: 'Oya Tan', phone: '0500 410 30 30', city: 'Trabzon', siteCount: 1, status: 'NEW', daysAgo: 1 },
]

export const seedOtherLeads = async (anonymous, admin) => {
  for (const lead of OTHER_LEADS) {
    const { status, daysAgo, ...form } = lead
    await api(anonymous, 'POST', '/api/public/sales-requests', form)
    sql(`update sales_requests set created_at = now() - interval '${daysAgo} days' - interval '3 hours'
         where company_name = ${literal(form.companyName)};`)
  }
  const requests = await api(admin, 'GET', '/api/platform/sales-requests')
  for (const lead of OTHER_LEADS.filter((item) => item.status !== 'NEW')) {
    const request = requests.find((item) => item.companyName === lead.companyName)
    await api(admin, 'PATCH', `/api/platform/sales-requests/${request.id}`, { status: lead.status, notes: 'Görüşme yapıldı' })
  }
}

const atalayRow = '.el-table__row:has-text("Atalay Yapı")'

/** Bağlantının anahtarı filmde okunmaz: alan adı görünür, yol maskelenir (spesifikasyon Madde 31). */
const maskLink = async (page) =>
  page.evaluate(() => {
    const input = [...document.querySelectorAll('.el-dialog input')].find((field) => field.value.includes('/kurulum/'))
    const real = input.value
    input.value = real.replace(/\/kurulum\/.+$/, '/kurulum/••••••••••••')
    return real
  })

export const adminFlow = async (context) => {
  const page = await context.newPage()
  await page.goto(`${secrets().web}/platform-admin/basvurular`)
  await settle(page, 500)
  await shoot(page, SCENE, 'leads', { row: atalayRow, convert: `${atalayRow} button:has-text("Firmaya dönüştür")` })
  await page.locator(`${atalayRow} button:has-text("Firmaya dönüştür")`).click()
  const dialog = page.locator('.el-dialog:visible')
  await dialog.waitFor()
  await settle(page, 500)
  await shoot(page, SCENE, 'convert', { dialog: '.el-dialog:visible', name: '.el-dialog:visible input' })
  // "Ödeme alındı" anahtarı açık gelir; tutar paketten hesaplanır. Yalnızca yöntem ve not değişir.
  await dialog.getByText('Havale / EFT').click()
  await dialog.getByPlaceholder('ör. Elden alındı, makbuz no 12').fill('Havale/EFT — ilk dönem')
  // Pencere en alta kaydırılır: ödeme bölümü ve "Firmayı aç" butonu aynı karede görünsün (imleç oraya tıklayacak).
  await page.getByRole('dialog', { name: 'Yeni firma (manuel satış)' }).evaluate((overlay) => { overlay.scrollTop = overlay.scrollHeight })
  await settle(page, 300)
  await shoot(page, SCENE, 'convert-payment', {
    dialog: '.el-dialog:visible', payment: '.el-dialog:visible .payment-fields', submit: '.el-dialog:visible .el-dialog__footer .el-button--primary',
  })
  await dialog.getByRole('button', { name: 'Firmayı aç ve bağlantı üret' }).click()
  await page.getByText('Kurulum bağlantısı hazır').waitFor()
  await settle(page, 500)
  const link = await maskLink(page)
  await shoot(page, SCENE, 'link', { dialog: '.el-dialog:visible', link: '.el-dialog:visible input' })
  await page.close()
  return link
}
