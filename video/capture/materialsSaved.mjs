// Part 5 ek kare: kaydedilen sevkiyatın ayrıntısı (saat demo gününe çekildikten sonra).
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const browser = await openBrowser()
const page = await open(await asPerson(browser, 'mehmet'), '/malzemeler?hareket=a5b9f299-9b39-41ed-99ce-557a9f54dd2a')
await settle(page, 1500)
await shoot(page, 'materials', 'saved', { drawer: '.movement-detail', first: '.el-table__row' })
await browser.close()
