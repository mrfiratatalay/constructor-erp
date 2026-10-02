// Part 7: aynı çalışma alanı, üç rol, üç cihaz: şefin telefonu (saha), deponun telefonu (malzeme), patronun bilgisayarı.
import { openBrowser } from './lib/browser.mjs'
import { asPerson, open, siteIdOf } from './lib/people.mjs'
import { settle, shoot } from './lib/shoot.mjs'

const browser = await openBrowser()
const lead = await asPerson(browser, 'ayse', 'phone')
const yomra = await siteIdOf(lead, 'Yomra Park Konutları')
const field = await open(lead, `/santiyeler/${yomra}/saha`)
await settle(field, 1500)
await shoot(field, 'devices', 'phone-field')

const depot = await asPerson(browser, 'mehmet', 'phone')
const materials = await open(depot, '/malzemeler')
await settle(materials, 1500)
await shoot(materials, 'devices', 'phone-materials')

const office = await asPerson(browser, 'patron')
const overview = await open(office, `/santiyeler/${yomra}/saha`)
await settle(overview, 1500)
await shoot(overview, 'devices', 'desktop-field')
const sites = await open(office, '/santiyeler')
await settle(sites, 1200)
await shoot(sites, 'devices', 'desktop-sites')
await browser.close()
console.log('Part 7 çekimleri tamam.')
