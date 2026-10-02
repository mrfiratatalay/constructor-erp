// Part 2: Atalay Yapı'nın İskele ERP'ye gelişi, baştan sona gerçek ürün akışıyla.
// Sıfırlanmış yığında bir kez çalışır (node scripts/stack.mjs reset): başvuru, firma ve kurulum gerçekten oluşur.
import { openBrowser, openContext } from './lib/browser.mjs'
import { login, secrets } from './lib/stack.mjs'
import { adminFlow, seedOtherLeads } from './onboarding/admin.mjs'
import { makeLogo } from './onboarding/logo.mjs'
import { setupFlow } from './onboarding/setup.mjs'
import { visitorFlow } from './onboarding/visitor.mjs'

const browser = await openBrowser()
const admin = await openContext(browser)
await login(admin, secrets().admin)

console.log('Ziyaretçi: fiyatlar ve başvuru')
await seedOtherLeads(await openContext(browser), admin)
const visitor = await openContext(browser)
await visitorFlow(await visitor.newPage())

console.log('Platform yönetimi: firmaya dönüştür, ödeme, kurulum bağlantısı')
const link = await adminFlow(admin)

console.log('Patron: kurulum sihirbazı')
const patron = await openContext(browser)
await setupFlow(patron, link, await makeLogo(browser))

await browser.close()
console.log('Part 2 çekimleri tamam.')
