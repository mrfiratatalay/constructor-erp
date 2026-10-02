// Part 4: şef telefonda yoklama alır (tek dokunuş), ofis aynı kayıtları masaüstünde görür, aylık puantaj, Excel.
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const SCENE = 'attendance'
const MARKS = [['Ali Yılmaz', 'Geldi'], ['Murat Demir', 'Geldi'], ['Emre Kaya', 'İzinli'], ['Hasan Çelik', 'Yarım gün']]

const browser = await openBrowser()
// "office" ile çalıştırılırsa yalnızca ofis kareleri alınır (telefondaki işaretler zaten girilmişse).
const officeOnly = process.argv[2] === 'office'
const phone = await asPerson(browser, 'ayse', 'phone')
const roll = await open(phone, '/yoklama')
await settle(roll, 1200)
const rowOf = (name) => roll.locator('.van-cell', { hasText: name }).first()
if (!officeOnly) await shoot(roll, SCENE, 'phone-0', Object.fromEntries(MARKS.map(([name], index) => [`row${index}`, `.van-cell:has-text("${name}")`])))

for (const [index, [name, status]] of (officeOnly ? [] : MARKS).entries()) {
  await rowOf(name).click()
  const sheet = roll.locator('.van-action-sheet:visible')
  await sheet.waitFor()
  await settle(roll, 450)
  if (index === 0) await shoot(roll, SCENE, 'phone-sheet', { choice: `.van-action-sheet:visible >> text=${status}` })
  await sheet.getByText(status, { exact: true }).first().click()
  await settle(roll, 700)
  await shoot(roll, SCENE, `phone-${index + 1}`, { row: `.van-cell:has-text("${name}")` })
}

const office = await asPerson(browser, 'patron')
const today = await open(office, '/yoklama')
await settle(today, 1200)
await shoot(today, SCENE, 'office-today', { ali: 'text=Ali Yılmaz', tabs: 'text=Puantaj' })
const month = await open(office, '/yoklama?sekme=puantaj&ay=2026-09')
await settle(month, 1500)
await shoot(month, SCENE, 'office-month', { excel: 'button:has-text("Excel indir")', ali: 'text=Ali Yılmaz', board: '.el-table, table' })
// Tablonun sabit sütunu adı gizli bir kopyada da tutar: görünür olana tıklanır.
await month.locator('text=Ali Yılmaz >> visible=true').first().click()
await settle(month, 1000)
await shoot(month, SCENE, 'office-person', { drawer: '.el-drawer', excel: 'button:has-text("Excel indir")' })
await browser.close()
console.log('Part 4 çekimleri tamam.')
