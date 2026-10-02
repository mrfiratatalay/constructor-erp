// Part 5 ek kare: yeni sevkiyattan sonra bütün hareketler (iade, çimento, demir satırlarıyla).
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const browser = await openBrowser()
const page = await open(await asPerson(browser, 'mehmet'), '/malzemeler')
await settle(page, 1500)
await shoot(page, 'materials', 'all-after', {
  table: '.el-table', summary: 'text=GERİ BEKLENEN', returned: '.el-table__row:has-text("SV-000006")',
  cement: '.el-table__row:has-text("SV-000005")', newest: '.el-table__row:has-text("SV-000010")',
})
await browser.close()
