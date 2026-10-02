// Atalay Yapı'nın çalışma alanını doldurur (onboarding.mjs'ten sonra, bir kez): ekip, şantiyeler, sohbet ve saha,
// puantaj, malzeme, imalat, görevler. Hepsi gerçek API'den, kişilerin kendi rolleriyle; yalnızca saatler SQL'le.
import { openBrowser, openContext } from './lib/browser.mjs'
import { login, secrets } from './lib/stack.mjs'
import { seedChat } from './seed/chat.mjs'
import { seedCatalog, seedShipments } from './seed/materials.mjs'
import { makePhotos, makeVoiceNote } from './seed/media.mjs'
import { seedPuantaj } from './seed/puantaj.mjs'
import { createSites, joinTeam } from './seed/team.mjs'
import { fixTimes } from './seed/times.mjs'
import { seedProduction, seedTasks } from './seed/work.mjs'

const browser = await openBrowser()
const patron = await openContext(browser)
await login(patron, secrets().patron)

console.log('Ekip ve şantiyeler')
const team = await joinTeam(browser, patron)
const sites = await createSites(patron)
const yomra = sites['Yomra Park Konutları']

console.log('Sohbet ve saha')
await seedChat(team, patron, yomra, { photos: await makePhotos(browser), voice: makeVoiceNote() })

console.log('Puantaj')
await seedPuantaj(patron)

console.log('Malzeme')
await seedShipments(team.mehmet.context, await seedCatalog(patron))

console.log('İmalat ve görevler')
await seedProduction(team.ayse.context, yomra)
await seedTasks(team.ayse.context, yomra, team)

console.log('Zaman damgaları')
fixTimes()

await browser.close()
console.log('Seed tamam.')
