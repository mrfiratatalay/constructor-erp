// Part 4 ofis kareleri: tablonun sabit sütunlarındaki gizli kopyalar yerine görünür öğelerin kutuları.
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const browser = await openBrowser()
const office = await asPerson(browser, 'patron')
const month = await open(office, '/yoklama?sekme=puantaj&ay=2026-09')
await settle(month, 1500)
const visible = { excel: 'text=Excel indir >> visible=true', ali: 'text=Ali Yılmaz >> visible=true' }
await shoot(month, 'attendance', 'office-month', visible)
await month.locator(visible.ali).first().click()
await settle(month, 1000)
await shoot(month, 'attendance', 'office-person', { drawer: '[role=dialog] >> visible=true', excel: visible.excel })
await browser.close()
